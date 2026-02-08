from concurrent.futures import ThreadPoolExecutor
from faster_whisper import WhisperModel
from pathlib import Path
import json

# tiny model is fastest

# def transcribe_chunk(video_path: Path):
#     segments, _ = model.transcribe(str(video_path), language="en")
#     results = []
#     for s in segments:
#         results.append(
#             {"start": s.start, "end": s.end, "text": s.text.strip()}
#         )
#     return results

def _worker(chunk_path):
    model = WhisperModel("tiny", device="cpu", compute_type="int8")
    
    segments, _ = model.transcribe(str(chunk_path), language="en")

    out = []
    for s in segments:
        out.append({
            "start": s.start,
            "end": s.end,
            "text": s.text.strip()
        })
    
    del model  # Free up memory immediately after transcription
    import gc
    gc.collect()  # Force garbage collection to free memory
    
    return out


def transcribe_chunks(video_chunks: list, job_dir: Path):
    all_segments = []

    with ThreadPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(_worker, video_chunks))

    for i, segments in enumerate(results):
        for seg in segments:
            seg["start"] += i * 60
            seg["end"] += i * 60

        with open(job_dir / f"transcript_part{i+1}.json", "w") as f:
            json.dump(segments, f, indent=2)

        all_segments.extend(segments)

    with open(job_dir / "transcript.json", "w") as f:
        json.dump(all_segments, f, indent=2)

    return all_segments