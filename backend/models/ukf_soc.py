"""
Unscented Kalman Filter (UKF) for Battery State of Charge Estimation

Based on the electrochemical equivalent circuit model (ECM) with:
  - R0: internal ohmic resistance
  - R1/C1: RC network for polarisation dynamics
  - OCV-SOC lookup table for LFP chemistry

Target RMSE: 0.23% SOC per AEGIS specification
Reference: Wan & van der Merwe (2000) — "The Unscented Kalman Filter for Nonlinear Estimation"
"""

import numpy as np
from typing import Tuple


# ── OCV–SOC lookup table for LFP chemistry ────────────────────────────────────
# Source: published LFP characterisation data (CALCE dataset)
_SOC_POINTS = np.array([0.0, 0.05, 0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 1.0])
_OCV_POINTS = np.array([3.00, 3.12, 3.20, 3.26, 3.28, 3.29, 3.30, 3.31, 3.32, 3.34, 3.38, 3.65])


def ocv_from_soc(soc: float) -> float:
    """Interpolate Open Circuit Voltage from SOC using LFP lookup table."""
    return float(np.interp(np.clip(soc, 0.0, 1.0), _SOC_POINTS, _OCV_POINTS))


class UKFStateOfCharge:
    """
    Minimal UKF implementation for SOC estimation.

    State vector: x = [SOC, V_RC]
      - SOC:  State of Charge (0 to 1)
      - V_RC: Voltage across RC polarisation network (V)

    Parameters tuned for Tata Nexon LFP 40.5 kWh pack.
    In production, parameters are loaded from the battery's Digital Passport
    Technical Data submodel (OEM-provided characterisation data).
    """

    # ── Battery parameters (LFP, 40.5 kWh pack) ──────────────────────────────
    CAPACITY_AH = 114.0     # nominal capacity in Ampere-hours
    R0          = 0.0035    # internal resistance (Ω)
    R1          = 0.0012    # RC resistance (Ω)
    C1          = 3200.0    # RC capacitance (F)
    DT          = 1.0       # sample interval (seconds)

    # ── UKF tuning parameters ─────────────────────────────────────────────────
    ALPHA = 1e-3    # spread of sigma points
    BETA  = 2.0     # prior knowledge (Gaussian = 2)
    KAPPA = 0.0

    def __init__(self, initial_soc: float = 0.72):
        n = 2  # state dimension

        # Initial state
        self.x = np.array([initial_soc, 0.0])

        # Initial covariance
        self.P = np.diag([0.01, 0.001])

        # Process noise covariance Q
        self.Q = np.diag([1e-6, 1e-8])

        # Measurement noise covariance R (voltage measurement noise ~5 mV)
        self.R = np.array([[2.5e-5]])

        # UKF lambda
        lam       = self.ALPHA**2 * (n + self.KAPPA) - n
        self.lam  = lam
        self.n    = n

        # Weights for mean and covariance
        self.Wm = np.full(2 * n + 1, 1 / (2 * (n + lam)))
        self.Wc = np.full(2 * n + 1, 1 / (2 * (n + lam)))
        self.Wm[0] = lam / (n + lam)
        self.Wc[0] = lam / (n + lam) + (1 - self.ALPHA**2 + self.BETA)

    def _sigma_points(self) -> np.ndarray:
        """Generate 2n+1 sigma points."""
        n  = self.n
        S  = np.linalg.cholesky((n + self.lam) * self.P)
        sp = np.zeros((2 * n + 1, n))
        sp[0] = self.x
        for i in range(n):
            sp[i + 1]     = self.x + S[i]
            sp[i + 1 + n] = self.x - S[i]
        return sp

    def _f(self, x: np.ndarray, current: float) -> np.ndarray:
        """State transition function (discrete ECM)."""
        soc  = x[0] - (current * self.DT) / (3600 * self.CAPACITY_AH)
        v_rc = np.exp(-self.DT / (self.R1 * self.C1)) * x[1] + \
               self.R1 * (1 - np.exp(-self.DT / (self.R1 * self.C1))) * current
        return np.array([np.clip(soc, 0.0, 1.0), v_rc])

    def _h(self, x: np.ndarray, current: float) -> np.ndarray:
        """Measurement function — terminal voltage."""
        v_terminal = ocv_from_soc(x[0]) - self.R0 * current - x[1]
        return np.array([v_terminal])

    def _temperature_correction(self, R0: float, temp_c: float) -> float:
        """Arrhenius correction for internal resistance at non-standard temperature."""
        T_ref, Ea_R = 25.0, 1500.0
        return R0 * np.exp(Ea_R * (1 / (temp_c + 273.15) - 1 / (T_ref + 273.15)))

    def update(
        self,
        voltage_measured: float,
        current: float,
        temperature_c: float = 25.0,
    ) -> Tuple[float, float]:
        """
        One UKF predict-update cycle.

        Args:
            voltage_measured: Terminal voltage from BMS (V)
            current:          Pack current (A, positive = discharge)
            temperature_c:    Cell temperature (°C)

        Returns:
            (estimated_soc, uncertainty_std)  — both as fractions (0–1)
        """
        # Temperature-corrected resistance
        self.R0 = self._temperature_correction(0.0035, temperature_c)

        sigma = self._sigma_points()

        # ── Predict ───────────────────────────────────────────────────────────
        sigma_pred = np.array([self._f(sp, current) for sp in sigma])
        x_pred     = np.sum(self.Wm[:, None] * sigma_pred, axis=0)
        P_pred     = self.Q.copy()
        for i, sp in enumerate(sigma_pred):
            d        = sp - x_pred
            P_pred  += self.Wc[i] * np.outer(d, d)

        # ── Update ────────────────────────────────────────────────────────────
        sigma_meas = np.array([self._h(sp, current) for sp in sigma_pred])
        z_pred     = np.sum(self.Wm[:, None] * sigma_meas, axis=0)
        S          = self.R.copy()
        Pxz        = np.zeros((self.n, 1))
        for i, sp in enumerate(sigma_pred):
            dz   = sigma_meas[i] - z_pred
            dx   = sp - x_pred
            S   += self.Wc[i] * np.outer(dz, dz)
            Pxz += self.Wc[i] * np.outer(dx, dz)

        K         = Pxz @ np.linalg.inv(S)
        innovation = np.array([voltage_measured]) - z_pred
        self.x    = x_pred + (K @ innovation).flatten()
        self.P    = P_pred - K @ S @ K.T
        self.x[0] = np.clip(self.x[0], 0.0, 1.0)

        uncertainty = float(np.sqrt(self.P[0, 0]))
        return float(self.x[0]), uncertainty
