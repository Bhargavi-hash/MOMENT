# Start the worker in the background
celery -A workers.celery_app worker --loglevel=info &
# Start the API in the foreground
uvicorn main:app --host 0.0.0.0 --port $PORT