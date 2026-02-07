import subprocess
from pathlib import Path
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


def generate_clips(video_path, clips, job_id):
    clips_dir = Path(f"jobs/{job_id}/clips")
    clips_dir.mkdir(parents=True, exist_ok=True)

    generated = []

    for clip in clips:
        output = clips_dir / clip["clip_filename"]

        cmd = [
            "ffmpeg",
            "-y",
            "-i", video_path,
            "-ss", str(clip["start"]),
            "-to", str(clip["end"]),
            "-c", "copy",
            str(output),
        ]

        subprocess.run(cmd, check=True)
        generated.append(output.name)

    return generated
