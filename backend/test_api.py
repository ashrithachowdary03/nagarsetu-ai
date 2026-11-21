import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from main import app
from database import init_db

init_db()
client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"

def test_login_demo_admin():
    res = client.post("/api/auth/login", json={
        "email": "admin@nagarsetu.gov.in",
        "password": "Admin123!"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["role"] == "admin"
    return data["access_token"]

def test_login_demo_citizen():
    res = client.post("/api/auth/login", json={
        "email": "citizen@demo.org",
        "password": "Citizen123!"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["role"] == "citizen"
    return data["access_token"]

def test_public_stats():
    res = client.get("/api/stats/public")
    assert res.status_code == 200
    data = res.json()
    assert data["total_complaints"] >= 0

def test_admin_stats():
    res = client.get("/api/stats/admin")
    assert res.status_code == 200
    data = res.json()
    assert data["total_complaints"] >= 0

def test_submit_complaint():
    # Submit a complaint without image
    res = client.post("/api/complaints/submit", data={
        "title": "Severe water logging and blocked gutter outside colony gate",
        "description": "Continuous stormwater accumulation due to clogged municipal drain for 2 days.",
        "location": "Colony Gate 2, Madhapur, Hyderabad",
        "contact_phone": "+91 99999 88888"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["reference_id"].startswith("NS-2026-")
    assert data["category"] in [
        "Roads and potholes",
        "Water supply and leakage",
        "Garbage and sanitation",
        "Drainage and sewage",
        "Streetlights",
        "Public infrastructure",
        "Other civic issues"
    ]
    assert data["priority"] in ["Critical", "High", "Medium", "Low"]
    assert len(data["updates"]) >= 1
    return data["reference_id"], data["id"]

def test_track_complaint():
    ref_id, comp_id = test_submit_complaint()
    res = client.get(f"/api/complaints/{ref_id}")
    assert res.status_code == 200
    data = res.json()
    assert data["reference_id"] == ref_id
    assert data["id"] == comp_id

def test_admin_update_complaint():
    admin_token = test_login_demo_admin()
    ref_id, comp_id = test_submit_complaint()
    
    headers = {"Authorization": f"Bearer {admin_token}"}
    res = client.patch(f"/api/complaints/{comp_id}", json={
        "status": "In Progress",
        "assigned_department": "Drainage Department",
        "priority": "High",
        "remarks": "Assigned emergency de-silting truck to colony gate."
    }, headers=headers)
    
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "In Progress"
    assert data["assigned_department"] == "Drainage Department"
    assert any(u["new_status"] == "In Progress" for u in data["updates"])

def test_similar_complaints():
    res = client.get("/api/complaints/NS-2026-88012/similar")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)

if __name__ == "__main__":
    print("Running NagarSetu AI backend test suite...")
    test_health()
    print("✓ Health check passed")
    test_login_demo_admin()
    print("✓ Admin login passed")
    test_login_demo_citizen()
    print("✓ Citizen login passed")
    test_public_stats()
    print("✓ Public stats passed")
    test_admin_stats()
    print("✓ Admin stats passed")
    ref_id, comp_id = test_submit_complaint()
    print(f"✓ Complaint submission passed (Ref: {ref_id})")
    test_track_complaint()
    print("✓ Complaint tracking passed")
    test_admin_update_complaint()
    print("✓ Admin complaint update passed")
    test_similar_complaints()
    print("✓ Similar complaints detection passed")
    print("ALL TESTS PASSED SUCCESSFULLY!")
