from pathlib import Path

BASE = Path("jobs")


def get_job_dir(job_id: str) -> Path:
    d = BASE / job_id
    d.mkdir(parents=True, exist_ok=True)
    return d

