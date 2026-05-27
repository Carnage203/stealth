import os
from sentence_transformers import SentenceTransformer
from db.mongo_client import get_rag_collection


_model = None

def _get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    return _model


def _get_query_embedding(text: str) -> list[float]:
    """Generate 384-dim embedding using MiniLM — matches stored vectors."""
    model = _get_model()
    embedding = model.encode(text, convert_to_numpy=True, normalize_embeddings=True)
    return embedding.tolist()


def retrieve_candidates(symptoms: list[str], top_k: int = 5) -> list[dict]:
    """
    Retrieval layer: For each atomic symptom from the decomposer,
    run vector search and return a deduplicated pool.

    - top_k=5 per symptom keeps context tight for the judge
    - dedup via seen_codes set prevents same code appearing twice
    - symptoms must already be atomic (decomposer's responsibility)

    Each candidate: { code, description, category, score }
    """
    col = get_rag_collection("icd10_codes")

    seen_codes = set()
    candidates = []

    for symptom in symptoms:
        query_vector = _get_query_embedding(symptom)

        results = col.aggregate([
            {
                "$vectorSearch": {
                    "index":         "vector_index",
                    "path":          "embedding",
                    "queryVector":   query_vector,
                    "numCandidates": top_k * 10,  
                    "limit":         top_k
                }
            },
            {
                "$project": {
                    "_id":         0,
                    "code":        1,
                    "description": 1,
                    "category":    1,
                    "score": { "$meta": "vectorSearchScore" }
                }
            }
        ])

        for doc in results:
            if doc["code"] not in seen_codes:
                seen_codes.add(doc["code"])
                candidates.append(doc)

    return candidates