# AEGIS Vehicle Owner Intelligence Portal

> AI-powered EV health, insurance, lifecycle, and fleet intelligence platform  
> Built with Next.js 14 · FastAPI · LangGraph · UKF · Zero Cost Stack

---

## Quick Start (Testing Mode — Everything Simulated)

### Prerequisites
- Node.js 20 LTS
- Python 3.11+
- Git

### 1. Clone and install

```bash
git clone https://github.com/yourusername/aegis-portal.git
cd aegis-portal

# Frontend
cd frontend
npm install
cp .env.local.example .env.local   # edit keys if needed
npm run dev                         # http://localhost:3000

# Backend (new terminal)
cd ../backend
python -m venv aegis-env
source aegis-env/bin/activate       # Windows: aegis-env\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8000
```

### 2. (Optional) Start local AI

```bash
# Install Ollama from https://ollama.com/download
ollama pull llama3.2
# Ollama auto-starts as a background service
```

### 3. Login

Open http://localhost:3000 and use:
- **Chassis Number:** `AEGIS2024TEST001`
- **OTP:** `123456` (displayed on screen in test mode)

---

## Project Structure

```
aegis-portal/
├── frontend/          Next.js 14 — user interface
│   └── src/
│       ├── app/       Pages (App Router)
│       ├── components/ Reusable UI components
│       ├── lib/        Mock data, utilities, auth
│       └── types/      TypeScript definitions
├── backend/           FastAPI — ML inference + agent APIs
│   ├── routers/       API endpoints
│   ├── agents/        LangGraph multi-agent system
│   ├── models/        UKF, ML models, Pydantic schemas
│   ├── utils/         JWT, mock engine
│   └── mock_data/     JSON fixtures for testing
└── docker-compose.yml Local MQTT + Redis
```

---

## Features (50 total — all functional in testing mode)

| Module              | Key Features |
|---------------------|-------------|
| Authentication      | Chassis + OTP login, JWT session, multi-vehicle |
| Dashboard           | Health score gauge, SOC/SOH tiles, alert feed |
| Battery Intel       | Digital Passport, SOH trend chart, UKF SOC, RUL estimator |
| Maintenance         | Predictive alerts, service history, cost tracker |
| Carbon & ESG        | Carbon dashboard, supply chain, second-life info |
| Insurance           | Policy view, claim initiation, renewal comparison |
| Payments            | Dues dashboard, payment gateway, spending analytics |
| Dealers             | Map, booking system, service tracker |
| Live Tracking       | GPS sim, geofencing, pre-conditioning, sentry mode |
| Documents           | Vault, expiry alerts, DigiLocker sharing |

---

## Tech Stack (All Free / Open Source)

| Layer         | Technology |
|---------------|-----------|
| Frontend      | Next.js 14, TypeScript, Tailwind CSS, Recharts |
| Backend       | FastAPI, Python 3.11 |
| AI Agents     | LangChain, LangGraph, Ollama/Llama3.2 |
| ML Models     | UKF (SOC), LSTM (SOH — trainable on Colab) |
| Databases     | Neon PostgreSQL, MongoDB Atlas, Upstash Redis |
| Maps          | Leaflet.js + OpenStreetMap |
| Hosting       | Vercel (frontend) + Oracle Cloud Free (backend) |

---

## Environment Variables

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_TEST_MODE=true
NEXTAUTH_SECRET=your-32-char-secret
GEMINI_API_KEY=         # from aistudio.google.com (free)
DATABASE_URL=            # from neon.tech (free)
MONGODB_URI=             # from mongodb.com/atlas (free)
UPSTASH_REDIS_REST_URL=  # from upstash.com (free)
RESEND_API_KEY=          # from resend.com (free)
```

### Backend (`backend/.env`)
```
TEST_MODE=true
SECRET_KEY=your-64-char-secret
GEMINI_API_KEY=
OLLAMA_BASE_URL=http://localhost:11434
```

---

## Production Transition

Switch `TEST_MODE=false` and provide:
1. VAHAN API credentials (MoRTH/NIC — free, requires application)
2. SMS gateway key (Fast2SMS India — ₹0.15/SMS)
3. OEM telematics integration (vehicle manufacturer partnership)
4. Insurer API agreements (IRDAI partners)
5. Razorpay account (2% transaction fee only, no monthly fee)

---

## Problem Statement Reference

Built for: **AI for Industrial EV Supply Chain & Asset Intelligence**  
Technologies implemented per problem statement:
- ✅ Agentic AI / APM Integration (LangGraph agents)
- ✅ Supply Chain Intelligence (Battery Passport + Supply Chain Agent)
- ✅ Geospatial Analytics (dealer finder, charging map, geofencing)
- ✅ QMS Integration (manufacturing quality data in Battery Passport)
- ✅ Predictive Analytics (UKF SOC, LSTM SOH, RUL estimation)
- ✅ IoT / BMS Integration (MQTT + telemetry pipeline)
- ✅ Digital Twin (AAS-compliant Battery Passport + simulation)
