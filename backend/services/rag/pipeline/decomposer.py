import json
from llm.gemini_client import get_gemini_client
from llm.prompts import DECOMPOSE_PROMPT


def extract_symptoms(soap_note: str) -> list[str]:
    """
    Layer 1: Decomposes the full SOAP note into atomic,
    ICD-10-style clinical concepts for vector retrieval.
    """
    client = get_gemini_client()

    prompt = DECOMPOSE_PROMPT.format(soap_note=soap_note)

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    raw = response.text.strip()

    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    symptoms = json.loads(raw)

    if not isinstance(symptoms, list):
        raise ValueError(f"Decomposer expected a list, got: {type(symptoms)}")

    seen   = set()
    unique = []
    for s in symptoms:
        s = s.strip()
        if s and s.lower() not in seen:
            seen.add(s.lower())
            unique.append(s)

    return unique