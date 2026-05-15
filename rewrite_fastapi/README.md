# VidVoice FastAPI Rewrite

This folder contains a separate rewrite of the current React project using:

- `HTML`
- `CSS`
- `JavaScript`
- `Python`
- `FastAPI`
- `PostgreSQL`

The original React project stays untouched in the project root.

Generated audio/video files are kept inside `backend/storage` by default. Ready-made audio files can also be uploaded directly in the Step 1-2 audio block and reused for video composition.

## Structure

```text
rewrite_fastapi/
  backend/
    app/
      api/
      core/
      services/
      main.py
    requirements.txt
  frontend/
    assets/
      css/
      js/
    index.html
    projects.html
    profile.html
    settings.html
    credits.html
  database/
    init/
      001_schema.sql
```

## Run

1. Open terminal in `rewrite_fastapi`
2. Create venv:

```powershell
python -m venv .venv
```

3. Activate:

```powershell
.venv\Scripts\activate
```

4. Install backend dependencies:

```powershell
pip install -r backend\requirements.txt
```

5. Make sure `ffmpeg` and `ffprobe` are available in your terminal for MP4 generation:

```powershell
ffmpeg -version
ffprobe -version
```

6. Add your ElevenLabs API key for voice generation:

```powershell
$env:ELEVENLABS_API_KEY="your_api_key_here"
```

7. Start server:

```powershell
cd backend
uvicorn app.main:app --reload
```

8. Open:

```text
http://localhost:8000
```

