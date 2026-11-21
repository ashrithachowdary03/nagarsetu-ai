from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime

# ----------------- Auth & User Schemas -----------------
class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str = Field(default="citizen", pattern="^(citizen|admin)$")

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    full_name: str
    email: str
    role: str
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# ----------------- AI Analysis Schemas -----------------
class AIAnalysisResult(BaseModel):
    summary: str = Field(..., description="Short summary of the civic problem")
    category: str = Field(..., description="Civic category identified")
    image_observations: Optional[str] = Field(default="No image uploaded or analysed.", description="Visual observations from image")
    priority: str = Field(..., description="Critical, High, Medium, or Low")
    priority_reason: str = Field(..., description="Explanation for priority recommendation")
    suggested_department: str = Field(..., description="Recommended responsible department")
    confidence: float = Field(default=0.85, ge=0.0, le=1.0, description="Confidence score")
    uncertainty_notes: Optional[str] = Field(default=None, description="Notes on uncertainties or insufficient details")

# ----------------- Complaint Schemas -----------------
class ComplaintCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=150)
    description: str = Field(..., min_length=10, max_length=2000)
    location: str = Field(..., min_length=3, max_length=250)
    contact_phone: Optional[str] = None
    category_hint: Optional[str] = None

class ComplaintUpdateHistoryItem(BaseModel):
    id: str
    complaint_id: str
    updated_by: str
    previous_status: Optional[str] = None
    new_status: str
    remarks: Optional[str] = None
    created_at: str

class ComplaintAdminAction(BaseModel):
    status: Optional[str] = None
    assigned_department: Optional[str] = None
    priority: Optional[str] = None
    remarks: Optional[str] = None

class ComplaintResponse(BaseModel):
    id: str
    reference_id: str
    user_id: Optional[str] = None
    user_name: Optional[str] = None
    user_email: Optional[str] = None
    title: str
    description: str
    image_url: Optional[str] = None
    location: str
    category: str
    priority: str
    priority_reason: Optional[str] = None
    ai_summary: Optional[str] = None
    image_observations: Optional[str] = None
    suggested_department: Optional[str] = None
    assigned_department: Optional[str] = None
    ai_confidence: float = 0.0
    uncertainty_notes: Optional[str] = None
    status: str
    created_at: str
    updated_at: str
    updates: List[ComplaintUpdateHistoryItem] = []

class ComplaintPublicItem(BaseModel):
    reference_id: str
    title: str
    category: str
    priority: str
    status: str
    location_area: str
    created_at: str
    ai_summary: Optional[str] = None

# ----------------- Dashboard & Stats Schemas -----------------
class StatusCount(BaseModel):
    status: str
    count: int

class CategoryCount(BaseModel):
    category: str
    count: int

class PriorityCount(BaseModel):
    priority: str
    count: int

class AdminStatsResponse(BaseModel):
    total_complaints: int
    pending_complaints: int
    in_progress_complaints: int
    resolved_complaints: int
    closed_complaints: int
    critical_complaints: int
    category_distribution: List[CategoryCount]
    priority_distribution: List[PriorityCount]
    status_distribution: List[StatusCount]

class PublicStatsResponse(BaseModel):
    total_complaints: int
    resolved_complaints: int
    in_progress_complaints: int
    resolution_rate_percent: float
    category_distribution: List[CategoryCount]
    priority_distribution: List[PriorityCount]
    recent_public_complaints: List[ComplaintPublicItem]

# ----------------- Similar Complaint Detection -----------------
class SimilarComplaintItem(BaseModel):
    reference_id: str
    title: str
    category: str
    location: str
    similarity_score: float
    similarity_reason: str
