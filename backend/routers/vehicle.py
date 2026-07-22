"""Vehicle router — vehicle identity, health score, live telemetry, alerts, trips"""

from fastapi import APIRouter, HTTPException, Header
from typing import Optional

from models.schemas import VehicleResponse, HealthScoreResponse, TelemetryResponse
from utils.mock_engine import (
    lookup_chassis, get_health_score, get_live_telemetry, get_alerts, get_trips,
)
from utils.jwt_handler import verify_token

router = APIRouter()


def _get_chassis(authorization: Optional[str]) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    token   = authorization.split(" ")[1]
    chassis = verify_token(token)
    if not chassis:
        raise HTTPException(status_code=401, detail="Token expired or invalid")
    return chassis


@router.get("/me", response_model=VehicleResponse)
async def get_vehicle(authorization: Optional[str] = Header(None)):
    chassis = _get_chassis(authorization)
    vehicle = lookup_chassis(chassis)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle


@router.get("/health-score", response_model=HealthScoreResponse)
async def get_vehicle_health(authorization: Optional[str] = Header(None)):
    chassis = _get_chassis(authorization)
    return get_health_score(chassis)


@router.get("/telemetry", response_model=TelemetryResponse)
async def get_telemetry(authorization: Optional[str] = Header(None)):
    chassis = _get_chassis(authorization)
    return get_live_telemetry(chassis)


@router.get("/alerts")
async def get_vehicle_alerts(authorization: Optional[str] = Header(None)):
    chassis = _get_chassis(authorization)
    return {"alerts": get_alerts(chassis)}


@router.get("/trips")
async def get_vehicle_trips(
    limit: int = 10,
    authorization: Optional[str] = Header(None),
):
    chassis = _get_chassis(authorization)
    return {"trips": get_trips(chassis, limit)}
