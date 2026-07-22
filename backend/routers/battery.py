"""Battery Intelligence router — SOH, SOC (UKF), passport, stress events, RUL"""

from fastapi import APIRouter, HTTPException, Header
from typing import Optional

from models.schemas import BatteryPassportResponse, RULEstimate
from utils.mock_engine import (
    get_battery_passport, get_soh_trend, get_stress_events,
    get_rul_estimate, get_live_telemetry,
)
from utils.jwt_handler import verify_token
from models.ukf_soc import UKFStateOfCharge

router = APIRouter()


def _auth(authorization: Optional[str]) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorised")
    chassis = verify_token(authorization.split(" ")[1])
    if not chassis:
        raise HTTPException(status_code=401, detail="Token expired")
    return chassis


@router.get("/passport")
async def get_passport(authorization: Optional[str] = Header(None)):
    chassis = _auth(authorization)
    return get_battery_passport(chassis)


@router.get("/soh-trend")
async def get_soh_trend_data(authorization: Optional[str] = Header(None)):
    chassis = _auth(authorization)
    return {"trend": get_soh_trend(chassis)}


@router.get("/stress-events")
async def get_stress(authorization: Optional[str] = Header(None)):
    chassis = _auth(authorization)
    return {"events": get_stress_events(chassis)}


@router.get("/rul")
async def get_rul(authorization: Optional[str] = Header(None)):
    chassis = _auth(authorization)
    return get_rul_estimate(chassis)


@router.get("/soc-ukf")
async def get_soc_ukf(
    voltage: float = 380.0,
    current: float = -5.0,
    temperature: float = 30.0,
    authorization: Optional[str] = Header(None),
):
    """
    Run one UKF estimation step with provided BMS readings.
    Testing Mode: uses default mock voltage/current values.
    Production Mode: called with real-time BMS packet data.
    """
    _auth(authorization)

    ukf = UKFStateOfCharge(initial_soc=0.72)
    estimated_soc, uncertainty = ukf.update(
        voltage_measured=voltage,
        current=current,
        temperature_c=temperature,
    )
    return {
        "estimatedSoc":   round(estimated_soc * 100, 2),
        "uncertaintyPct": round(uncertainty * 100, 3),
        "method":         "Unscented Kalman Filter (UKF)",
        "rmseTarget":     "0.23%",
    }
