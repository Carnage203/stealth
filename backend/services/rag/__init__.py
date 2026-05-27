from .pipeline import (
    extract_symptoms,
    retrieve_candidates,
    judge_candidates,
    generate_icd10_report
)

def run_rag_pipeline(soap_note: str) -> list[dict]:
    symptoms   = extract_symptoms(soap_note)
    candidates = retrieve_candidates(symptoms, top_k=3)
    filtered   = judge_candidates(soap_note, candidates)
    result     = generate_icd10_report(soap_note, filtered)
    return result


__all__ = [
    "run_rag_pipeline",
    "extract_symptoms",
    "retrieve_candidates",
    "judge_candidates",
    "generate_icd10_report"
]