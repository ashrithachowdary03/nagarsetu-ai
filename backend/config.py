import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "NagarSetu AI"
    API_V1_PREFIX: str = "/api"
    
    # Groq API
    GROQ_API_KEY: Optional[str] = None
    GROQ_VISION_MODEL: str = "llama-3.2-11b-vision-preview"
    GROQ_TEXT_MODEL: str = "llama-3.3-70b-versatile"
    
    # Supabase (optional, falls back to SQLite)
    SUPABASE_URL: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None
    
    # Auth
    JWT_SECRET: str = "nagarsetu-super-secret-key-2026-production-ready"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440 # 24 hours
    
    # Server & Storage
    UPLOAD_DIR: str = "uploads"
    SQLITE_DB_PATH: str = "nagarsetu.db"
    FRONTEND_URL: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
