import os
import sys
import sqlite3
import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
import bcrypt

# Ensure backend directory is in sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from config import settings

# Always store SQLite DB in backend directory
DB_PATH = os.path.join(BASE_DIR, "nagarsetu.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def hash_pw(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Profiles table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('citizen', 'admin')),
        created_at TEXT NOT NULL
    )
    """)

    # Complaints table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS complaints (
        id TEXT PRIMARY KEY,
        reference_id TEXT UNIQUE NOT NULL,
        user_id TEXT,
        user_name TEXT,
        user_email TEXT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT,
        location TEXT NOT NULL,
        category TEXT NOT NULL,
        priority TEXT NOT NULL,
        priority_reason TEXT,
        ai_summary TEXT,
        image_observations TEXT,
        suggested_department TEXT,
        assigned_department TEXT,
        ai_confidence REAL DEFAULT 0.0,
        uncertainty_notes TEXT,
        status TEXT NOT NULL DEFAULT 'Submitted',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES profiles (id)
    )
    """)

    # Complaint Updates table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS complaint_updates (
        id TEXT PRIMARY KEY,
        complaint_id TEXT NOT NULL,
        updated_by TEXT NOT NULL,
        previous_status TEXT,
        new_status TEXT NOT NULL,
        remarks TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (complaint_id) REFERENCES complaints (id) ON DELETE CASCADE
    )
    """)

    conn.commit()

    # Seed initial demo accounts and complaints if empty
    cursor.execute("SELECT COUNT(*) FROM profiles")
    if cursor.fetchone()[0] == 0:
        seed_initial_data(cursor, conn)

    conn.close()

def seed_initial_data(cursor, conn):
    now = datetime.utcnow().isoformat()

    # 1. Citizen Demo Account
    citizen_id = str(uuid.uuid4())
    cursor.execute("""
    INSERT INTO profiles (id, full_name, email, password_hash, role, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (citizen_id, "Ashritha Citizen", "citizen@demo.org", hash_pw("Citizen123!"), "citizen", now))

    # 2. Admin Demo Account
    admin_id = str(uuid.uuid4())
    cursor.execute("""
    INSERT INTO profiles (id, full_name, email, password_hash, role, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (admin_id, "Civic Admin", "admin@nagarsetu.gov.in", hash_pw("Admin123!"), "admin", now))

    conn.commit()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully at:", DB_PATH)
