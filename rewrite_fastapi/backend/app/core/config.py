from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[2]
REWRITE_DIR = BACKEND_DIR.parent
FRONTEND_DIR = REWRITE_DIR / "frontend"
UPLOADS_DIR = BACKEND_DIR / "storage" / "uploads"

UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

