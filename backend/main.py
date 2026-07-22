"""
AEGIS Vehicle Owner Intelligence Portal — FastAPI Backend
Testing Mode: All data served from mock engine (no live vehicle connection)
Production Mode: Switch DATA_SOURCE env var to connect live agents
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

from routers import auth, vehicle, battery, insurance, payments, dealers, carbon, agent

load_dotenv()

# ── Startup / Shutdown ────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 AEGIS Backend starting — TEST MODE:", os.getenv("TEST_MODE", "true"))
    yield
    print("⏹  AEGIS Backend shutting down")

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="AEGIS Vehicle Owner Intelligence Portal API",
    description="AI-powered EV health, lifecycle, and fleet intelligence platform",
    version="1.0.0-testing",
    lifespan=lifespan,
)

# ── CORS (allow Next.js dev server and Vercel) ────────────────────────────────
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:3001"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router,      prefix="/api/auth",      tags=["Authentication"])
app.include_router(vehicle.router,   prefix="/api/vehicle",   tags=["Vehicle"])
app.include_router(battery.router,   prefix="/api/battery",   tags=["Battery Intelligence"])
app.include_router(insurance.router, prefix="/api/insurance", tags=["Insurance"])
app.include_router(payments.router,  prefix="/api/payments",  tags=["Payments"])
app.include_router(dealers.router,   prefix="/api/dealers",   tags=["Dealer Network"])
app.include_router(carbon.router,    prefix="/api/carbon",    tags=["Carbon & ESG"])
app.include_router(agent.router,     prefix="/api/agent",     tags=["AI Agent"])

# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {
        "status": "ok",
        "mode": "testing" if os.getenv("TEST_MODE", "true") == "true" else "production",
        "version": "1.0.0-testing",
    }

@app.get("/")
async def root():
    return JSONResponse({
        "message": "AEGIS API is running",
        "docs": "/docs",
        "health": "/health",
    })
