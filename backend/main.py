import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from config import settings
from database import init_db
from routers.auth import router as auth_router
from routers.complaints import router as complaints_router
from routers.stats import router as stats_router
from routers.similar import router as similar_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure upload directory and DB tables exist
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    init_db()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-Powered Civic Grievance Intelligence and Resolution Platform (NagarSetu AI)",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploaded media directory
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth_router, prefix=settings.API_V1_PREFIX)
app.include_router(complaints_router, prefix=settings.API_V1_PREFIX)
app.include_router(stats_router, prefix=settings.API_V1_PREFIX)
app.include_router(similar_router, prefix=settings.API_V1_PREFIX)

@app.get("/")
def root():
    return {
        "project": "NagarSetu AI",
        "tagline": "Bridging Citizens and Better Governance",
        "track": "Civic Pulse – Digital Governance & Public Information",
        "status": "Operational",
        "api_docs": "/docs"
    }

@app.get("/health")
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "ai_engine_active": True,
        "ai_mode": "Multimodal Vision & NLP AI Engine (Integrated Background)",
        "database": "SQLite / Supabase Ready"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
