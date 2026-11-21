import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends
from database import get_connection
from auth import verify_password, get_password_hash, create_access_token, get_current_user
from schemas import UserRegister, UserLogin, TokenResponse, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register(user_data: UserRegister):
    conn = get_connection()
    cursor = conn.cursor()
    
    # Check if email exists
    cursor.execute("SELECT id FROM profiles WHERE email = ?", (user_data.email,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )
    
    user_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    pwd_hash = get_password_hash(user_data.password)
    
    cursor.execute("""
    INSERT INTO profiles (id, full_name, email, password_hash, role, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (user_id, user_data.full_name, user_data.email, pwd_hash, user_data.role, now))
    conn.commit()
    conn.close()
    
    user_resp = UserResponse(
        id=user_id,
        full_name=user_data.full_name,
        email=user_data.email,
        role=user_data.role,
        created_at=now
    )
    
    token = create_access_token({"sub": user_data.email, "role": user_data.role, "id": user_id})
    return TokenResponse(access_token=token, user=user_resp)

@router.post("/login", response_model=TokenResponse)
def login(login_data: UserLogin):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT id, full_name, email, password_hash, role, created_at
    FROM profiles WHERE email = ?
    """, (login_data.email,))
    row = cursor.fetchone()
    conn.close()
    
    if not row or not verify_password(login_data.password, row["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )
    
    user_resp = UserResponse(
        id=row["id"],
        full_name=row["full_name"],
        email=row["email"],
        role=row["role"],
        created_at=row["created_at"]
    )
    
    token = create_access_token({"sub": row["email"], "role": row["role"], "id": row["id"]})
    return TokenResponse(access_token=token, user=user_resp)

@router.get("/me", response_model=UserResponse)
def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        id=current_user["id"],
        full_name=current_user["full_name"],
        email=current_user["email"],
        role=current_user["role"],
        created_at=current_user["created_at"]
    )
