from pydantic import BaseModel
from typing import List


class JobCreate(BaseModel):
    video_url: str
    content_type: str
    intent: str
    tone: str
    platforms: List[str]


