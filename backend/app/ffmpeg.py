import subprocess
from app.storage import get_clips_dir


def extract_clip(video_path: str, start: float, end: float, out_path: str):
    duration = end - start

    cmd = [
        "ffmpeg",
        "-y",
        "-ss", str(start),
        "-i", video_path,
        "-t", str(duration),
        "-c:v", "libx264",
        "-c:a", "aac",
        out_path,
    ]

    subprocess.run(cmd, check=True)


def generate_clips(video_path: str, clips: list, job_id: str):
    clips_dir = get_clips_dir(job_id)

    results = []

    for idx, clip in enumerate(clips):
        out = clips_dir / f"clip_{idx}.mp4"

        extract_clip(
            video_path,
            clip["start"],
            clip["end"],
            str(out),
        )

        results.append(str(out))

    return results
