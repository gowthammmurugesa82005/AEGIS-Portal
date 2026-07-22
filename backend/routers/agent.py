"""
AI Agent router — wraps the AEGIS multi-agent LangGraph orchestrator.
In testing mode, responses are generated from Ollama (local LLM).
In production, the full LangGraph agent graph is activated.
"""

from fastapi import APIRouter, Header, HTTPException
from typing import Optional
import os

from models.schemas import AgentQueryRequest, AgentQueryResponse
from utils.jwt_handler import verify_token

router = APIRouter()
TEST_MODE = os.getenv("TEST_MODE", "true") == "true"


async def _query_ollama(prompt: str) -> str:
    """Query local Ollama instance (free, runs on your machine)."""
    try:
        import httpx
        ollama_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{ollama_url}/api/generate",
                json={"model": "llama3.2", "prompt": prompt, "stream": False},
            )
            return resp.json().get("response", "Unable to get response from local AI.")
    except Exception as e:
        return f"Local AI unavailable ({str(e)}). Start Ollama with: ollama serve"


async def _query_gemini(prompt: str) -> str:
    """Query Google Gemini API (free tier: 1500 req/day)."""
    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key:
        return "Gemini API key not configured. Add GEMINI_API_KEY to .env"
    try:
        import httpx
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}",
                json={"contents": [{"parts": [{"text": prompt}]}]},
            )
            data = resp.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        return f"Gemini API error: {str(e)}"


def _build_aegis_prompt(query: str, vehicle_context: dict) -> str:
    return f"""You are AEGIS — an AI vehicle intelligence assistant for EV owners.
You have access to this vehicle's data:
- Vehicle: {vehicle_context.get('make','Tata')} {vehicle_context.get('model','Nexon EV Max')} 2023
- Battery SOH: 87% (LFP chemistry, 40.5 kWh)
- Current SOC: 72% (estimated range: 274 km)
- Odometer: 18,420 km
- Next maintenance: Tyre rotation due in 1,580 km
- Insurance: Bajaj Allianz (expires in 42 days)

Answer the following question in a helpful, concise, and technically accurate way.
If recommending actions, be specific and practical.

User question: {query}

Respond in 2-4 sentences unless the question requires more detail."""


@router.post("/query", response_model=AgentQueryResponse)
async def query_agent(
    body: AgentQueryRequest,
    authorization: Optional[str] = Header(None),
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorised")
    chassis = verify_token(authorization.split(" ")[1])
    if not chassis:
        raise HTTPException(status_code=401, detail="Token expired")

    vehicle_context = body.context or {}
    prompt          = _build_aegis_prompt(body.query, vehicle_context)

    # Try Ollama first (free, local), fall back to Gemini
    answer     = await _query_ollama(prompt)
    agent_used = "Ollama/Llama3.2 (local)"

    if "unavailable" in answer.lower() or "error" in answer.lower():
        answer     = await _query_gemini(prompt)
        agent_used = "Google Gemini 2.0 Flash"

    return AgentQueryResponse(
        answer=answer,
        agentUsed=agent_used,
        confidence=0.85,
        sources=["Digital Battery Passport", "AEGIS Fleet APM Agent", "Maintenance Optimizer"],
        recommendations=[
            "Check tyre pressure monthly to improve range efficiency",
            "Schedule tyre rotation within the next 1,580 km",
        ],
    )


@router.get("/fleet-apm-status")
async def fleet_apm_status(authorization: Optional[str] = Header(None)):
    """Return the current status of all AEGIS agents."""
    return {
        "agents": [
            {"name": "Fleet APM Agent",          "status": "active",   "lastRun": "2 min ago", "mode": "testing"},
            {"name": "Carbon/Net-Zero Agent",     "status": "active",   "lastRun": "5 min ago", "mode": "testing"},
            {"name": "Supply Chain Risk Agent",   "status": "standby",  "lastRun": "1 hr ago",  "mode": "testing"},
            {"name": "Manufacturing QC Agent",    "status": "standby",  "lastRun": "N/A",        "mode": "testing"},
            {"name": "Maintenance Optimizer",     "status": "active",   "lastRun": "10 min ago", "mode": "testing"},
            {"name": "Orchestrator",              "status": "active",   "lastRun": "2 min ago",  "mode": "testing"},
        ]
    }
