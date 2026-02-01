import subprocess
from pathlib import Path

from pathlib import Path
import subprocess

def split_video(video_path: Path, chunk_length_sec: int = 60):
    """
    Splits video into chunks of chunk_length_sec seconds.
    Returns list of chunk file paths.
    """
    out_dir = video_path.parent / "chunks"
    out_dir.mkdir(exist_ok=True)
    
    # ffmpeg command to split
    cmd = [
        "ffmpeg",
        "-i", str(video_path),
        "-c", "copy",
        "-map", "0",
        "-segment_time", str(chunk_length_sec),
        "-f", "segment",
        str(out_dir / "chunk_%03d.mp4")
    ]
    
    subprocess.run(cmd, check=True)
    
    return sorted(out_dir.glob("chunk_*.mp4"))


def download_video(url: str, job_dir: Path) -> Path:
    output = job_dir / "original.mp4"

    cmd = [
        "yt-dlp",
        "-f",
        "mp4",
        "-o",
        str(output),
        url,
    ]

    subprocess.run(cmd, check=True)

    return output
