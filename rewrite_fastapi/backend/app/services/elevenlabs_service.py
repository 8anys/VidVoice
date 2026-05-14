from __future__ import annotations

import json
import urllib.error
import urllib.parse
import urllib.request
from uuid import uuid4

from fastapi import HTTPException

from app.core.config import AUDIO_DIR, ELEVENLABS_API_KEY, ELEVENLABS_BASE_URL
from app.services.generated_files_service import copy_to_output


FALLBACK_VOICES = [
    {"id": "21m00Tcm4TlvDq8ikWAM", "label": "Rachel", "style": "Calm & Clear", "category": "default"},
    {"id": "hvUegXh0mf2ABlDTB4TE", "label": "Script Voice", "style": "Voice from script.zip", "category": "custom"},
    {"id": "EXAVITQu4vr4xnSDxMaL", "label": "Bella", "style": "Soft & Natural", "category": "default"},
    {"id": "ErXwobaYiN019PkySvjV", "label": "Antoni", "style": "Warm narrator", "category": "default"},
    {"id": "VR6AewLTigWG4xSOukaG", "label": "Arnold", "style": "Deep & strong", "category": "default"},
    {"id": "TxGEqnHWrfWFTfGW9XjX", "label": "Josh", "style": "Deep & steady", "category": "default"},
]

DEFAULT_MODELS = [
    {"id": "eleven_multilingual_v2", "label": "Multilingual v2"},
    {"id": "eleven_flash_v2_5", "label": "Flash v2.5"},
    {"id": "eleven_turbo_v2_5", "label": "Turbo v2.5"},
]


def _require_api_key() -> str:
    if not ELEVENLABS_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="ELEVENLABS_API_KEY is not configured. Set it before starting the FastAPI server.",
        )
    return ELEVENLABS_API_KEY


def _request_json(path: str, method: str = "GET", payload: dict | None = None) -> dict:
    api_key = _require_api_key()
    data = None if payload is None else json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        f"{ELEVENLABS_BASE_URL}{path}",
        data=data,
        method=method,
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "xi-api-key": api_key,
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="ignore") or str(error)
        raise HTTPException(status_code=error.code, detail=detail) from error
    except urllib.error.URLError as error:
        raise HTTPException(status_code=502, detail=f"ElevenLabs request failed: {error.reason}") from error


def _request_audio(path: str, payload: dict) -> tuple[bytes, dict[str, str]]:
    api_key = _require_api_key()
    request = urllib.request.Request(
        f"{ELEVENLABS_BASE_URL}{path}",
        data=json.dumps(payload).encode("utf-8"),
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
            "xi-api-key": api_key,
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=90) as response:
            headers = {key.lower(): value for key, value in response.headers.items()}
            return response.read(), headers
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="ignore") or str(error)
        raise HTTPException(status_code=error.code, detail=detail) from error
    except urllib.error.URLError as error:
        raise HTTPException(status_code=502, detail=f"ElevenLabs request failed: {error.reason}") from error


def _normalize_voice(voice: dict) -> dict:
    labels = voice.get("labels") or {}
    style_parts = [
        labels.get("description"),
        labels.get("accent"),
        labels.get("gender"),
    ]
    style = " • ".join(part for part in style_parts if part) or voice.get("category") or "ElevenLabs voice"
    return {
        "id": voice.get("voice_id") or voice.get("id"),
        "label": voice.get("name") or "Untitled voice",
        "style": style,
        "category": voice.get("category") or "voice",
    }


def list_voices() -> dict:
    if not ELEVENLABS_API_KEY:
        return {"voices": FALLBACK_VOICES, "models": DEFAULT_MODELS, "configured": False}

    try:
        data = _request_json("/v2/voices?include_total_count=true&page_size=30")
        voices = [_normalize_voice(voice) for voice in data.get("voices", []) if voice.get("voice_id")]
    except HTTPException:
        data = _request_json("/v1/voices")
        voices = [_normalize_voice(voice) for voice in data.get("voices", []) if voice.get("voice_id")]

    return {"voices": voices or FALLBACK_VOICES, "models": DEFAULT_MODELS, "configured": True}


def _as_float(value, default: float, min_value: float, max_value: float) -> float:
    try:
        number = float(value)
    except (TypeError, ValueError):
        number = default
    return max(min_value, min(max_value, number))


def generate_speech(payload: dict) -> dict:
    text = str(payload.get("text", "")).strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text is required.")

    voice = payload.get("voice") if isinstance(payload.get("voice"), dict) else {}
    voice_id = payload.get("voice_id") or voice.get("id") or FALLBACK_VOICES[0]["id"]
    model_id = payload.get("model_id") or "eleven_multilingual_v2"
    output_format = urllib.parse.quote(str(payload.get("output_format") or "mp3_44100_128"), safe="")

    settings = payload.get("voice_settings") if isinstance(payload.get("voice_settings"), dict) else payload
    voice_settings = {
        "stability": _as_float(settings.get("stability"), 0.5, 0, 1),
        "similarity_boost": _as_float(settings.get("similarity_boost"), 0.75, 0, 1),
        "style": _as_float(settings.get("style"), 0.0, 0, 1),
        "speed": _as_float(settings.get("speed"), 1.0, 0.7, 1.2),
        "use_speaker_boost": bool(settings.get("use_speaker_boost", True)),
    }

    body = {
        "text": text,
        "model_id": model_id,
        "voice_settings": voice_settings,
    }

    language_code = payload.get("language_code")
    if language_code:
        body["language_code"] = language_code

    audio_bytes, headers = _request_audio(
        f"/v1/text-to-speech/{urllib.parse.quote(str(voice_id), safe='')}?output_format={output_format}",
        body,
    )
    audio_id = uuid4().hex
    filename = f"{audio_id}.mp3"
    audio_path = AUDIO_DIR / filename
    audio_path.write_bytes(audio_bytes)
    output_path = copy_to_output(audio_path, "audio")

    return {
        "generated": True,
        "id": audio_id,
        "audio_url": f"/audio/{filename}",
        "download_url": f"/audio/{filename}",
        "output_path": output_path,
        "provider": "ElevenLabs",
        "voice": {
            "id": voice_id,
            "label": voice.get("label") or voice.get("name") or "ElevenLabs voice",
            "style": voice.get("style") or "Generated speech",
        },
        "model_id": model_id,
        "settings": voice_settings,
        "characters": len(text),
        "character_cost": headers.get("x-character-count"),
        "text": text,
    }
