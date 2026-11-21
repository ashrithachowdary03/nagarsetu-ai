import re
from typing import List, Optional
from fastapi import APIRouter, Query, HTTPException
from database import get_connection
from schemas import SimilarComplaintItem

router = APIRouter(prefix="/complaints", tags=["Similar Complaints"])

def extract_tokens(text: str) -> set:
    words = re.findall(r'\b[a-zA-Z0-9]{3,}\b', text.lower())
    stopwords = {"the", "and", "for", "with", "near", "from", "road", "street", "lane", "area", "causing", "there"}
    return {w for w in words if w not in stopwords}

@router.get("/{complaint_id}/similar", response_model=List[SimilarComplaintItem])
def get_similar_complaints(complaint_id: str):
    """
    FR-09: Similar Complaint Detection.
    Identifies potentially duplicate or closely related civic issues
    based on category, lexical overlap, and location keywords.
    """
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM complaints WHERE id = ? OR reference_id = ?", (complaint_id, complaint_id))
    target = cursor.fetchone()
    if not target:
        conn.close()
        raise HTTPException(status_code=404, detail="Target complaint not found")

    target_tokens = extract_tokens(target["title"] + " " + target["description"])
    target_loc_tokens = extract_tokens(target["location"])

    # Query complaints in the same or related category, excluding target itself
    cursor.execute("""
    SELECT id, reference_id, title, description, location, category, status
    FROM complaints
    WHERE id != ? AND reference_id != ? AND category = ?
    """, (target["id"], target["reference_id"], target["category"]))
    candidates = cursor.fetchall()
    conn.close()

    similar_list = []
    for cand in candidates:
        cand_tokens = extract_tokens(cand["title"] + " " + cand["description"])
        cand_loc_tokens = extract_tokens(cand["location"])

        # Jaccard overlap on issue description
        text_union = target_tokens | cand_tokens
        text_inter = target_tokens & cand_tokens
        text_sim = (len(text_inter) / len(text_union)) if text_union else 0.0

        # Location overlap
        loc_inter = target_loc_tokens & cand_loc_tokens
        loc_match = len(loc_inter) > 0

        # Weighted score
        score = (text_sim * 0.6) + (0.4 if loc_match else 0.0)

        if score >= 0.25:
            reasons = []
            if loc_match:
                matched_loc = ", ".join(loc_inter)
                reasons.append(f"Nearby geographical match ({matched_loc})")
            if text_inter:
                matched_words = ", ".join(list(text_inter)[:3])
                reasons.append(f"Matching problem keywords ({matched_words})")

            reason_str = "; ".join(reasons) or "Matching civic category and symptom patterns."

            similar_list.append(SimilarComplaintItem(
                reference_id=cand["reference_id"],
                title=cand["title"],
                category=cand["category"],
                location=cand["location"],
                similarity_score=round(score * 100, 1),
                similarity_reason=reason_str
            ))

    similar_list.sort(key=lambda x: x.similarity_score, reverse=True)
    return similar_list[:5]
