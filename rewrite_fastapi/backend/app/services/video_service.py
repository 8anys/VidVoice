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


def _build_concat_file(paths: list[Path], target: Path) -> None:
    lines = []
    for path in paths:
        lines.append(f"file '{_concat_path(path)}'")
    target.write_text("\n".join(lines), encoding="utf-8")


ANIMATION_SEQUENCE = ("zoom_in", "pan_up", "pan_down", "zoom_in")


def _scene_filter(width: int, height: int, animation: str) -> str:
    if animation == "pan_up":
        overlay_y = "(H-h)/2-28*t"
        fg_filter = (
            f"scale={width}:{height}:force_original_aspect_ratio=decrease,"
            "scale=iw*1.08:ih*1.08,setsar=1[fg]"
        )
    elif animation == "pan_down":
        overlay_y = "(H-h)/2+28*t"
        fg_filter = (
            f"scale={width}:{height}:force_original_aspect_ratio=decrease,"
            "scale=iw*1.08:ih*1.08,setsar=1[fg]"
        )
    else:
        overlay_y = "(H-h)/2"
        fg_filter = (
            f"scale={width}:{height}:force_original_aspect_ratio=decrease,"
            "scale='iw*(1+0.028*t)':'ih*(1+0.028*t)':eval=frame,setsar=1[fg]"
        )

    return (
        "[0:v]split=2[bgsrc][fgsrc];"
        f"[bgsrc]scale={width}:{height}:force_original_aspect_ratio=increase,"
        f"crop={width}:{height},boxblur=24:2,eq=saturation=0.82:brightness=-0.04[bg];"
        f"[fgsrc]{fg_filter};"
        f"[bg][fg]overlay=(W-w)/2:{overlay_y}:format=auto,format=yuv420p[v]"
    )


def compose_video_file(payload: dict) -> dict:
    pairs = payload.get("pairs") if isinstance(payload.get("pairs"), list) else []
    if not pairs:
        raise HTTPException(status_code=400, detail="Numbered image/audio pairs are required.")

    aspect_ratio = str(payload.get("aspect_ratio") or "16:9")
    width, height = ASPECT_RATIOS.get(aspect_ratio, ASPECT_RATIOS["16:9"])
    motion_enabled = payload.get("motion") != "none"

    video_id = uuid4().hex
    output_name = f"{video_id}.mp4"
    output_path = VIDEO_DIR / output_name
    temp_dir = VIDEO_DIR / "_tmp"
    temp_dir.mkdir(parents=True, exist_ok=True)
    ffmpeg = _ensure_tool("ffmpeg")
    clip_paths = []
    total_duration = 0.0

    for index, pair in enumerate(pairs, start=1):
        if not isinstance(pair, dict):
            continue
        image = pair.get("image") if isinstance(pair.get("image"), dict) else {}
        audio = pair.get("audio") if isinstance(pair.get("audio"), dict) else {}
        image_path = _path_from_media_url(str(image.get("url", "")), "image")
        audio_path = _path_from_media_url(str(audio.get("url") or audio.get("audio_url") or ""), "audio")
        duration = _probe_duration(audio_path)
        animation = ANIMATION_SEQUENCE[(index - 1) % len(ANIMATION_SEQUENCE)] if motion_enabled else "none"
        total_duration += duration
        clip_path = temp_dir / f"{video_id}_{index:04d}.mp4"
        clip_paths.append(clip_path)

        scene_command = [
            ffmpeg,
            "-y",
            "-loop",
            "1",
            "-t",
            f"{duration:.3f}",
            "-i",
            str(image_path),
            "-i",
            str(audio_path),
            "-filter_complex",
            _scene_filter(width, height, animation),
            "-map",
            "[v]",
            "-map",
            "1:a",
            "-shortest",
            "-r",
            "30",
            "-c:v",
            "libx264",
            "-preset",
            "veryfast",
            "-crf",
            "22",
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            "-pix_fmt",
            "yuv420p",
            str(clip_path),
        ]
        result = subprocess.run(scene_command, capture_output=True, text=True, timeout=300)
        if result.returncode != 0 or not clip_path.exists():
            raise HTTPException(status_code=500, detail=result.stderr.strip() or f"Scene {index} generation failed.")

    if not clip_paths:
        raise HTTPException(status_code=400, detail="At least one valid image/audio pair is required.")

    concat_file = temp_dir / f"{video_id}.txt"
    _build_concat_file(clip_paths, concat_file)
    command = [
        ffmpeg,
        "-y",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        str(concat_file),
        "-c",
        "copy",
        "-movflags",
        "+faststart",
        str(output_path),
    ]
    result = subprocess.run(command, capture_output=True, text=True, timeout=300)
    try:
        concat_file.unlink(missing_ok=True)
        for clip_path in clip_paths:
            clip_path.unlink(missing_ok=True)
    except OSError:
        pass

    if result.returncode != 0 or not output_path.exists():
        raise HTTPException(status_code=500, detail=result.stderr.strip() or "Video generation failed.")

    copied_output_path = copy_to_output(output_path, "video")

    return {
        "done": True,
        "id": video_id,
        "slides": len(clip_paths),
        "format": "mp4",
        "duration": round(total_duration, 2),
        "aspect_ratio": aspect_ratio,
        "fit": "blurred_background",
        "video_url": f"/videos/{output_name}",
        "download_url": f"/videos/{output_name}",
        "output_path": copied_output_path,
        "message": "Video Ready",
    }
