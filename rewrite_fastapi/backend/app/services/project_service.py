from __future__ import annotations

from fastapi import HTTPException

from app.services.db import db_connection


PROJECT_SELECT = """
    SELECT
        p.id,
        p.title AS name,
        COALESCE(ps.code, 'draft') AS status,
        CASE WHEN l.code = 'uk' THEN 'UA' ELSE upper(l.code) END AS language,
        COALESCE(scene_stats.scenes, 0) AS scenes,
        p.created_at::date::text AS created,
        p.updated_at::date::text AS updated,
        COALESCE(p.description, '') AS description
    FROM project p
    JOIN project_status ps ON ps.id = p.status_id
    JOIN language l ON l.id = p.primary_language_id
    LEFT JOIN (
        SELECT project_id, COUNT(*) AS scenes
        FROM project_scene
        GROUP BY project_id
    ) scene_stats ON scene_stats.project_id = p.id
"""


def _language_code(value: str) -> str:
    normalized = str(value or "EN").strip().lower()
    if normalized in {"ua", "uk", "ukrainian", "українська"}:
        return "uk"
    return "en"


def _scene_count(value: object) -> int:
    try:
        count = int(value)
    except (TypeError, ValueError):
        count = 1
    return max(1, min(count, 100))


def list_projects(user_id: str) -> list[dict]:
    with db_connection() as connection:
        rows = connection.execute(
            PROJECT_SELECT
            + """
            WHERE p.owner_id = %s
            ORDER BY p.updated_at DESC, p.created_at DESC
            """,
            (user_id,),
        ).fetchall()
    return [dict(row) | {"id": str(row["id"])} for row in rows]


def create_project(user_id: str, payload: dict) -> dict:
    name = str(payload.get("name") or "New project").strip() or "New project"
    description = str(payload.get("description") or "").strip() or None
    language = _language_code(payload.get("language", "EN"))
    scenes = _scene_count(payload.get("scenes", 1))

    with db_connection() as connection:
        project = connection.execute(
            """
            INSERT INTO project (owner_id, status_id, primary_language_id, title, description)
            VALUES (
                %s,
                (SELECT id FROM project_status WHERE code = 'draft'),
                (SELECT id FROM language WHERE code = %s),
                %s,
                %s
            )
            RETURNING id
            """,
            (user_id, language, name, description),
        ).fetchone()
        for scene_number in range(1, scenes + 1):
            connection.execute(
                "INSERT INTO project_scene (project_id, scene_number) VALUES (%s, %s)",
                (project["id"], scene_number),
            )
        connection.commit()
    return get_project(user_id, str(project["id"]))


def get_project(user_id: str, project_id: str) -> dict:
    with db_connection() as connection:
        row = connection.execute(
            PROJECT_SELECT + " WHERE p.owner_id = %s AND p.id = %s",
            (user_id, project_id),
        ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Project not found.")
    return dict(row) | {"id": str(row["id"])}


def update_project(user_id: str, project_id: str, payload: dict) -> dict:
    name = str(payload.get("name") or "").strip()
    description = str(payload.get("description") or "").strip()
    language = _language_code(payload.get("language", "EN"))
    status = str(payload.get("status") or "draft").strip().lower()
    scenes = _scene_count(payload.get("scenes", 1))

    with db_connection() as connection:
        existing = connection.execute("SELECT id FROM project WHERE owner_id = %s AND id = %s", (user_id, project_id)).fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Project not found.")
        connection.execute(
            """
            UPDATE project
            SET
                title = COALESCE(NULLIF(%s, ''), title),
                description = %s,
                primary_language_id = (SELECT id FROM language WHERE code = %s),
                status_id = COALESCE((SELECT id FROM project_status WHERE code = %s), status_id),
                updated_at = now()
            WHERE owner_id = %s AND id = %s
            """,
            (name, description or None, language, status, user_id, project_id),
        )
        current_scenes = connection.execute("SELECT COUNT(*) AS count FROM project_scene WHERE project_id = %s", (project_id,)).fetchone()["count"]
        if scenes > current_scenes:
            for scene_number in range(current_scenes + 1, scenes + 1):
                connection.execute("INSERT INTO project_scene (project_id, scene_number) VALUES (%s, %s)", (project_id, scene_number))
        elif scenes < current_scenes:
            connection.execute(
                "DELETE FROM project_scene WHERE project_id = %s AND scene_number > %s",
                (project_id, scenes),
            )
        connection.commit()
    return get_project(user_id, project_id)


def delete_project(user_id: str, project_id: str) -> dict:
    with db_connection() as connection:
        result = connection.execute("DELETE FROM project WHERE owner_id = %s AND id = %s", (user_id, project_id))
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Project not found.")
        connection.commit()
    return {"ok": True}
