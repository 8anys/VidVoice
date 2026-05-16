from __future__ import annotations

from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, UploadFile

from app.core.config import UPLOADS_DIR
from app.services.auth_service import get_current_user, login_user, public_profile, register_user, update_user_profile
from app.services.elevenlabs_service import generate_speech, list_voices
from app.services.generated_files_service import get_output_directory, import_generated_files, list_generated_files, set_output_directory
from app.services.project_service import create_project as create_user_project
from app.services.project_service import delete_project, list_projects, update_project as update_user_project
from app.services.store import credits_store, uploaded_images
from app.services.translation_service import translate_text
from app.services.usage_service import record_audio_generation, record_translation_usage, record_video_generation
from app.services.video_service import compose_video_file


router = APIRouter(prefix="/api")


@router.get("/health")
def health():
    return {"status": "ok"}


@router.post("/auth/register")
def register(payload: dict):
    return register_user(payload)


@router.post("/auth/login")
def login(payload: dict):
    return login_user(payload)


@router.get("/auth/me")
def me(current_user: dict = Depends(get_current_user)):
    return public_profile(current_user)


@router.get("/profile")
def get_profile(current_user: dict = Depends(get_current_user)):
    return public_profile(current_user)


@router.put("/profile")
def update_profile(payload: dict, current_user: dict = Depends(get_current_user)):
    return update_user_profile(str(current_user["id"]), payload)


@router.get("/projects")
def get_projects(current_user: dict = Depends(get_current_user)):
    return list_projects(str(current_user["id"]))


@router.post("/projects")
def create_project(payload: dict, current_user: dict = Depends(get_current_user)):
    return create_user_project(str(current_user["id"]), payload)


@router.put("/projects/{project_id}")
def update_project(project_id: str, payload: dict, current_user: dict = Depends(get_current_user)):
    return update_user_project(str(current_user["id"]), project_id, payload)


@router.delete("/projects/{project_id}")
def remove_project(project_id: str, current_user: dict = Depends(get_current_user)):
    return delete_project(str(current_user["id"]), project_id)


@router.get("/credits")
def get_credits():
    return credits_store


@router.post("/translate")
def translate(payload: dict, current_user: dict = Depends(get_current_user)):
    result = translate_text(payload.get("text", ""), payload.get("direction", "toEN"))
    record_translation_usage(str(current_user["id"]), payload.get("text", ""))
    return result


@router.post("/generate-audio")
def generate_audio(payload: dict, current_user: dict = Depends(get_current_user)):
    result = generate_speech(payload)
    record_audio_generation(str(current_user["id"]), result, payload)
    return result


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
def compose_video(payload: dict, current_user: dict = Depends(get_current_user)):
    result = compose_video_file(payload)
    record_video_generation(str(current_user["id"]), result, payload)
    return result
