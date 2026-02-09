from dotenv import load_dotenv
load_dotenv()

from fastapi.responses import FileResponse
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import uuid
import subprocess
from contextlib import asynccontextmanager

from app.db import get_connection
from app.schemas import JobCreate
from app.routes.jobs import router as jobs_router
from app.routes.downloads import router as downloads_router
from app.routes.results import router as results_router

from workers.tasks import process_job

@asynccontextmanager
async def lifespan(app: FastAPI):
    # STARTUP: Launch Celery worker in a separate process
    # --concurrency=1 is crucial to keep memory low on free tiers
    worker_proc = subprocess.Popen([
        "celery", "-A", "workers.celery_app", "worker", 
        "--loglevel=info", "--concurrency=1"
    ])
    
    yield  # The app runs here
    
    # SHUTDOWN: Kill the worker when the app stops
    worker_proc.terminate()

app = FastAPI(title="MOMENT", lifespan=lifespan)
app.include_router(downloads_router)
app.include_router(jobs_router)
app.include_router(results_router)

origins = [
    "http://localhost:3000",          # Local development
    "https://moment-sand.vercel.app/",    # VERCEL URL
    "https://moment-production-e69d.up.railway.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "MOMENT backend alive", "worker": "running"}


@app.post("/jobs")
def create_job(job: JobCreate):
    job_id = str(uuid.uuid4())
    created_at = datetime.utcnow().isoformat()

    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        INSERT INTO jobs (job_id, video_url, content_type, intent, tone, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            job_id,
            job.video_url,
            job.content_type,
            job.intent,
            job.tone,
            "queued",
            created_at,
        ),
    )

    conn.commit()
    conn.close()

    # Start background processing - Dispatch Celery task
    process_job.delay(job_id)
    return {

        "job_id": job_id,
        "status": "queued"
    }


@app.get("/jobs/{job_id}")
def get_job(job_id: str):
    conn = get_connection()
    # No need to call cursor() manually if you want to use the row_factory properly
    cur = conn.cursor()

    cur.execute(
        "SELECT job_id, status, video_url, content_type, intent, tone FROM jobs WHERE job_id=?",
        (job_id,),
    )

    row = cur.fetchone()
    conn.close()

    if not row:
        return {"error": "job not found"}

    # Safer way to return a dictionary from a sqlite3.Row object
    return {key: row[key] for key in row.keys()}

@app.get("/clips/{job_id}/{clip_filename}")
def get_clip(job_id: str, clip_filename: str):
    clip_path = Path(f"jobs/{job_id}/clips/{clip_filename}")

    if not clip_path.exists():
        return {"error": "clip not found"}

    return FileResponse(
        clip_path,
        media_type="video/mp4",
        filename=clip_filename,
    )
