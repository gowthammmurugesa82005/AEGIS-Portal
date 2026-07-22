"""Auth router — chassis verification + OTP + JWT issuance"""

from fastapi import APIRouter, HTTPException, status
from uuid import uuid4
import os, random

from models.schemas import (
    ChassisVerifyRequest, ChassisVerifyResponse,
    OTPVerifyRequest, OTPVerifyResponse,
)
from utils.mock_engine import (
    TEST_CHASSIS, TEST_OTP, TEST_MOBILE,
    lookup_chassis, store_otp, verify_otp, purge_expired_otps,
)
from utils.jwt_handler import create_access_token

router = APIRouter()
TEST_MODE = os.getenv("TEST_MODE", "true") == "true"


@router.post("/verify-chassis", response_model=ChassisVerifyResponse)
async def verify_chassis(body: ChassisVerifyRequest):
    """
    Step 1: Verify chassis number.
    Testing Mode — only TEST_CHASSIS is accepted; OTP is returned in response.
    Production Mode — query VAHAN API, send OTP via SMS gateway.
    """
    purge_expired_otps()
    chassis = body.chassisNumber.strip().upper()

    # Lookup vehicle
    vehicle = lookup_chassis(chassis)
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vehicle not found. For testing, use: {TEST_CHASSIS}",
        )

    # Generate OTP
    otp        = TEST_OTP if TEST_MODE else str(random.randint(100000, 999999))
    session_id = str(uuid4())
    store_otp(session_id, otp, chassis)

    # In production: send SMS here via Resend/Fast2SMS
    # await sms_client.send(vehicle["ownerMobile"], f"Your AEGIS OTP is {otp}")

    return ChassisVerifyResponse(
        success=True,
        sessionId=session_id,
        maskedMobile=vehicle.get("ownerMobile", TEST_MOBILE),
        testOtp=otp if TEST_MODE else None,
        message=f"OTP sent to {vehicle.get('ownerMobile', TEST_MOBILE)}",
    )


@router.post("/verify-otp", response_model=OTPVerifyResponse)
async def verify_otp_route(body: OTPVerifyRequest):
    """
    Step 2: Verify OTP and issue JWT access token.
    Testing Mode — any sessionId + OTP "123456" succeeds.
    """
    # Test mode shortcut
    if TEST_MODE and body.otp == TEST_OTP:
        vehicle = lookup_chassis(TEST_CHASSIS)
        token = create_access_token({
            "sub":       TEST_CHASSIS,
            "vehicleId": "test-vehicle-001",
            "ownerName": vehicle["ownerName"] if vehicle else "Test Owner",
        })
        return OTPVerifyResponse(
            success=True,
            accessToken=token,
            tokenType="bearer",
            expiresIn=1440 * 60,
        )

    # Production OTP verification
    is_valid, result = verify_otp(body.sessionId, body.otp)
    if not is_valid:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=result)

    vehicle = lookup_chassis(result)
    token = create_access_token({
        "sub":       result,
        "vehicleId": vehicle.get("vehicleId", ""),
        "ownerName": vehicle.get("ownerName", ""),
    })
    return OTPVerifyResponse(
        success=True,
        accessToken=token,
        tokenType="bearer",
        expiresIn=1440 * 60,
    )
