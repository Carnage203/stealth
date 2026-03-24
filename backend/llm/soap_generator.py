import json
from llm.gemini_client import get_gemini_client
from llm.prompts import SOAP_PROMPT
from schemas.schema import LLMSoapSchema
from google.genai import types

def generate_soap_note(conversation: list[dict]) -> dict:
    client = get_gemini_client()

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        config=types.GenerateContentConfig(
            system_instruction=SOAP_PROMPT,
            response_schema=LLMSoapSchema,
            response_mime_type="application/json",
        ),
        contents=[str(conversation)],
    )

    if not response.text:
        raise ValueError("Empty response from Gemini")

    return json.loads(response.text)