"""Dealer & Service Network router"""

from fastapi import APIRouter, Header
from typing import Optional
from uuid import uuid4
from datetime import datetime, timezone, timedelta

from models.schemas import BookingRequest, BookingResponse
from utils.mock_engine import get_dealers
from utils.jwt_handler import verify_token

router = APIRouter()


@router.get("/nearby")
async def nearby_dealers(
    lat: float = 11.3410,
    lon: float = 77.7172,
    radius_km: float = 100,
    authorization: Optional[str] = Header(None),
):
    # In production: query dealer DB with PostGIS ST_DWithin on lat/lon
    dealers = get_dealers(lat, lon, radius_km)
    return {"dealers": dealers, "total": len(dealers)}


@router.post("/book", response_model=BookingResponse)
async def book_appointment(
    body: BookingRequest,
    authorization: Optional[str] = Header(None),
):
    # In production: POST to dealer's DMS API
    ref = f"AGS-{str(uuid4())[:6].upper()}"
    appt_dt = f"{body.preferredDate} at {body.preferredTime}"
    return BookingResponse(
        success=True,
        bookingReference=ref,
        confirmationMessage=f"Appointment confirmed! Ref: {ref}. SMS sent to registered mobile.",
        dealerName=f"Dealer {body.dealerId}",
        appointmentDateTime=appt_dt,
    )


@router.post("/{dealer_id}/rate")
async def rate_dealer(
    dealer_id: str,
    rating: int,
    review: str = "",
    authorization: Optional[str] = Header(None),
):
    # In production: write to reviews database
    return {"success": True, "message": "Thank you for your feedback!"}
