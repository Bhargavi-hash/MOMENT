FROM python:3.10-slim

# Install system dependencies for audio/video
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the code
COPY . .

# Hugging Face Spaces runs on port 7860 by default
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]