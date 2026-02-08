#!/bin/bash
# 1. Start Celery in the background
# We use --concurrency=1 to save memory on the free tier
celery -A workers.celery_app worker --loglevel=info --concurrency=1 &

# 2. Start FastAPI and FORCE it to use Render's port
# Using 0.0.0.0 is required for Render to see the service
uvicorn main:app --host 0.0.0.0 --port ${PORT:-10000}