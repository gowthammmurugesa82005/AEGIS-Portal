"""Payments router — dues, initiate payment, transaction history"""

from fastapi import APIRouter, HTTPException, Header
from typing import Optional
from uuid import uuid4
from datetime import datetime, timezone

from models.schemas import PaymentInitiateRequest, PaymentInitiateResponse
from utils.mock_engine import get_dues, get_transactions
from utils.jwt_handler import verify_token

router = APIRouter()


def _auth(authorization: Optional[str]) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorised")
    chassis = verify_token(authorization.split(" ")[1])
    if not chassis:
        raise HTTPException(status_code=401, detail="Token expired")
    return chassis


@router.get("/dues")
async def list_dues(authorization: Optional[str] = Header(None)):
    chassis = _auth(authorization)
    return {"dues": get_dues(chassis)}


@router.get("/transactions")
async def list_transactions(
    limit: int = 20,
    authorization: Optional[str] = Header(None),
):
    chassis = _auth(authorization)
    return {"transactions": get_transactions(chassis)[:limit]}


@router.post("/initiate", response_model=PaymentInitiateResponse)
async def initiate_payment(
    body: PaymentInitiateRequest,
    authorization: Optional[str] = Header(None),
):
    _auth(authorization)

    # In production: create Razorpay/PayU order and return checkout URL
    tx_id = f"AEGIS-TXN-{str(uuid4())[:8].upper()}"
    return PaymentInitiateResponse(
        success=True,
        transactionId=tx_id,
        paymentUrl=f"https://checkout.razorpay.com/v1/checkout.js?txn={tx_id}",  # mock URL
        message=f"Payment of ₹{body.amountRs:,.0f} initiated via {body.paymentMethod.upper()}",
    )


@router.get("/spending-summary")
async def spending_summary(authorization: Optional[str] = Header(None)):
    chassis = _auth(authorization)
    txns = get_transactions(chassis)
    total_debit  = sum(t["amountRs"] for t in txns if t["type"] == "debit")
    total_credit = sum(t["amountRs"] for t in txns if t["type"] == "credit")
    by_category: dict[str, float] = {}
    for t in txns:
        if t["type"] == "debit":
            by_category[t["category"]] = by_category.get(t["category"], 0) + t["amountRs"]
    return {
        "totalSpent":  total_debit,
        "totalCredit": total_credit,
        "netOutflow":  total_debit - total_credit,
        "byCategory":  by_category,
    }
