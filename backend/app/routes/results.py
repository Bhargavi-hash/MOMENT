from fastapi import APIRouter
from app.db import get_connection
import json

router = APIRouter(prefix="/results")


@router.get("/{job_id}")
def get_results(job_id: str):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT start,end,platform,caption,hashtags,virality
        FROM clips
        WHERE job_id=?
        ORDER BY virality DESC
    """, (job_id,))

    rows = cur.fetchall()
    conn.close()

    clips = []
    for i, r in enumerate(rows):
        clips.append({
            "index": i,
            "start": r["start"],
            "end": r["end"],
            "platform": r["platform"],
            "caption": r["caption"],
            "hashtags": json.loads(r["hashtags"]),
            "virality": r["virality"]
        })

    return {"clips": clips}
