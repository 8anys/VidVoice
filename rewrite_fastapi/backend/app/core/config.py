from pathlib import Path
import os


BACKEND_DIR = Path(__file__).resolve().parents[2]
REWRITE_DIR = BACKEND_DIR.parent
FRONTEND_DIR = REWRITE_DIR / "frontend"
STORAGE_DIR = BACKEND_DIR / "storage"
UPLOADS_DIR = BACKEND_DIR / "storage" / "uploads"
AUDIO_DIR = BACKEND_DIR / "storage" / "audio"
VIDEO_DIR = BACKEND_DIR / "storage" / "videos"
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "").strip()
ELEVENLABS_BASE_URL = "https://api.elevenlabs.io"

UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
AUDIO_DIR.mkdir(parents=True, exist_ok=True)
VIDEO_DIR.mkdir(parents=True, exist_ok=True)

