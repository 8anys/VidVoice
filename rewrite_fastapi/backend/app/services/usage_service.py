from __future__ import annotations

from pathlib import Path
from urllib.parse import unquote, urlparse

from app.core.config import AUDIO_DIR, UPLOADS_DIR, VIDEO_DIR
from app.services.db import db_connection


def _lookup_id(connection, table: str, code: str) -> int:
    row = connection.execute(f"SELECT id FROM {table} WHERE code = %s", (code,)).fetchone()
    return row["id"]


def _path_from_url(public_url: str) -> Path | None:
    path = unquote(urlparse(public_url or "").path)
    if path.startswith("/audio/"):
        return AUDIO_DIR / path.removeprefix("/audio/")
    if path.startswith("/videos/"):
        return VIDEO_DIR / path.removeprefix("/videos/")
    if path.startswith("/uploads/"):
        return UPLOADS_DIR / path.removeprefix("/uploads/")
    return None


def _insert_media_file(connection, user_id: str, media_type: str, public_url: str, original_filename: str, mime_type: str) -> str | None:
    path = _path_from_url(public_url)
    if not path or not path.exists():
        return None
    media_type_id = _lookup_id(connection, "media_type", media_type)
    row = connection.execute(
        """
        INSERT INTO media_file (
            owner_id,
            media_type_id,
            original_filename,
            storage_path,
            public_url,
            mime_type,
            file_size_bytes
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (storage_path) DO UPDATE
        SET public_url = EXCLUDED.public_url
        RETURNING id
        """,
        (user_id, media_type_id, original_filename, str(path), public_url, mime_type, path.stat().st_size),
    ).fetchone()
    return str(row["id"]) if row else None


def _insert_usage_event(connection, user_id: str, event_type: str, credits_used: int, characters: int = 0, provider: str | None = None) -> None:
    provider_id = _lookup_id(connection, "provider", provider) if provider else None
    event_type_id = _lookup_id(connection, "usage_event_type", event_type)
    connection.execute(
        """
        INSERT INTO usage_event (
            user_id,
            usage_event_type_id,
            provider_id,
            characters,
            credits_used
        )
        VALUES (%s, %s, %s, %s, %s)
        """,
        (user_id, event_type_id, provider_id, max(0, characters), max(0, credits_used)),
    )


def record_audio_generation(user_id: str, result: dict, payload: dict) -> None:
    text = str(result.get("text") or payload.get("text") or "")
    characters = int(result.get("character_cost") or len(text) or 0)
    public_url = result.get("audio_url") or result.get("download_url") or ""
    filename = Path(urlparse(public_url).path).name or f"{result.get('id', 'audio')}.mp3"
    settings = result.get("settings") if isinstance(result.get("settings"), dict) else {}

    with db_connection() as connection:
        media_id = _insert_media_file(connection, user_id, "audio", public_url, filename, "audio/mpeg")
        connection.execute(
            """
            INSERT INTO tts_generation (
                provider_id,
                status_id,
                source_text,
                output_audio_media_id,
                character_count,
                stability,
                similarity_boost,
                style,
                speed,
                use_speaker_boost,
                completed_at
            )
            VALUES (
                (SELECT id FROM provider WHERE code = 'elevenlabs'),
                (SELECT id FROM job_status WHERE code = 'completed'),
                %s, %s, %s, %s, %s, %s, %s, %s, now()
            )
            """,
            (
                text,
                media_id,
                characters,
                settings.get("stability"),
                settings.get("similarity_boost"),
                settings.get("style"),
                settings.get("speed"),
                settings.get("use_speaker_boost", True),
            ),
        )
        _insert_usage_event(connection, user_id, "tts", characters, characters, "elevenlabs")
        connection.commit()


def record_video_generation(user_id: str, result: dict, payload: dict) -> None:
    public_url = result.get("video_url") or result.get("download_url") or ""
    filename = Path(urlparse(public_url).path).name or f"{result.get('id', 'video')}.mp4"
    slides = int(result.get("slides") or 0)
    credits = max(1, slides) * 500
    aspect_ratio = result.get("aspect_ratio") or payload.get("aspect_ratio") or "16:9"

    with db_connection() as connection:
        media_id = _insert_media_file(connection, user_id, "video", public_url, filename, "video/mp4")
        connection.execute(
            """
            INSERT INTO video_generation (
                status_id,
                aspect_ratio_id,
                output_video_media_id,
                duration_seconds,
                completed_at
            )
            VALUES (
                (SELECT id FROM job_status WHERE code = 'completed'),
                (SELECT id FROM aspect_ratio WHERE code = %s),
                %s,
                %s,
                now()
            )
            """,
            (aspect_ratio, media_id, result.get("duration")),
        )
        _insert_usage_event(connection, user_id, "video_render", credits, 0, None)
        connection.commit()


def record_translation_usage(user_id: str, source_text: str) -> None:
    characters = len(source_text or "")
    if not characters:
        return
    with db_connection() as connection:
        _insert_usage_event(connection, user_id, "translation", characters, characters, "google_translate")
        connection.commit()
