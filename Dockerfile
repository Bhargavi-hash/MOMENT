FROM python:3.10-slim

# Install system dependencies (Removed su-exec to fix the build error)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    nodejs \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Install requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# CREATE THE ENTRYPOINT SCRIPT
# We use root to ensure we can overwrite /etc/resolv.conf at runtime
RUN printf '#!/bin/sh\n\
echo "nameserver 8.8.8.8" > /etc/resolv.conf\n\
echo "nameserver 8.8.4.4" >> /etc/resolv.conf\n\
echo "DNS successfully set to Google DNS"\n\
# Start the background worker and the web server\n\
PYTHONPATH=/app/backend:/app celery -A backend.workers.tasks worker --loglevel=info & \n\
PYTHONPATH=/app/backend:/app uvicorn backend.main:app --host 0.0.0.0 --port 7860\n' > /entrypoint.sh && \
chmod +x /entrypoint.sh

# Set environment variables
ENV PYTHONPATH=/app/backend:/app
ENV PYTHONUNBUFFERED=1

# Ensure we stay as root for the DNS change
USER root

ENTRYPOINT ["/bin/sh", "/entrypoint.sh"]
