from dotenv import load_dotenv
load_dotenv()
# from fastapi import logger

import json
from workers.celery_app import celery_app
from app.db import get_connection
from app.analysis import save_clips
from app.gemini import analyze_transcript
from app.ingest import download_video, split_video
from app.transcribe import transcribe_chunks
from app.storage import get_job_dir
from app.scoring import score_all
from pathlib import Path

from app.ffmpeg import generate_clips
from app.storage import zip_clips

from google.api_core.exceptions import ClientError
import logging
logger = logging.getLogger(__name__)


@celery_app.task(bind=True)
def process_job(self, job_id: str):
    conn = get_connection()
    cur = conn.cursor()
    # fetch video url
    cur.execute("SELECT video_url FROM jobs WHERE job_id=?", (job_id,))
    row = cur.fetchone()
    video_url = row["video_url"]

    # mark processing
    cur.execute("UPDATE jobs SET status=? WHERE job_id=?", ("processing", job_id))
    conn.commit()
    conn.close()

    job_dir = get_job_dir(job_id)

    # download video
    video_path = download_video(video_url, job_dir)

    # split into chunks
    chunks = split_video(video_path, chunk_length_sec=60)

    # transcribe all chunks
    transcribe_chunks(chunks, job_dir)

    # load transcript
    with open(job_dir / "transcript.json") as f:
        transcript = json.load(f)
    
    # fetch job metadata
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT intent,tone FROM jobs WHERE job_id=?",
        (job_id,)
    )
    intent, tone = cur.fetchone()
    conn.close()
    
    platforms = ["tiktok", "instagram", "ytshorts", "twitter"]
    
    try:
        analysis = analyze_transcript(transcript, platforms, intent, tone)
        preset = intent or "podcast"
        analysis["clips"] = score_all(analysis["clips"], preset)

    except ClientError as e:
        logger.error(f"Gemini failed: {e}")
        return
    # Debug: print analysis result
    print("Gemini Analysis result:", analysis)
    print("Number of clips generated:", len(analysis.get("clips", [])))

    save_clips(job_id, analysis["clips"])

    # 🎬 actually generate video clips
    clip_files = generate_clips(
        video_path=str(video_path),
        clips=analysis["clips"],
        job_id=job_id,
    )

    print("Generated clips:", clip_files)

    # 📦 zip them
    zip_path = zip_clips(job_id)
    print("Zip ready at:", zip_path)

    # mark completed
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("UPDATE jobs SET status=? WHERE job_id=?", ("completed", job_id))
    conn.commit()
    conn.close()


    return job_id
