import os
from celery import Celery

# Railway provides REDIS_URL automatically once you link the service.
# We fallback to a local redis if the variable isn't found.
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

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
