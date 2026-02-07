from pydantic import BaseModel
from typing import List


class JobCreate(BaseModel):
    video_url: str
    content_type: str = "application/json"
    intent: str = "viral"
    tone: str = "neutral"
    platforms: List[str] = ["tiktok", "instagram", "youtube"]


