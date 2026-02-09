from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.db import get_connection
from app.storage import get_job_dir
from pathlib import Path

router = APIRouter()


# @router.get("/jobs/{job_id}")
# def get_job(job_id: str):
#     conn = get_connection()
#     cur = conn.cursor()

#     cur.execute("SELECT * FROM jobs WHERE job_id=?", (job_id,))
#     job = cur.fetchone()

#     if not job:
#         raise HTTPException(404, "Job not found")

#     cur.execute("SELECT * FROM clips WHERE job_id=?", (job_id,))
#     clips = cur.fetchall()

#     conn.close()

#     job_dir = get_job_dir(job_id)
#     zip_path = job_dir / "clips.zip"

#     return {
#         "job_id": job["job_id"],
#         "status": job["status"],
#         "clips": [dict(c) for c in clips],
#         "download_url": f"/jobs/{job_id}/download" if zip_path.exists() else None
#     }

@router.get("/jobs/{job_id}/download")
def download_zip(job_id: str):
    job_dir = get_job_dir(job_id)
    zip_path = job_dir / "clips.zip"

    if not zip_path.exists():
        raise HTTPException(404, "Zip not ready")

    return FileResponse(zip_path, filename="moment_clips.zip")

