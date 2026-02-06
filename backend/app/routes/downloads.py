from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path

from app.storage import get_job_dir, zip_clips
from app.db import get_connection

router = APIRouter(prefix="/downloads")


@router.get("/{job_id}/zip")
def download_zip(job_id: str):
    job_dir = get_job_dir(job_id)

    zip_path = zip_clips(job_dir)

    return FileResponse(
        zip_path,
        filename="moment_clips.zip",
        media_type="application/zip"
    )


@router.get("/{job_id}/clip/{index}")
def download_clip(job_id: str, index: int):
    job_dir = get_job_dir(job_id)
    clip = job_dir / "clips" / f"clip_{index}.mp4"

    if not clip.exists():
        raise HTTPException(404, "Clip not found")

    return FileResponse(
        clip,
        media_type="video/mp4",
        filename=clip.name
    )
