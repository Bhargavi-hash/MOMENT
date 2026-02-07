from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path

from app.storage import get_job_dir, zip_clips
from app.db import get_connection

router = APIRouter(prefix="/downloads")

@router.get("/jobs/{job_id}")
def get_job(job_id: str):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM jobs WHERE job_id=?", (job_id,))
    job = cur.fetchone()

    if not job:
        raise HTTPException(404, "Job not found")

    cur.execute("SELECT * FROM clips WHERE job_id=?", (job_id,))
    clips = cur.fetchall()

    conn.close()

    job_dir = get_job_dir(job_id)
    zip_path = job_dir / "clips.zip"

    return {
        "job_id": job["job_id"],
        "status": job["status"],
        "clips": [dict(c) for c in clips],
        "download_url": f"/downloads/{job_id}/zip" if zip_path.exists() else None
    }

@router.get("/{job_id}/zip")
def download_zip(job_id: str):
    job_dir = get_job_dir(job_id)

    zip_path = zip_clips(job_dir)

    return FileResponse(
        zip_path,
        filename="moment_clips.zip",
        media_type="application/zip"
    )


@router.get("/{job_id}/clip/{filename}")
def download_clip(job_id: str, filename: str):
    job_dir = get_job_dir(job_id)
    clip = job_dir / "clips" / filename

    print("JOB DIR:", job_dir)
    print("FILENAME:", filename)
    print("FULL PATH:", clip)
    print("EXISTS:", clip.exists())
    
    if not clip.exists():
        raise HTTPException(404, "Clip not found")

    return FileResponse(
        clip,
        media_type="video/mp4",
        filename=filename
    )
