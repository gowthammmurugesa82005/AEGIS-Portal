"""
AEGIS Mock Data Engine
Generates realistic, stateful EV telemetry and analytics for Testing Mode.
In production, this module is replaced by live AEGIS backend agent data.
"""

import json, os, random, math
from datetime import datetime, timedelta, timezone
from pathlib import Path

MOCK_DIR = Path(__file__).parent.parent / "mock_data"

# ── Load static JSON fixtures ─────────────────────────────────────────────────
def _load(filename: str) -> dict | list:
    with open(MOCK_DIR / filename, "r") as f:
        return json.load(f)

# ── Test credentials ──────────────────────────────────────────────────────────
TEST_CHASSIS = "AEGIS2024TEST001"
TEST_OTP     = "123456"
TEST_MOBILE  = "+91 98XXXX7890"

# ── In-memory OTP store (use Redis in production) ─────────────────────────────
_otp_store: dict[str, dict] = {}

def store_otp(session_id: str, otp: str, chassis: str) -> None:
    _otp_store[session_id] = {
        "otp": otp,
        "chassis": chassis,
        "expires_at": (datetime.now(timezone.utc) + timedelta(minutes=5)).timestamp(),
    }

def verify_otp(session_id: str, otp: str) -> tuple[bool, str]:
    """Returns (is_valid, chassis_number | error_message)"""
    record = _otp_store.get(session_id)
    if not record:
        return False, "Invalid or expired session"
    if record["expires_at"] < datetime.now(timezone.utc).timestamp():
        del _otp_store[session_id]
        return False, "OTP expired. Please request a new one."
    if record["otp"] != otp:
        return False, "Incorrect OTP. Please try again."
    del _otp_store[session_id]
    return True, record["chassis"]

def purge_expired_otps() -> None:
    now = datetime.now(timezone.utc).timestamp()
    expired = [k for k, v in _otp_store.items() if v["expires_at"] < now]
    for k in expired:
        del _otp_store[k]

# ── Chassis lookup (mocks VAHAN API) ─────────────────────────────────────────
def lookup_chassis(chassis: str) -> dict | None:
    """
    In production: query VAHAN/MoRTH API.
    In testing: return mock vehicle data for known test chassis.
    """
    vehicles = _load("vehicles.json")
    return next((v for v in vehicles if v["chassisNumber"] == chassis), None)

# ── Live telemetry simulation ─────────────────────────────────────────────────
# Stateful SOC that slowly drains (simulates driving)
_current_soc: float = 72.0

def get_live_telemetry(chassis: str) -> dict:
    global _current_soc
    # Simulate slight SOC drain on each call
    _current_soc = max(5.0, _current_soc - random.uniform(0.02, 0.08))

    soh         = 87.0
    rated_range = 437
    eff_factor  = soh / 100 * (1 - random.uniform(0.01, 0.03))
    est_range   = int(rated_range * (_current_soc / 100) * eff_factor)

    return {
        "soc":               round(_current_soc, 1),
        "soh":               soh,
        "estimatedRangeKm":  est_range,
        "isCharging":        False,
        "chargingRateKw":    0.0,
        "timeToFullCharge":  "—",
        "recommendedChargeTarget": 80,
        "currentSpeedKmh":   0.0,
        "odometreKm":        18420,
        "cabinTempC":        round(32 + random.uniform(-0.5, 0.5), 1),
        "ambientTempC":      34.0,
        "lastUpdatedAt":     datetime.now(timezone.utc).isoformat(),
    }

def reset_soc(target: float = 72.0) -> None:
    global _current_soc
    _current_soc = target

# ── Health score ──────────────────────────────────────────────────────────────
def get_health_score(chassis: str) -> dict:
    base = _load("vehicles.json")
    vehicle = next((v for v in base if v["chassisNumber"] == chassis), None)
    if not vehicle:
        return {}

    battery   = 87.0
    mech      = 82.0
    charging  = 91.0
    software  = 95.0
    tyres     = 70.0
    overall   = round(battery * 0.35 + mech * 0.25 + charging * 0.20 + software * 0.10 + tyres * 0.10, 1)

    if overall >= 80:   grade, label = "excellent", "Excellent Condition"
    elif overall >= 60: grade, label = "good",      "Good — Monitor Tyres & Brakes"
    elif overall >= 40: grade, label = "attention", "Needs Attention"
    else:               grade, label = "critical",  "Critical — Contact Dealer"

    return {
        "overall":          overall,
        "batteryHealth":    battery,
        "mechanicalHealth": mech,
        "chargingSystem":   charging,
        "softwareStatus":   software,
        "tyresBrakes":      tyres,
        "grade":            grade,
        "gradeLabel":       label,
    }

# ── SOH trend history ─────────────────────────────────────────────────────────
def get_soh_trend(chassis: str) -> list[dict]:
    return [
        {"date": "2023-05-01", "soh": 100.0, "cycleCount": 0},
        {"date": "2023-07-01", "soh": 99.1,  "cycleCount": 18},
        {"date": "2023-09-01", "soh": 98.2,  "cycleCount": 41,  "event": "stress", "eventLabel": "High-temp park"},
        {"date": "2023-11-01", "soh": 97.4,  "cycleCount": 67},
        {"date": "2024-01-01", "soh": 96.5,  "cycleCount": 94},
        {"date": "2024-03-01", "soh": 95.1,  "cycleCount": 121, "event": "stress", "eventLabel": "Deep discharge"},
        {"date": "2024-05-01", "soh": 93.8,  "cycleCount": 149},
        {"date": "2024-07-01", "soh": 92.3,  "cycleCount": 178, "event": "service", "eventLabel": "Annual service"},
        {"date": "2024-09-01", "soh": 90.9,  "cycleCount": 208},
        {"date": "2024-11-01", "soh": 89.5,  "cycleCount": 237},
        {"date": "2025-01-01", "soh": 88.4,  "cycleCount": 268},
        {"date": "2025-03-01", "soh": 87.8,  "cycleCount": 291, "event": "update", "eventLabel": "BMS v2.4"},
        {"date": "2025-05-01", "soh": 87.0,  "cycleCount": 312},
    ]

# ── RUL estimate (wraps UKF model output) ────────────────────────────────────
def get_rul_estimate(chassis: str) -> dict:
    return {
        "estimatedYears70Soh":       4.8,
        "estimatedYears50Soh":       9.2,
        "confidenceLow":             4.2,
        "confidenceHigh":            5.6,
        "primaryDegradationFactor":  "High-temperature parking accelerates cell ageing",
        "projectedSoh1Year":         84.5,
        "projectedSoh3Year":         79.1,
        "projectedSoh5Year":         73.8,
    }

# ── Carbon data ───────────────────────────────────────────────────────────────
def get_carbon_data(chassis: str) -> dict:
    return _load("carbon.json")

# ── Convenience loaders ────────────────────────────────────────────────────────
def get_battery_passport(chassis: str) -> dict:
    return _load("battery_passport.json")

def get_stress_events(chassis: str) -> list:
    return _load("stress_events.json")

def get_maintenance_items(chassis: str) -> list:
    return _load("maintenance.json")

def get_service_history(chassis: str) -> list:
    return _load("service_history.json")

def get_insurance_policy(chassis: str) -> dict:
    return _load("insurance.json")

def get_claims(chassis: str) -> list:
    return _load("claims.json")

def get_dues(chassis: str) -> list:
    return _load("dues.json")

def get_transactions(chassis: str) -> list:
    return _load("transactions.json")

def get_dealers(lat: float, lon: float, radius_km: float = 100) -> list:
    dealers = _load("dealers.json")
    # Simple distance filter based on pre-computed distances
    return [d for d in dealers if d.get("distanceKm", 999) <= radius_km]

def get_alerts(chassis: str) -> list:
    return _load("alerts.json")

def get_trips(chassis: str, limit: int = 10) -> list:
    return _load("trips.json")[:limit]
