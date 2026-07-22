from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# ── Auth ─────────────────────────────────────────────────────────────────────
class ChassisVerifyRequest(BaseModel):
    chassisNumber: str

class ChassisVerifyResponse(BaseModel):
    success: bool
    sessionId: str
    maskedMobile: str
    testOtp: Optional[str] = None
    message: str

class OTPVerifyRequest(BaseModel):
    sessionId: str
    otp: str

class OTPVerifyResponse(BaseModel):
    success: bool
    accessToken: str
    tokenType: str = "bearer"
    expiresIn: int

class TokenPayload(BaseModel):
    sub: str          # chassis number
    vehicleId: str
    ownerName: str
    exp: int

# ── Vehicle ──────────────────────────────────────────────────────────────────
class VehicleResponse(BaseModel):
    chassisNumber: str
    registrationNo: str
    make: str
    model: str
    variant: str
    year: int
    color: str
    purchaseDate: str
    ownerName: str
    ownerMobile: str
    registeredCity: str
    registeredState: str
    batteryCapacityKwh: float
    batteryChemistry: str
    motorPowerKw: int
    ratedRangeKm: int
    status: str
    lastSeenAt: str

class HealthScoreResponse(BaseModel):
    overall: float
    batteryHealth: float
    mechanicalHealth: float
    chargingSystem: float
    softwareStatus: float
    tyresBrakes: float
    grade: str
    gradeLabel: str

class TelemetryResponse(BaseModel):
    soc: float
    soh: float
    estimatedRangeKm: int
    isCharging: bool
    chargingRateKw: float
    timeToFullCharge: str
    recommendedChargeTarget: int
    currentSpeedKmh: float
    odometreKm: int
    cabinTempC: float
    ambientTempC: float
    lastUpdatedAt: str

# ── Battery ──────────────────────────────────────────────────────────────────
class SOHTrendPoint(BaseModel):
    date: str
    soh: float
    cycleCount: int
    event: Optional[str] = None
    eventLabel: Optional[str] = None

class StressEvent(BaseModel):
    id: str
    type: str
    date: str
    severity: str
    sohImpact: float
    description: str
    recommendation: str

class RULEstimate(BaseModel):
    estimatedYears70Soh: float
    estimatedYears50Soh: float
    confidenceLow: float
    confidenceHigh: float
    primaryDegradationFactor: str
    projectedSoh1Year: float
    projectedSoh3Year: float
    projectedSoh5Year: float

class MaterialComposition(BaseModel):
    lithium: float
    cobalt: float
    nickel: float
    manganese: float
    iron: float
    graphite: float
    other: float
    ethicalSourcingScore: int

class BatteryPassportResponse(BaseModel):
    batteryId: str
    serialNumber: str
    manufacturer: str
    manufacturingDate: str
    manufacturingPlant: str
    chemistry: str
    nominalCapacityKwh: float
    nominalVoltageV: int
    weightKg: int
    materialComposition: MaterialComposition

# ── Insurance ─────────────────────────────────────────────────────────────────
class InsurancePolicyResponse(BaseModel):
    id: str
    policyNumber: str
    provider: str
    type: str
    startDate: str
    endDate: str
    sumInsuredRs: int
    idvRs: int
    premiumRs: int
    networkGarages: int
    hasBatteryProtect: bool
    hasRoadsideAssist: bool
    hasZeroDepreciation: bool
    status: str
    daysToRenewal: int

class ClaimRequest(BaseModel):
    incidentType: str
    incidentDate: str
    incidentTime: str
    location: str
    description: str
    chassisNumber: str

class ClaimResponse(BaseModel):
    success: bool
    claimNumber: str
    message: str
    nextSteps: List[str]

# ── Payments ─────────────────────────────────────────────────────────────────
class DueItem(BaseModel):
    id: str
    category: str
    title: str
    amountRs: float
    dueDate: str
    status: str
    isAutoDebit: bool

class PaymentInitiateRequest(BaseModel):
    dueId: str
    paymentMethod: str  # "upi" | "card" | "netbanking"
    amountRs: float

class PaymentInitiateResponse(BaseModel):
    success: bool
    transactionId: str
    paymentUrl: Optional[str] = None   # Razorpay checkout URL in production
    message: str

# ── Dealers ──────────────────────────────────────────────────────────────────
class DealerResponse(BaseModel):
    id: str
    name: str
    type: str
    address: str
    city: str
    state: str
    phone: str
    latitude: float
    longitude: float
    distanceKm: float
    rating: float
    totalReviews: int
    openNow: bool
    openHours: str
    services: List[str]
    nextAvailableSlot: Optional[str] = None

class BookingRequest(BaseModel):
    dealerId: str
    serviceType: str
    preferredDate: str
    preferredTime: str
    notes: Optional[str] = None

class BookingResponse(BaseModel):
    success: bool
    bookingReference: str
    confirmationMessage: str
    dealerName: str
    appointmentDateTime: str

# ── Carbon ───────────────────────────────────────────────────────────────────
class CarbonDataResponse(BaseModel):
    todayCo2Kg: float
    monthCo2Kg: float
    yearCo2Kg: float
    lifetimeSavedKg: float
    currentGridFactor: float
    optimalChargingWindow: dict
    monthlyCarbonHistory: List[dict]

# ── AI Agent ─────────────────────────────────────────────────────────────────
class AgentQueryRequest(BaseModel):
    query: str
    context: Optional[dict] = None

class AgentQueryResponse(BaseModel):
    answer: str
    agentUsed: str
    confidence: float
    sources: List[str]
    recommendations: Optional[List[str]] = None
