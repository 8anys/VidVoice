from __future__ import annotations

from datetime import datetime
from itertools import count


profile_store = {
    "full_name": "Local Developer",
    "email": "local@vidvoice.dev",
    "created_date": "2026-04-20T00:00:00.000Z",
    "role": "admin",
    "language": "en",
    "theme": "dark",
    "voice": "rachel",
    "quality": "high",
    "export_format": "mp4",
    "auto_save": True,
    "auto_translate": False,
}

projects_store = [
    {"id": 1, "name": "Product Launch Video", "status": "completed", "language": "EN", "scenes": 5, "created": "2026-03-10", "updated": "2026-04-15"},
    {"id": 2, "name": "Brand Story UA", "status": "in_progress", "language": "UA", "scenes": 8, "created": "2026-04-01", "updated": "2026-04-18"},
    {"id": 3, "name": "Tutorial Series #1", "status": "draft", "language": "EN", "scenes": 3, "created": "2026-04-10", "updated": "2026-04-10"},
    {"id": 4, "name": "Promo Reel", "status": "completed", "language": "UA", "scenes": 6, "created": "2026-02-20", "updated": "2026-03-05"},
]

credits_store = {
    "total": 100000,
    "used": 24500,
    "history": [
        {"month": "Jan", "chars": 2100},
        {"month": "Feb", "chars": 3800},
        {"month": "Mar", "chars": 5200},
        {"month": "Apr", "chars": 13400},
    ],
}

uploaded_images = []
project_counter = count(5)


def add_project(name: str, language: str = "EN", scenes: int = 1) -> dict:
    now = datetime.now().strftime("%Y-%m-%d")
    project = {
        "id": next(project_counter),
        "name": name,
        "status": "draft",
        "language": language,
        "scenes": scenes,
        "created": now,
        "updated": now,
    }
    projects_store.insert(0, project)
    return project

