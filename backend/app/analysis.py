import json
from app.db import get_connection

def save_clips(job_id, clips):
    print(f"Saving {len(clips)} clips for job {job_id}")
    conn = get_connection()
    cur = conn.cursor()

    for clip in clips:
        cur.execute("""
            INSERT INTO clips (job_id, start, end, platform, caption, hashtags, virality, clip_filename)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            job_id,
            clip["start"],
            clip["end"],
            clip["platform"],
            clip["caption"],
            json.dumps(clip["hashtags"]),
            clip.get("virality", 0.0),
            clip.get("clip_filename", "")
        ))

    conn.commit()
    conn.close()
