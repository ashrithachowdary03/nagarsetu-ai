from fastapi import APIRouter
from database import get_connection
from schemas import (
    AdminStatsResponse,
    PublicStatsResponse,
    CategoryCount,
    PriorityCount,
    StatusCount,
    ComplaintPublicItem
)

router = APIRouter(prefix="/stats", tags=["Statistics"])

@router.get("/public", response_model=PublicStatsResponse)
def get_public_stats():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM complaints")
    total = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM complaints WHERE status IN ('Resolved', 'Closed')")
    resolved = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM complaints WHERE status IN ('In Progress', 'Assigned', 'Under Review')")
    in_progress = cursor.fetchone()[0]

    res_rate = round((resolved / total * 100), 1) if total > 0 else 0.0

    # Category distribution
    cursor.execute("SELECT category, COUNT(*) as cnt FROM complaints GROUP BY category ORDER BY cnt DESC")
    cat_rows = cursor.fetchall()
    cat_dist = [CategoryCount(category=r["category"], count=r["cnt"]) for r in cat_rows]

    # Priority distribution
    cursor.execute("SELECT priority, COUNT(*) as cnt FROM complaints GROUP BY priority")
    pri_rows = cursor.fetchall()
    pri_dist = [PriorityCount(priority=r["priority"], count=r["cnt"]) for r in pri_rows]

    # Recent sanitized public complaints
    cursor.execute("""
    SELECT reference_id, title, category, priority, status, location, created_at, ai_summary
    FROM complaints
    ORDER BY created_at DESC
    LIMIT 6
    """)
    recent_rows = cursor.fetchall()
    
    # Sanitize location to area only
    recent = []
    for r in recent_rows:
        loc_parts = r["location"].split(",")
        area = loc_parts[-2].strip() if len(loc_parts) > 1 else loc_parts[0].strip()
        recent.append(ComplaintPublicItem(
            reference_id=r["reference_id"],
            title=r["title"],
            category=r["category"],
            priority=r["priority"],
            status=r["status"],
            location_area=area,
            created_at=r["created_at"],
            ai_summary=r["ai_summary"]
        ))

    conn.close()

    return PublicStatsResponse(
        total_complaints=total,
        resolved_complaints=resolved,
        in_progress_complaints=in_progress,
        resolution_rate_percent=res_rate,
        category_distribution=cat_dist,
        priority_distribution=pri_dist,
        recent_public_complaints=recent
    )

@router.get("/admin", response_model=AdminStatsResponse)
def get_admin_stats():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM complaints")
    total = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM complaints WHERE status IN ('Submitted', 'Under Review')")
    pending = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM complaints WHERE status IN ('Assigned', 'In Progress')")
    in_progress = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM complaints WHERE status = 'Resolved'")
    resolved = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM complaints WHERE status = 'Closed'")
    closed = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM complaints WHERE priority = 'Critical'")
    critical = cursor.fetchone()[0]

    cursor.execute("SELECT category, COUNT(*) as cnt FROM complaints GROUP BY category ORDER BY cnt DESC")
    cat_rows = cursor.fetchall()
    cat_dist = [CategoryCount(category=r["category"], count=r["cnt"]) for r in cat_rows]

    cursor.execute("SELECT priority, COUNT(*) as cnt FROM complaints GROUP BY priority")
    pri_rows = cursor.fetchall()
    pri_dist = [PriorityCount(priority=r["priority"], count=r["cnt"]) for r in pri_rows]

    cursor.execute("SELECT status, COUNT(*) as cnt FROM complaints GROUP BY status")
    st_rows = cursor.fetchall()
    st_dist = [StatusCount(status=r["status"], count=r["cnt"]) for r in st_rows]

    conn.close()

    return AdminStatsResponse(
        total_complaints=total,
        pending_complaints=pending,
        in_progress_complaints=in_progress,
        resolved_complaints=resolved,
        closed_complaints=closed,
        critical_complaints=critical,
        category_distribution=cat_dist,
        priority_distribution=pri_dist,
        status_distribution=st_dist
    )
