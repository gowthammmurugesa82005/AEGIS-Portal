"""Insurance router — policy info, claims, renewal quotes"""

from fastapi import APIRouter, HTTPException, Header
from typing import Optional
from uuid import uuid4
from datetime import datetime, timezone

from models.schemas import InsurancePolicyResponse, ClaimRequest, ClaimResponse
from utils.mock_engine import get_insurance_policy, get_claims
from utils.jwt_handler import verify_token

router = APIRouter()


def _auth(authorization: Optional[str]) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorised")
    chassis = verify_token(authorization.split(" ")[1])
    if not chassis:
        raise HTTPException(status_code=401, detail="Token expired")
    return chassis


@router.get("/policy")
async def get_policy(authorization: Optional[str] = Header(None)):
    chassis = _auth(authorization)
    return get_insurance_policy(chassis)


@router.get("/claims")
async def list_claims(authorization: Optional[str] = Header(None)):
    chassis = _auth(authorization)
    return {"claims": get_claims(chassis)}


@router.post("/claims", response_model=ClaimResponse)
async def raise_claim(
    body: ClaimRequest,
    authorization: Optional[str] = Header(None),
):
    _auth(authorization)

    # In production: POST to insurer's claim API with AEGIS battery data package
    claim_number = f"AEGIS-CLM-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{str(uuid4())[:6].upper()}"

    return ClaimResponse(
        success=True,
        claimNumber=claim_number,
        message="Claim submitted successfully. Surveyor will be assigned within 24 hours.",
        nextSteps=[
            "Confirmation SMS sent to registered mobile",
            "Surveyor assigned within 24 hours",
            "Physical inspection within 3 working days",
            "Settlement within 7 working days of approval",
        ],
    )


@router.get("/renewal-quotes")
async def get_renewal_quotes(authorization: Optional[str] = Header(None)):
    _auth(authorization)
    # In production: call IRDAI partner insurer APIs for live quotes
    return {
        "quotes": [
            {"provider": "Bajaj Allianz (Current)",  "premiumRs": 24800, "rating": 4.4, "type": "Comprehensive + Battery"},
            {"provider": "HDFC ERGO",                "premiumRs": 22400, "rating": 4.6, "type": "Comprehensive + Zero Dep"},
            {"provider": "ICICI Lombard",             "premiumRs": 23100, "rating": 4.5, "type": "Comprehensive + Roadside"},
        ]
    }
