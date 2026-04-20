from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.api.routes import router
from app.core.config import FRONTEND_DIR, UPLOADS_DIR


app = FastAPI(title="VidVoice FastAPI Rewrite")
app.include_router(router)

app.mount("/assets", StaticFiles(directory=FRONTEND_DIR / "assets"), name="assets")
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")


def serve_page(filename: str):
    return FileResponse(FRONTEND_DIR / filename)


@app.get("/", include_in_schema=False)
def home():
    return serve_page("index.html")


@app.get("/projects", include_in_schema=False)
def projects():
    return serve_page("projects.html")


@app.get("/profile", include_in_schema=False)
def profile():
    return serve_page("profile.html")


@app.get("/settings", include_in_schema=False)
def settings():
    return serve_page("settings.html")


@app.get("/credits", include_in_schema=False)
def credits():
    return serve_page("credits.html")

