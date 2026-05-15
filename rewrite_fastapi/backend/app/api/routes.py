from __future__ import annotations

from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, UploadFile

from app.core.config import UPLOADS_DIR
from app.services.elevenlabs_service import generate_speech, list_voices
from app.services.generated_files_service import get_output_directory, import_generated_files, list_generated_files, set_output_directory
from app.services.store import add_project, credits_store, profile_store, projects_store, uploaded_images
from app.services.translation_service import translate_text
from app.services.video_service import compose_video_file


router = APIRouter(prefix="/api")


@router.get("/health")
def health():
    return {"status": "ok"}


@router.get("/profile")
def get_profile():
    return profile_store


@router.put("/profile")
def update_profile(payload: dict):
    profile_store.update(payload)
    return profile_store


@router.get("/projects")
def get_projects():
    return projects_store


@router.post("/projects")
def create_project(payload: dict):
    return add_project(payload.get("name", "Untitled Project"), payload.get("language", "EN"), int(payload.get("scenes", 1)))


@router.get("/credits")
def get_credits():
    return credits_store


@router.post("/translate")
def translate(payload: dict):
    return translate_text(payload.get("text", ""), payload.get("direction", "toEN"))
    text = payload.get("text", "").strip()
    direction = payload.get("direction", "toEN")
    if not text:
        return {"text": ""}

    translated = (
        "Welcome to VidVoice — transform your text into voice and video in seconds."
        if direction == "toEN"
        else "Ласкаво просимо до VidVoice — перетворіть ваш текст на голос та відео за секунди."
    )
    return {"text": translated}


@router.post("/generate-audio")
def generate_audio(payload: dict):
    return generate_speech(payload)


@router.get("/voices")
def get_voices():
    return list_voices()


@router.get("/generated-files")
def get_generated_files(limit: int = 8):
    return list_generated_files(limit)


@router.post("/generated-files/import")
async def import_generated(files: list[UploadFile] = File(...)):
    return await import_generated_files(files)


@router.get("/output-directory")
def output_directory():
    return get_output_directory()


@router.post("/output-directory")
def update_output_directory(payload: dict):
    return set_output_directory(payload.get("path", ""))


@router.post("/upload-images")
async def upload_images(files: list[UploadFile] = File(...)):
    new_items = []
    for file in files:
        extension = Path(file.filename or "").suffix.lower()
        if extension not in {".png", ".jpg", ".jpeg", ".webp"}:
            continue
        item_id = uuid4().hex
        target_name = f"{item_id}{extension}"
        target_path = UPLOADS_DIR / target_name
        content = await file.read()
        target_path.write_bytes(content)
        item = {"id": item_id, "url": f"/uploads/{target_name}", "name": file.filename}
        uploaded_images.append(item)
        new_items.append(item)
    return new_items


@router.post("/compose-video")
def compose_video(payload: dict):
    return compose_video_file(payload)

