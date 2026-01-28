import json
import re
from llm.gemini_client import get_gemini_client
from llm.prompts import SOAP_PROMPT
from google.genai import types

def extract_json(text: str) -> dict:
    
    text = text.strip()
    text = text.replace("```json", "").replace("```", "").strip()
    match = re.search(r"\{[\s\S]*\}", text)
    if not match:
        raise ValueError(f"Gemini did not return JSON:\n{text}")
    return json.loads(match.group())

def generate_soap_note(conversation: list[dict]) -> dict:
    client = get_gemini_client()

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        config=types.GenerateContentConfig(
                system_instruction=SOAP_PROMPT
            ),
            contents=[str[conversation]]
        )
        

    if not response.text:
        raise ValueError("Empty response from Gemini")

    return extract_json(response.text)