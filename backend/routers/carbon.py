"""Carbon & ESG router — emissions, grid carbon, supply chain"""

from fastapi import APIRouter, Header
from typing import Optional

from utils.mock_engine import get_carbon_data
from utils.jwt_handler import verify_token

router = APIRouter()


@router.get("/dashboard")
async def carbon_dashboard(authorization: Optional[str] = Header(None)):
    # In production: Carbon/Net-Zero Agent reads from Product Carbon Footprint submodel
    return get_carbon_data("AEGIS2024TEST001")


@router.get("/grid-factor")
async def grid_carbon_factor(
    state: str = "Tamil Nadu",
    authorization: Optional[str] = Header(None),
):
    """
    Return current grid carbon intensity for a state.
    Production: live data from Electricity Maps / CO2Signal API.
    Testing: static values from CEA India published grid emission factors.
    """
    factors = {
        "Tamil Nadu":    620,
        "Karnataka":     490,
        "Maharashtra":   780,
        "Gujarat":       850,
        "Rajasthan":     920,
        "Delhi":         710,
    }
    return {
        "state":  state,
        "factor": factors.get(state, 700),
        "unit":   "gCO2e/kWh",
        "source": "CEA India (2023-24) — Testing Mode static value",
    }


@router.get("/optimal-charging-window")
async def optimal_charging(
    departure_time: str = "07:30",
    authorization: Optional[str] = Header(None),
):
    """
    Return the lowest-carbon charging window before the departure time.
    Production: calls CO2Signal API + utility TOU tariff API.
    """
    return {
        "recommendedStart": "22:30",
        "recommendedEnd":   "06:00",
        "gridFactor":       480,
        "estimatedCostPerKwh": 5.20,
        "reasoning": "Solar and wind generation peak overnight in TN grid. Off-peak tariff active 22:00–06:00.",
    }
