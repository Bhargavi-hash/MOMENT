import os
from google import genai
import json

from sqlalchemy import text
from app.platforms import PLATFORM_SPECS

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
  )

import threading
gemini_lock = threading.Lock()

# Debug: print if the key is loaded
print("Gemini key loaded:", bool(os.getenv("GEMINI_API_KEY")))

def analyze_transcript(transcript, platforms, intent, tone):
    platform_details = {
        p: PLATFORM_SPECS[p] for p in platforms
    }

    prompt = f"""
You are a viral content expert and an expert social media strategist.

Input:
Transcript with timestamps:
{json.dumps(transcript)}

User intent: {intent}
Tone: {tone}

Platform requirements:
{json.dumps(platform_details, indent=2)}

TASK:

Identify the most viral moments.

For EACH platform:
- Select 1–3 clips
- Each clip must have:
  - start (float seconds)
  - end (float seconds)
  - platform
  - caption
  - hashtags (array of strings)

Rules:
- Respect platform max_length
- Start clips at natural sentence boundaries
- Prefer emotional, controversial, funny, or insightful moments
- Captions must be platform-specific
- Hashtags must be relevant

Return ONLY valid JSON:

{{
  "clips": [
    {{
      "start": 12.3,
      "end": 42.1,
      "platform": "tiktok",
      "caption": "...",
      "hashtags": ["#tag1", "#tag2"]
    }}
  ]
}}
"""
    with gemini_lock:
      response = client.models.generate_content(
          model="gemini-2.0-flash",
          contents=prompt,
      )
    text = response.text.strip().replace("```json", "").replace("```", "")
    return json.loads(text)

