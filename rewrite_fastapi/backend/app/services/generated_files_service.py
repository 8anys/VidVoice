from __future__ import annotations

import json
import shutil
from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile

from app.core.config import AUDIO_DIR, STORAGE_DIR, VIDEO_DIR


SETTINGS_PATH = STORAGE_DIR / "settings.json"
AUDIO_EXTENSIONS = {".mp3", ".wav", ".m4a", ".aac", ".ogg"}
VIDEO_EXTENSIONS = {".mp4", ".mov", ".webm", ".mkv"}


def _read_settings() -> dict:
    if not SETTINGS_PATH.exists():
        return {}
    try:
        return json.loads(SETTINGS_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}


def _write_settings(settings: dict) -> None:
    STORAGE_DIR.mkdir(parents=True, exist_ok=True)
    SETTINGS_PATH.write_text(json.dumps(settings, ensure_ascii=False, indent=2), encoding="utf-8")


def get_output_directory() -> dict:
    path = _read_settings().get("output_directory", "")
    return {"path": path, "configured": bool(path)}


def set_output_directory(path_value: str) -> dict:
    raw_path = str(path_value or "").strip().strip('"')
    if not raw_path:
        settings = _read_settings()
        settings.pop("output_directory", None)
        _write_settings(settings)
        return {"path": "", "configured": False}

    target = Path(raw_path).expanduser()
    try:
        target.mkdir(parents=True, exist_ok=True)
    except OSError as error:
        raise HTTPException(status_code=400, detail=f"Could not create output directory: {error}") from error

    settings = _read_settings()
    settings["output_directory"] = str(target.resolve())
    _write_settings(settings)
    return {"path": settings["output_directory"], "configured": True}


def copy_to_output(path: Path, media_type: str) -> str | None:
    output_directory = _read_settings().get("output_directory")
    if not output_directory:
        return None

    target_dir = Path(output_directory)
    target_dir.mkdir(parents=True, exist_ok=True)
    target = target_dir / path.name
    try:
        shutil.copy2(path, target)
    except OSError:
        return None
    return str(target)


def _media_item(path: Path, media_type: str, output_path: str | None = None) -> dict:
    stat = path.stat()
    url_prefix = "/audio" if media_type == "audio" else "/videos"
    return {
        "id": path.stem,
        "type": media_type,
        "name": path.name,
        "url": f"{url_prefix}/{path.name}",
        "download_url": f"{url_prefix}/{path.name}",
        "size": stat.st_size,
        "created_at": stat.st_mtime,
        "output_path": output_path,
    }


def list_generated_files(limit: int = 8) -> dict:
    items = []
    for path in AUDIO_DIR.glob("*"):
        if path.is_file() and path.suffix.lower() in AUDIO_EXTENSIONS:
            items.append(_media_item(path, "audio"))
    for path in VIDEO_DIR.glob("*"):
        if path.is_file() and path.suffix.lower() in VIDEO_EXTENSIONS:
            items.append(_media_item(path, "video"))

    items.sort(key=lambda item: item["created_at"], reverse=True)
    return {"items": items[: max(1, min(limit, 12))], "output_directory": get_output_directory()}


def _target_for_upload(file: UploadFile) -> tuple[Path, str]:
    extension = Path(file.filename or "").suffix.lower()
    if extension in AUDIO_EXTENSIONS:
        return AUDIO_DIR / f"{uuid4().hex}{extension}", "audio"
    if extension in VIDEO_EXTENSIONS:
        return VIDEO_DIR / f"{uuid4().hex}{extension}", "video"
    raise HTTPException(status_code=400, detail=f"Unsupported generated file type: {file.filename}")


async def import_generated_files(files: list[UploadFile]) -> dict:
    imported = []
    for file in files:
        target, media_type = _target_for_upload(file)
        content = await file.read()
        target.write_bytes(content)
        output_path = copy_to_output(target, media_type)
        imported.append(_media_item(target, media_type, output_path))
    return {"items": imported}
