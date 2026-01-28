import os
from google import genai

_client = None

def get_gemini_client():
    global _client
    if _client is None:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY not set")
        _client = genai.Client(api_key=api_key)

    # MUST return the client, not client.models.get(...)
    return _client