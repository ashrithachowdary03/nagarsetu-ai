import os
import uuid
import random
from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Form, UploadFile, File, HTTPException, status, Depends, Query
from database import get_connection
from auth import get_current_user_optional, get_current_admin
from schemas import (
    ComplaintResponse,
    ComplaintUpdateHistoryItem,
    ComplaintAdminAction,
    ComplaintPublicItem
)
from ai_service import analyse_civic_complaint
from config import settings

router = APIRouter(prefix="/complaints", tags=["Complaints"])

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

def generate_reference_id() -> str:
    conn = get_connection()
    cursor = conn.cursor()
    while True:
        num = random.randint(10000, 99999)
        ref_id = f"NS-2026-{num}"
        cursor.execute("SELECT id FROM complaints WHERE reference_id = ?", (ref_id,))
        if not cursor.fetchone():
            conn.close()
            return ref_id

def map_complaint_row(row, updates_list: List[ComplaintUpdateHistoryItem] = None) -> ComplaintResponse:
    return ComplaintResponse(
        id=row["id"],
        reference_id=row["reference_id"],
        user_id=row["user_id"],
        user_name=row["user_name"],
        user_email=row["user_email"],
        title=row["title"],
        description=row["description"],
        image_url=row["image_url"],
        location=row["location"],
        category=row["category"],
        priority=row["priority"],
        priority_reason=row["priority_reason"],
        ai_summary=row["ai_summary"],
        image_observations=row["image_observations"],
        suggested_department=row["suggested_department"],
        assigned_department=row["assigned_department"],
        ai_confidence=float(row["ai_confidence"] or 0.0),
        uncertainty_notes=row["uncertainty_notes"],
        status=row["status"],
        created_at=row["created_at"],
        updated_at=row["updated_at"],
        updates=updates_list or []
    )

@router.post("/submit", response_model=ComplaintResponse)
async def submit_complaint(
    title: str = Form(..., min_length=5, max_length=150),
    description: str = Form(..., min_length=10, max_length=2000),
    location: str = Form(..., min_length=3, max_length=250),
    contact_phone: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    saved_image_url = None
    saved_image_path = None

    if image and image.filename:
        ext = os.path.splitext(image.filename)[1].lower()
        if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported image format. Allowed formats: JPG, PNG, WEBP."
            )
        file_name = f"{uuid.uuid4().hex}{ext}"
        saved_image_path = os.path.join(settings.UPLOAD_DIR, file_name)
        
        content = await image.read()
        if len(content) > 10 * 1024 * 1024: # 10MB limit
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Image file size must be less than 10MB."
            )
        with open(saved_image_path, "wb") as f:
            f.write(content)
        saved_image_url = f"/uploads/{file_name}"

    # Perform AI Analysis via Groq
    ai_result = await analyse_civic_complaint(
        title=title,
        description=description,
        location=location,
        image_path=saved_image_path
    )

    complaint_id = str(uuid.uuid4())
    reference_id = generate_reference_id()
    now = datetime.utcnow().isoformat()
    
    user_id = current_user["id"] if current_user else None
    user_name = current_user["full_name"] if current_user else (f"Citizen ({contact_phone})" if contact_phone else "Anonymous Citizen")
    user_email = current_user["email"] if current_user else None

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO complaints (
        id, reference_id, user_id, user_name, user_email, title, description, image_url,
        location, category, priority, priority_reason, ai_summary, image_observations,
        suggested_department, assigned_department, ai_confidence, uncertainty_notes,
        status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        complaint_id, reference_id, user_id, user_name, user_email,
        title, description, saved_image_url, location,
        ai_result.category, ai_result.priority, ai_result.priority_reason,
        ai_result.summary, ai_result.image_observations,
        ai_result.suggested_department, ai_result.suggested_department,
        ai_result.confidence, ai_result.uncertainty_notes,
        "Submitted", now, now
    ))

    # Add initial update entry
    update_id = str(uuid.uuid4())
    initial_remark = f"Complaint submitted. AI engine suggested category: '{ai_result.category}' with {ai_result.priority} priority."
    cursor.execute("""
    INSERT INTO complaint_updates (
        id, complaint_id, updated_by, previous_status, new_status, remarks, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (update_id, complaint_id, "NagarSetu AI Engine", None, "Submitted", initial_remark, now))

    conn.commit()
    conn.close()

    update_item = ComplaintUpdateHistoryItem(
        id=update_id,
        complaint_id=complaint_id,
        updated_by="NagarSetu AI Engine",
        previous_status=None,
        new_status="Submitted",
        remarks=initial_remark,
        created_at=now
    )

    return ComplaintResponse(
        id=complaint_id,
        reference_id=reference_id,
        user_id=user_id,
        user_name=user_name,
        user_email=user_email,
        title=title,
        description=description,
        image_url=saved_image_url,
        location=location,
        category=ai_result.category,
        priority=ai_result.priority,
        priority_reason=ai_result.priority_reason,
        ai_summary=ai_result.summary,
        image_observations=ai_result.image_observations,
        suggested_department=ai_result.suggested_department,
        assigned_department=ai_result.suggested_department,
        ai_confidence=ai_result.confidence,
        uncertainty_notes=ai_result.uncertainty_notes,
        status="Submitted",
        created_at=now,
        updated_at=now,
        updates=[update_item]
    )

@router.get("", response_model=List[ComplaintResponse])
def list_complaints(
    category: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = Query(None),
    user_only: bool = Query(False),
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    conn = get_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM complaints WHERE 1=1"
    params = []

    if user_only:
        if not current_user:
            conn.close()
            return []
        query += " AND user_id = ?"
        params.append(current_user["id"])

    if category:
        query += " AND category = ?"
        params.append(category)

    if priority:
        query += " AND priority = ?"
        params.append(priority)

    if status_filter:
        query += " AND status = ?"
        params.append(status_filter)

    if search:
        query += " AND (title LIKE ? OR description LIKE ? OR location LIKE ? OR reference_id LIKE ?)"
        s = f"%{search}%"
        params.extend([s, s, s, s])

    query += " ORDER BY created_at DESC"
    cursor.execute(query, params)
    rows = cursor.fetchall()

    results = []
    for r in rows:
        cursor.execute("SELECT * FROM complaint_updates WHERE complaint_id = ? ORDER BY created_at ASC", (r["id"],))
        u_rows = cursor.fetchall()
        updates = [
            ComplaintUpdateHistoryItem(
                id=u["id"],
                complaint_id=u["complaint_id"],
                updated_by=u["updated_by"],
                previous_status=u["previous_status"],
                new_status=u["new_status"],
                remarks=u["remarks"],
                created_at=u["created_at"]
            ) for u in u_rows
        ]
        results.append(map_complaint_row(r, updates))

    conn.close()
    return results

@router.get("/{ref_or_id}", response_model=ComplaintResponse)
def get_complaint(ref_or_id: str):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM complaints WHERE reference_id = ? COLLATE NOCASE OR id = ?", (ref_or_id.strip(), ref_or_id.strip()))
    row = cursor.fetchone()

    if not row:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No complaint found matching ID or reference '{ref_or_id}'."
        )

    cursor.execute("SELECT * FROM complaint_updates WHERE complaint_id = ? ORDER BY created_at ASC", (row["id"],))
    u_rows = cursor.fetchall()
    updates = [
        ComplaintUpdateHistoryItem(
            id=u["id"],
            complaint_id=u["complaint_id"],
            updated_by=u["updated_by"],
            previous_status=u["previous_status"],
            new_status=u["new_status"],
            remarks=u["remarks"],
            created_at=u["created_at"]
        ) for u in u_rows
    ]

    conn.close()
    return map_complaint_row(row, updates)

@router.patch("/{complaint_id}", response_model=ComplaintResponse)
def update_complaint_status(
    complaint_id: str,
    action: ComplaintAdminAction,
    current_admin: dict = Depends(get_current_admin)
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM complaints WHERE id = ?", (complaint_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Complaint not found."
        )

    prev_status = row["status"]
    new_status = action.status or prev_status
    new_dept = action.assigned_department or row["assigned_department"]
    new_priority = action.priority or row["priority"]
    now = datetime.utcnow().isoformat()

    cursor.execute("""
    UPDATE complaints
    SET status = ?, assigned_department = ?, priority = ?, updated_at = ?
    WHERE id = ?
    """, (new_status, new_dept, new_priority, now, complaint_id))

    # Record update history if status, dept, or remarks changed
    if action.status != prev_status or action.remarks or action.assigned_department != row["assigned_department"]:
        update_id = str(uuid.uuid4())
        remarks = action.remarks or f"Status updated to '{new_status}' and assigned to {new_dept}."
        cursor.execute("""
        INSERT INTO complaint_updates (
            id, complaint_id, updated_by, previous_status, new_status, remarks, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (update_id, complaint_id, current_admin["full_name"], prev_status, new_status, remarks, now))

    conn.commit()

    cursor.execute("SELECT * FROM complaints WHERE id = ?", (complaint_id,))
    updated_row = cursor.fetchone()

    cursor.execute("SELECT * FROM complaint_updates WHERE complaint_id = ? ORDER BY created_at ASC", (complaint_id,))
    u_rows = cursor.fetchall()
    updates = [
        ComplaintUpdateHistoryItem(
            id=u["id"],
            complaint_id=u["complaint_id"],
            updated_by=u["updated_by"],
            previous_status=u["previous_status"],
            new_status=u["new_status"],
            remarks=u["remarks"],
            created_at=u["created_at"]
        ) for u in u_rows
    ]

    conn.close()
    return map_complaint_row(updated_row, updates)
