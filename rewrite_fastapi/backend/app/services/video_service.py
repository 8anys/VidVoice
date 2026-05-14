from __future__ import annotations

import shutil
import subprocess
from pathlib import Path
from urllib.parse import unquote, urlparse
from uuid import uuid4

from fastapi import HTTPException

from app.core.config import AUDIO_DIR, UPLOADS_DIR, VIDEO_DIR
from app.services.generated_files_service import copy_to_output


ASPECT_RATIOS = {
    "16:9": (1920, 1080),
    "9:16": (1080, 1920),
    "1:1": (1080, 1080),
}


def _ensure_tool(name: str) -> str:
    tool = shutil.which(name)
    if not tool:
        raise HTTPException(status_code=503, detail=f"{name} is required for video generation.")
    return tool


def _is_inside(path: Path, parent: Path) -> bool:
    try:
        path.resolve().relative_to(parent.resolve())
        return True
    except ValueError:
        return False


def _path_from_media_url(value: str, media_type: str) -> Path:
    parsed_path = unquote(urlparse(value).path)
    if media_type == "audio" and parsed_path.startswith("/audio/"):
        base = AUDIO_DIR
        relative = parsed_path.removeprefix("/audio/")
    elif media_type == "image" and parsed_path.startswith("/uploads/"):
        base = UPLOADS_DIR
        relative = parsed_path.removeprefix("/uploads/")
    else:
        raise HTTPException(status_code=400, detail=f"Invalid {media_type} URL.")

    path = (base / relative).resolve()
    if not _is_inside(path, base) or not path.exists():
        raise HTTPException(status_code=404, detail=f"{media_type.capitalize()} file was not found.")
    return path


def _probe_duration(audio_path: Path) -> float:
    ffprobe = _ensure_tool("ffprobe")
    result = subprocess.run(
        [
            ffprobe,
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(audio_path),
        ],
        capture_output=True,
        text=True,
        timeout=30,
    )
    if result.returncode != 0:
        raise HTTPException(status_code=500, detail=result.stderr.strip() or "Could not read audio duration.")
    try:
        return max(float(result.stdout.strip()), 1.0)
    except ValueError as error:
        raise HTTPException(status_code=500, detail="Invalid audio duration returned by ffprobe.") from error


def _concat_path(path: Path) -> str:
    return str(path).replace("\\", "/").replace("'", "'\\''")


def _build_concat_file(image_paths: list[Path], duration_per_slide: float, target: Path) -> None:
    lines = []
    for image_path in image_paths:
        lines.append(f"file '{_concat_path(image_path)}'")
        lines.append(f"duration {duration_per_slide:.3f}")
    lines.append(f"file '{_concat_path(image_paths[-1])}'")
    target.write_text("\n".join(lines), encoding="utf-8")


def _video_filter(width: int, height: int, fit: str) -> str:
    if fit == "contain":
        return (
            f"scale={width}:{height}:force_original_aspect_ratio=decrease,"
            f"pad={width}:{height}:(ow-iw)/2:(oh-ih)/2:color=black,"
            "setsar=1,format=yuv420p"
        )
    return (
        f"scale={width}:{height}:force_original_aspect_ratio=increase,"
        f"crop={width}:{height},setsar=1,format=yuv420p"
    )


def compose_video_file(payload: dict) -> dict:
    images = payload.get("images") if isinstance(payload.get("images"), list) else []
    audio = payload.get("audio") if isinstance(payload.get("audio"), dict) else {}
    audio_url = payload.get("audio_url") or audio.get("audio_url")
    if not audio_url:
        raise HTTPException(status_code=400, detail="Generated audio is required.")
    if not images:
        raise HTTPException(status_code=400, detail="At least one image is required.")

    image_paths = [_path_from_media_url(str(item.get("url", "")), "image") for item in images if isinstance(item, dict)]
    if not image_paths:
        raise HTTPException(status_code=400, detail="At least one valid image is required.")

    audio_path = _path_from_media_url(str(audio_url), "audio")
    duration = _probe_duration(audio_path)
    duration_per_slide = duration / len(image_paths)

    aspect_ratio = str(payload.get("aspect_ratio") or "16:9")
    width, height = ASPECT_RATIOS.get(aspect_ratio, ASPECT_RATIOS["16:9"])
    fit = "contain" if payload.get("fit") == "contain" else "cover"

    video_id = uuid4().hex
    output_name = f"{video_id}.mp4"
    output_path = VIDEO_DIR / output_name
    temp_dir = VIDEO_DIR / "_tmp"
    temp_dir.mkdir(parents=True, exist_ok=True)
    concat_file = temp_dir / f"{video_id}.txt"
    _build_concat_file(image_paths, duration_per_slide, concat_file)

    ffmpeg = _ensure_tool("ffmpeg")
    command = [
        ffmpeg,
        "-y",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        str(concat_file),
        "-i",
        str(audio_path),
        "-vf",
        _video_filter(width, height, fit),
        "-shortest",
        "-r",
        "30",
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        "23",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-movflags",
        "+faststart",
        str(output_path),
    ]
    result = subprocess.run(command, capture_output=True, text=True, timeout=300)
    try:
        concat_file.unlink(missing_ok=True)
    except OSError:
        pass

    if result.returncode != 0 or not output_path.exists():
        raise HTTPException(status_code=500, detail=result.stderr.strip() or "Video generation failed.")

    copied_output_path = copy_to_output(output_path, "video")

    return {
        "done": True,
        "id": video_id,
        "slides": len(image_paths),
        "format": "mp4",
        "duration": round(duration, 2),
        "aspect_ratio": aspect_ratio,
        "fit": fit,
        "video_url": f"/videos/{output_name}",
        "download_url": f"/videos/{output_name}",
        "output_path": copied_output_path,
        "message": "Video Ready",
    }
