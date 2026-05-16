from __future__ import annotations

import base64
import binascii
import hashlib
import hmac
import json
import os
import time
from uuid import UUID

from fastapi import Header, HTTPException

from app.core.config import SECRET_KEY
from app.services.db import db_connection


TOKEN_TTL_SECONDS = 60 * 60 * 24 * 14

PROFILE_SELECT = """
    SELECT
        u.id,
        u.email,
        u.display_name AS full_name,
        u.role,
        u.created_at AS created_date,
        l.code AS language,
        t.code AS theme,
        f.code AS export_format,
        p.auto_save,
        p.auto_translate,
        COALESCE(project_stats.projects_count, 0) AS projects_count,
        COALESCE(audio_stats.audio_count, 0) AS audio_generated_count,
        COALESCE(video_stats.video_count, 0) AS videos_generated_count,
        COALESCE(usage_stats.credits_used, 0) AS credits_used
    FROM app_user u
    JOIN user_profile p ON p.user_id = u.id
    JOIN language l ON l.id = p.language_id
    JOIN ui_theme t ON t.id = p.theme_id
    JOIN export_format f ON f.id = p.default_export_format_id
    LEFT JOIN (
        SELECT owner_id, COUNT(*) AS projects_count
        FROM project
        GROUP BY owner_id
    ) project_stats ON project_stats.owner_id = u.id
    LEFT JOIN (
        SELECT m.owner_id, COUNT(*) AS audio_count
        FROM media_file m
        JOIN media_type mt ON mt.id = m.media_type_id
        WHERE mt.code = 'audio'
        GROUP BY m.owner_id
    ) audio_stats ON audio_stats.owner_id = u.id
    LEFT JOIN (
        SELECT m.owner_id, COUNT(*) AS video_count
        FROM media_file m
        JOIN media_type mt ON mt.id = m.media_type_id
        WHERE mt.code = 'video'
        GROUP BY m.owner_id
    ) video_stats ON video_stats.owner_id = u.id
    LEFT JOIN (
        SELECT user_id, SUM(credits_used) AS credits_used
        FROM usage_event
        GROUP BY user_id
    ) usage_stats ON usage_stats.user_id = u.id
    WHERE u.id = %s
"""


def _b64_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode("ascii").rstrip("=")


def _b64_decode(data: str) -> bytes:
    return base64.urlsafe_b64decode(data + "=" * (-len(data) % 4))


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 240_000)
    return f"pbkdf2_sha256${_b64_encode(salt)}${_b64_encode(digest)}"


def verify_password(password: str, password_hash: str | None) -> bool:
    if not password_hash:
        return False
    try:
        algorithm, salt_value, digest_value = password_hash.split("$", 2)
    except ValueError:
        return False
    if algorithm != "pbkdf2_sha256":
        return False
    salt = _b64_decode(salt_value)
    expected = _b64_decode(digest_value)
    actual = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 240_000)
    return hmac.compare_digest(actual, expected)


def create_token(user_id: str) -> str:
    payload = {"sub": user_id, "exp": int(time.time()) + TOKEN_TTL_SECONDS}
    payload_value = _b64_encode(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signature = hmac.new(SECRET_KEY.encode("utf-8"), payload_value.encode("ascii"), hashlib.sha256).digest()
    return f"{payload_value}.{_b64_encode(signature)}"


def read_token(token: str) -> str:
    try:
        payload_value, signature_value = token.split(".", 1)
        signature = _b64_decode(signature_value)
    except (ValueError, binascii.Error) as error:
        raise HTTPException(status_code=401, detail="Invalid token.") from error
    expected = hmac.new(SECRET_KEY.encode("utf-8"), payload_value.encode("ascii"), hashlib.sha256).digest()
    if not hmac.compare_digest(signature, expected):
        raise HTTPException(status_code=401, detail="Invalid token.")
    try:
        payload = json.loads(_b64_decode(payload_value).decode("utf-8"))
        if int(payload.get("exp", 0)) < int(time.time()):
            raise HTTPException(status_code=401, detail="Token expired.")
        return str(UUID(payload["sub"]))
    except HTTPException:
        raise
    except (KeyError, TypeError, ValueError, binascii.Error) as error:
        raise HTTPException(status_code=401, detail="Invalid token.") from error


def get_current_user(authorization: str | None = Header(default=None)) -> dict:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Authentication required.")
    user_id = read_token(authorization.split(" ", 1)[1].strip())
    with db_connection() as connection:
        user = connection.execute(PROFILE_SELECT, (user_id,)).fetchone()
    if not user:
        raise HTTPException(status_code=401, detail="User not found.")
    return dict(user)


def public_profile(user: dict) -> dict:
    return {
        "id": str(user["id"]),
        "email": user["email"],
        "full_name": user["full_name"],
        "role": user["role"],
        "created_date": user["created_date"].isoformat() if hasattr(user["created_date"], "isoformat") else user["created_date"],
        "language": user["language"],
        "theme": user["theme"],
        "voice": "rachel",
        "quality": "high",
        "export_format": user["export_format"],
        "auto_save": user["auto_save"],
        "auto_translate": user["auto_translate"],
        "stats": {
            "projects": int(user.get("projects_count") or 0),
            "audio_generated": int(user.get("audio_generated_count") or 0),
            "videos_generated": int(user.get("videos_generated_count") or 0),
            "credits_used": int(user.get("credits_used") or 0),
        },
    }


def register_user(payload: dict) -> dict:
    email = str(payload.get("email", "")).strip().lower()
    password = str(payload.get("password", ""))
    full_name = str(payload.get("full_name", "")).strip() or "User"
    if "@" not in email:
        raise HTTPException(status_code=400, detail="Valid email is required.")
    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    with db_connection() as connection:
        exists = connection.execute("SELECT id FROM app_user WHERE email = %s", (email,)).fetchone()
        if exists:
            raise HTTPException(status_code=409, detail="User with this email already exists.")
        user = connection.execute(
            """
            INSERT INTO app_user (email, password_hash, display_name)
            VALUES (%s, %s, %s)
            RETURNING id, email, display_name AS full_name, role, created_at AS created_date
            """,
            (email, hash_password(password), full_name),
        ).fetchone()
        connection.execute(
            """
            INSERT INTO user_profile (user_id, language_id, theme_id, default_export_format_id)
            VALUES (
                %s,
                (SELECT id FROM language WHERE code = 'en'),
                (SELECT id FROM ui_theme WHERE code = 'dark'),
                (SELECT id FROM export_format WHERE code = 'mp4')
            )
            """,
            (user["id"],),
        )
        connection.execute("INSERT INTO credit_account (user_id, total_credits) VALUES (%s, %s)", (user["id"], 100000))
        connection.commit()

    user = get_user_by_id(str(user["id"]))
    return {"token": create_token(str(user["id"])), "user": public_profile(user)}


def login_user(payload: dict) -> dict:
    email = str(payload.get("email", "")).strip().lower()
    password = str(payload.get("password", ""))
    with db_connection() as connection:
        user = connection.execute("SELECT id, password_hash FROM app_user WHERE email = %s", (email,)).fetchone()
    if not user or not verify_password(password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    profile = get_user_by_id(str(user["id"]))
    return {"token": create_token(str(user["id"])), "user": public_profile(profile)}


def get_user_by_id(user_id: str) -> dict:
    with db_connection() as connection:
        user = connection.execute(PROFILE_SELECT, (user_id,)).fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return dict(user)


def update_user_profile(user_id: str, payload: dict) -> dict:
    full_name = str(payload.get("full_name", "")).strip()
    with db_connection() as connection:
        if full_name:
            connection.execute(
                "UPDATE app_user SET display_name = %s, updated_at = now() WHERE id = %s",
                (full_name, user_id),
            )
        connection.execute(
            """
            UPDATE user_profile
            SET
                auto_save = COALESCE(%s, auto_save),
                auto_translate = COALESCE(%s, auto_translate)
            WHERE user_id = %s
            """,
            (payload.get("auto_save"), payload.get("auto_translate"), user_id),
        )
        connection.commit()
    return public_profile(get_user_by_id(user_id))
