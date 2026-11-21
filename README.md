# NagarSetu AI (नगरसेतु AI)
## AI-Powered Civic Grievance Intelligence and Resolution Platform

> **Tagline:** Bridging Citizens and Better Governance.
> **Hackathon Track:** Civic Pulse – Digital Governance & Public Information
> **Problem Statement:** Transparent Civic Grievance & Infrastructure Triage System
> **Core Workflow:** Report → Analyse → Prioritize → Assign → Track → Resolve

---

## 🌟 Overview

**NagarSetu AI** is a digital governance platform designed to make municipal complaint management transparent, explainable, and accountable.

Citizens can report public infrastructure issues — such as deep potholes, water bursts, overflowing garbage, drainage blocks, and non-working streetlights — with photographs, text descriptions, and GPS-detected street addresses.

The platform uses a **custom Multimodal NLP + Vision AI engine** (built in Python) to:

1. **Categorise Complaints** — Automatically map issues to 7 municipal domains (Roads, Water, Sanitation, Drainage, Electrical, Public Works, Other).
2. **Recommend Priority with Reasoning** — Evaluate danger to life, public health impact, and traffic disruption with explainable justification (Critical / High / Medium / Low).
3. **Route to Responsible Municipal Departments** — Suggest and assign the correct authority automatically.
4. **Detect Similar / Duplicate Issues (FR-09)** — Identify spatial and lexical duplicates across sectors to optimize field dispatches.
5. **Protect Citizen Privacy** — Expose only non-sensitive aggregated analytics on the public **Civic Pulse** dashboard.

---

## ✅ Functional Requirements Coverage

| # | Requirement | Status |
|---|-------------|--------|
| FR-01 | Citizen Registration & Login (JWT, role-based) | ✅ Complete |
| FR-02 | Complaint Submission (title, description, photo, GPS location, contact) | ✅ Complete |
| FR-03 | AI Image & Text Analysis (NLP + Computer Vision) | ✅ Complete |
| FR-04 | Automatic Categorization (7 civic categories) | ✅ Complete |
| FR-05 | Priority Recommendation with Explanation | ✅ Complete |
| FR-06 | Department Recommendation (7 departments) | ✅ Complete |
| FR-07 | Admin Dashboard (stats, review, assign, update) | ✅ Complete |
| FR-08 | Complaint Tracking (6-step pipeline + audit history) | ✅ Complete |
| FR-09 | Similar Complaint Detection | ✅ Complete (Bonus) |
| FR-10 | Public Dashboard (aggregated, privacy-safe) | ✅ Complete |

---

## 🚀 Key Features & Pages

| Page | Description |
|------|-------------|
| **Landing Portal** | Hero intro, Sign In / Register auth wall, platform features grid |
| **Citizen & Admin Auth** | Secure JWT authentication, role-based access, demo quick-login |
| **Citizen Dashboard** | History of complaints, status metrics, AI insight badges |
| **Submit Grievance** | Drag-and-drop photo upload, auto GPS → real street address (OpenStreetMap), form validation |
| **AI Analysis Modal** | Live AI summary, category, priority reasoning, vision observations, confidence score |
| **Track Complaint** | Visual 6-step pipeline + immutable timestamped audit history |
| **Admin Command Desk** | Recharts analytics, complaint table, AI review, status/dept/priority update with toast notifications |
| **Civic Pulse Dashboard** | Aggregated municipal stats, bar & pie charts, sanitized public feed |

---

## 🤖 AI Engine — How It Works

The AI runs **entirely in the backend** — no API key configuration required in the UI.

| Layer | Technology | What it does |
|-------|-----------|-------------|
| **Text Classification** | Custom regex NLP engine (Python `re`) | Maps complaint descriptions → 7 civic categories using word-boundary matching |
| **Priority Scoring** | Keyword signal scoring system | Assigns Critical / High / Medium / Low with human-readable reasoning |
| **Vision Analysis** | Pillow (PIL) — Python image processing | Inspects uploaded photos for damage indicators |
| **LLM Upgrade Path** | Groq API (LLaMA 3) — optional | Activated automatically when `GROQ_API_KEY` is set in `.env` |
| **Duplicate Detection** | Location + category + keyword matching | Finds similar complaints for admin review |

> **Explainable AI:** Every classification decision includes a transparent, human-readable reason visible to both the citizen and the administrator.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite 6, Tailwind CSS (dark mode), Lucide React, Recharts |
| **Backend** | Python 3.11, FastAPI, Pydantic v2, Uvicorn, Python-Jose (JWT), BCrypt |
| **AI Engine** | Custom NLP + Pillow Vision; optional Groq LLaMA cloud upgrade |
| **Database** | SQLite (local) — schema identical to Supabase PostgreSQL spec |
| **Storage** | Local `/uploads` directory (static file serving via FastAPI) |
| **Geocoding** | OpenStreetMap Nominatim (free, no API key) for GPS → street address |

---

## 🔑 Demo Credentials

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Citizen** | `citizen@demo.org` | `Citizen123!` | Report issues, personal dashboard, tracking |
| **Administrator** | `admin@nagarsetu.gov.in` | `Admin123!` | Admin command desk, status updates, department dispatch |

---

## 💻 Running Locally (Windows)

### 1. Backend Setup

```powershell
# Navigate to backend
cd backend

# (Optional) Add Groq API key to enable cloud LLM
# Copy .env.example to .env and set GROQ_API_KEY=your_key

# Run FastAPI server
.\.venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

Backend runs at: **http://127.0.0.1:8000**
API Docs: **http://127.0.0.1:8000/docs**

### 2. Frontend Setup

```powershell
# In a separate terminal
cd frontend
npm.cmd run dev -- --host 127.0.0.1
```

Frontend runs at: **http://127.0.0.1:5173**

---

## 📋 Complete Demo Walkthrough

1. Open **http://127.0.0.1:5173**
2. **Sign in as Citizen** (`citizen@demo.org / Citizen123!`)
3. Click **"Report a Grievance"**
4. Fill title + description → click **Auto-Detect Location** (real street address auto-fills)
5. Upload a photo (optional) → click **Submit**
6. AI Analysis modal appears with category, priority & department
7. Note the **Reference ID** (e.g. `NS-2026-88012`)
8. **Sign out** → **Sign in as Admin** (`admin@nagarsetu.gov.in / Admin123!`)
9. Open **Admin Command Desk** → click **Review** on the complaint
10. Change status to `In Progress` → **Save & Update Status** → green toast confirms ✅
11. **Sign out** → go to **Track Grievance** → enter Reference ID → see updated status
12. Open **Civic Pulse Dashboard** → see live statistics updated

---

## 🗂️ Project Structure

```
NagarSetuAI/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── ai_service.py        # NLP + Vision AI engine
│   ├── auth.py              # JWT authentication
│   ├── database.py          # SQLite connection & schema
│   ├── config.py            # Settings & environment vars
│   ├── schemas.py           # Pydantic data models
│   ├── routers/
│   │   ├── auth.py          # /api/auth/* endpoints
│   │   ├── complaints.py    # /api/complaints/* endpoints
│   │   ├── stats.py         # /api/stats/* endpoints
│   │   └── similar.py       # /api/complaints/{id}/similar
│   └── nagarsetu.db         # SQLite database (auto-created)
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── SubmitComplaintPage.jsx
│   │   │   ├── TrackComplaintPage.jsx
│   │   │   ├── CitizenDashboardPage.jsx
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── PublicDashboardPage.jsx
│   │   │   ├── HowItWorksPage.jsx
│   │   │   └── CategoriesPage.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── AIAnalysisModal.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   └── PriorityBadge.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   └── api/
│   │       └── client.js
│   └── vite.config.js
│
├── spec.md                  # Full project specification
└── README.md
```

---

## 🌙 UI Features

- **Dark / Light Mode** — Full dark mode across all pages with one-click toggle
- **Responsive Design** — Works on desktop and mobile
- **Real-time GPS** — OpenStreetMap reverse geocoding for accurate street addresses
- **Toast Notifications** — Instant feedback on save actions
- **Recharts Visualizations** — Bar charts and pie charts for complaint analytics
- **6-Step Visual Pipeline** — Colour-coded complaint status tracker

---

## 🔐 Security

- JWT Bearer token authentication
- Role-based access control (citizen vs admin)
- API key never exposed in frontend
- Uploaded file type & size validation (JPG/PNG/WEBP, max 10MB)
- Private citizen data hidden from public dashboard
- All backend inputs validated via Pydantic

---

## 📊 AI Output Schema

Every complaint analysis returns:

```json
{
  "summary": "Detailed technical description of the civic issue",
  "category": "Roads and potholes",
  "image_observations": "Visual damage indicators observed in photo",
  "priority": "High",
  "priority_reason": "Explanation of why this priority was assigned",
  "suggested_department": "Roads Department",
  "confidence": 0.87,
  "uncertainty_notes": "Any ambiguity noted by the AI engine"
}
```

---

## 🏆 Hackathon — What Makes This Stand Out

1. **Explainable AI** — Every decision has a human-readable reason, not a black box
2. **Works without API key** — Native NLP fallback ensures demo always works
3. **Real GPS → Address** — OpenStreetMap integration, no paid API needed
4. **Full admin workflow** — Complete complaint lifecycle management
5. **FR-09 Duplicate Detection** — Advanced bonus feature beyond MVP spec
6. **Dark mode** — Professional, polished UI with theme persistence
7. **Transparent public dashboard** — Privacy-safe open governance analytics

---

*NagarSetu AI — Bridging Citizens and Better Governance.*
