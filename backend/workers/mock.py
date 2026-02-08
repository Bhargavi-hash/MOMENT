import random
import subprocess

def get_video_duration(video_path):
    """Gets the actual duration of the video using ffprobe."""
    try:
        cmd = [
            'ffprobe', '-v', 'error', '-show_entries', 'format=duration',
            '-of', 'default=noprint_wrappers=1:nokey=1', video_path
        ]
        return float(subprocess.check_output(cmd).decode('utf-8').strip())
    except:
        return 60.0 # Fallback

def generate_mock_analysis(transcript_text, platforms, intent=None, tone=None, video_path=None):
    # 1. Get real duration to prevent "Ghost Clips"
    max_duration = get_video_duration(video_path) if video_path else 60.0
    
    # 2. Adjust hooks based on Tone
    if tone == "professional":
        hooks = ["Insightful take on industry trends.", "Key takeaway from today's session.", "Strategic advice for 2026."]
    else:
        hooks = ["You NEED to hear this! 🔥", "Absolute game changer. 😱", "This is wild..."]

    clips = []
    words = transcript_text.split()

    for platform in platforms:
        # If video is very short, only generate 1 clip per platform
        num_clips = 1 if max_duration < 90 else 2
        
        for i in range(num_clips):
            # Ensure clip fits within video length
            # We want at least a 15-sec clip.
            duration = min(random.randint(15, 30), int(max_duration))
            
            # Start time must allow for the duration
            latest_start = max(0, int(max_duration) - duration)
            start_sec = random.randint(0, latest_start)
            
            # Grab a "smart" snippet from transcript
            snippet_idx = random.randint(0, max(0, len(words) - 10))
            transcript_snippet = " ".join(words[snippet_idx : snippet_idx + 8])

            clips.append({
                "start": start_sec,
                "end": start_sec + duration,
                "platform": platform,
                "caption": f"{random.choice(hooks)} | {transcript_snippet}",
                "hashtags": ["#viral", f"#{intent or 'content'}"],
                "virality": round(random.uniform(0.8, 0.99), 2),
                "clip_filename": f"{platform.replace(' ', '_')}_{start_sec}.mp4"
            })
    return {"clips": clips}