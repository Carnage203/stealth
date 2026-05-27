from typing import Union


def soap_to_plain_text(notes: Union[dict, str]) -> str:
    """
    Converts a SOAP notes object (LLMSoapSchema dict) into a flat plain-text
    string suitable for the RAG pipeline.

    Handles both:
      - dict  → structured SOAP object from MongoDB
      - str   → already plain text (pass-through)
    """
    if isinstance(notes, str):
        return notes.strip()

    lines: list[str] = []

    subjective = notes.get("subjective", "")
    if subjective:
        lines.append(f"Subjective:\n{subjective}")

    vitals = notes.get("vitals")
    if vitals and isinstance(vitals, dict):
        v_parts = [
            f"BP: {vitals.get('bp', 'Not recorded')}",
            f"Pulse: {vitals.get('pulse', 'Not recorded')}",
            f"Temp: {vitals.get('temp', 'Not recorded')}",
            f"Resp: {vitals.get('resp', 'Not recorded')}",
        ]
        lines.append("Vitals:\n" + ", ".join(v_parts))

    objective = notes.get("objective", "")
    if objective:
        lines.append(f"Objective:\n{objective}")

    assessment = notes.get("assessment", [])
    if assessment:
        lines.append("Assessment:\n" + "\n".join(f"- {a}" for a in assessment))

    plan = notes.get("plan", [])
    if plan:
        lines.append("Plan:\n" + "\n".join(f"- {p}" for p in plan))

    return "\n\n".join(lines)