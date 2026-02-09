import os
from celery import Celery

# Get the URL from the environment
REDIS_URL = os.getenv("REDIS_URL")

# --- DEBUG LOG ---
if REDIS_URL:
    print(f"SUCCESS: Found Redis URL starting with: {REDIS_URL[:15]}...")
else:
    print("ERROR: REDIS_URL environment variable is missing!")
# -----------------

celery_app = Celery(
    "moment",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=["workers.tasks"], 
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    # Still keep concurrency low to save memory on free tier
    worker_concurrency=1 
)
