from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from bson.errors import InvalidId

from db.mongo_client import visits_collection
from services.rag import run_rag_pipeline
from utils.soap_to_text import soap_to_plain_text
from schemas.schema import ICD10Response, ICDSuggestion

router = APIRouter()


@router.post(
    "/{visit_id}/icd-extract",
    response_model=ICD10Response,
    summary="Extract ICD-10 codes from a visit's SOAP notes",
    tags=["Billing"],
)
def extract_icd_codes(visit_id: str):
    """
    POST /api/v1/billing/{visit_id}/icd-extract

    Flow:
      1. Resolve visit_id → MongoDB ObjectId
      2. Fetch visit document from visits_collection
      3. Extract visit["notes"] (LLMSoapSchema dict)
      4. Convert SOAP object → plain text
      5. Run RAG pipeline → ICD-10 suggestions
      6. Return validated ICD10Response to Billing Assistant
    """

  
    try:
        oid = ObjectId(visit_id)
    except (InvalidId, TypeError):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid visit_id format: '{visit_id}'",
        )

   
    visit = visits_collection.find_one({"_id": oid})
    if not visit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Visit '{visit_id}' not found",
        )

   
    notes = visit.get("notes")
    if not notes:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Visit exists but has no SOAP notes yet. "
                   "Run transcription/SOAP generation first.",
        )

    
    soap_plain = soap_to_plain_text(notes)

    if not soap_plain.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="SOAP notes resolved to empty text. Cannot run ICD extraction.",
        )

    
    try:
        raw_suggestions = run_rag_pipeline(soap_plain)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"RAG pipeline failed: {str(exc)}",
        )

    
    return ICD10Response(
        visit_id=visit_id,
        icd_suggestions=[ICDSuggestion(**s) for s in raw_suggestions],
    )