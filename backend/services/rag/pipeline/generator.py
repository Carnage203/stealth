import json
from llm.gemini_client import get_gemini_client
from llm.prompts import ICD10_EXTRACTION_PROMPT


def generate_icd10_report(soap_note: str, filtered_candidates: list[dict]) -> list[dict]:
    """
    Layer 3: Final generation. Returns a structured list of ICD-10
    codes with disease name, reason, and match confidence.
    """
    client = get_gemini_client()

    context_lines = [
        f"Code: {c['code']} | Category: {c['category']} | Description: {c['description']}"
        for c in filtered_candidates
    ]
    context  = "\n".join(context_lines)

    prompt = ICD10_EXTRACTION_PROMPT.format(
        context=context,
        query=soap_note             
    )

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

    result = json.loads(raw)

    if not isinstance(result, list):
        raise ValueError(f"Generator expected a list, got: {type(result)}")

    return result