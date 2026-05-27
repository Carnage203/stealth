import json
from llm.gemini_client import get_gemini_client
from llm.prompts import JUDGE_PROMPT

def judge_candidates(soap_note: str, candidates: list[dict]) -> list[dict]:
    """
    Layer 2: LLM-as-a-Judge filters the retrieved candidate pool
    down to only clinically justified codes.
    """
    client = get_gemini_client()


    prompt = JUDGE_PROMPT.format(
        soap_note=soap_note,          
        candidates=json.dumps(candidates, indent=2)
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

    filtered = json.loads(raw)

    if not isinstance(filtered, list):
        raise ValueError(f"Judge expected a list, got: {type(filtered)}")

    return filtered