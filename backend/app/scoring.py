from app.presets import PRESETS


def score_clip(clip: dict, preset: str = "podcast") -> float:
    weights = PRESETS.get(preset, PRESETS["podcast"])

    score = 0.0

    for key, weight in weights.items():
        value = clip.get(key, 0)
        score += value * weight

    return round(score, 3)


def score_all(clips: list, preset: str):
    for c in clips:
        c["virality"] = score_clip(c, preset)

    return sorted(clips, key=lambda x: x["virality"], reverse=True)
