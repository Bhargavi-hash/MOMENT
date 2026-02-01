from workers.celery_app import celery
from app.db import get_connection
from app.ingest import download_video, split_video
from app.transcribe import transcribe_chunks
from app.storage import get_job_dir
from pathlib import Path

@celery.task(bind=True)
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

    # mark completed
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("UPDATE jobs SET status=? WHERE job_id=?", ("completed", job_id))
    conn.commit()
    conn.close()

    return job_id
