# VidVoice FastAPI Rewrite

This folder contains a separate rewrite of the current React project using:

- `HTML`
- `CSS`
- `JavaScript`
- `Python`
- `FastAPI`

The original React project stays untouched in the project root.

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

5. Start server:

```powershell
cd backend
uvicorn app.main:app --reload
```

6. Open:

```text
http://localhost:8000
```

