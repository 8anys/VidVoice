from __future__ import annotations

import json
import urllib.error
import urllib.parse
import urllib.request

from fastapi import HTTPException


TRANSLATE_URL = "https://translate.googleapis.com/translate_a/single"


def translate_text(text: str, direction: str) -> dict:
    clean_text = text.strip()
    if not clean_text:
        return {"text": ""}

    target_language = "uk" if direction == "toUA" else "en"
    query = urllib.parse.urlencode(
        {
            "client": "gtx",
            "sl": "auto",
            "tl": target_language,
            "dt": "t",
            "q": clean_text,
        }
    )
    request = urllib.request.Request(
        f"{TRANSLATE_URL}?{query}",
        headers={"User-Agent": "Mozilla/5.0"},
    )

    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            data = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="ignore") or str(error)
        raise HTTPException(status_code=error.code, detail=detail) from error
    except urllib.error.URLError as error:
        raise HTTPException(status_code=502, detail=f"Translation request failed: {error.reason}") from error

    translated = "".join(part[0] for part in data[0] if part and part[0])
    return {"text": translated}
