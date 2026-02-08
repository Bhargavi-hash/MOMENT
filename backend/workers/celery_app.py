import os
from celery import Celery

# Check if we are on Railway (which uses /data) or Local
if os.path.exists("/data"):
    # PRODUCTION (Railway)
    DB_PATH = "/data/moment_vault.sqlite"
else:
    # LOCAL (Your computer)
    DB_PATH = "moment_vault.sqlite"

celery_app = Celery(
    "moment",
    # We change these from Redis to SQLAlchemy + SQLite
    broker=f"sqla+sqlite:///{DB_PATH}",
    backend=f"db+sqlite:///{DB_PATH}",
    include=["workers.tasks"], 
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    # Crucial for SQLite to prevent "Database is locked" errors
    worker_concurrency=1 
)