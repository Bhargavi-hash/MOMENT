from pathlib import Path
import zipfile

BASE = Path("jobs")


def get_job_dir(job_id: str) -> Path:
    d = BASE / job_id
    d.mkdir(parents=True, exist_ok=True)
    return d


def get_clips_dir(job_id: str) -> Path:
    d = get_job_dir(job_id) / "clips"
    d.mkdir(parents=True, exist_ok=True)
    return d


def zip_clips(job_id: str) -> str:
    job_dir = get_job_dir(job_id)
    clips_dir = get_clips_dir(job_id)

    zip_path = job_dir / "clips.zip"

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
        for file in clips_dir.glob("*.mp4"):
            z.write(file, arcname=file.name)

    return str(zip_path)
