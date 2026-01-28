from fastapi import APIRouter, HTTPException
from backend.llm.soap_generator import generate_soap_note

router = APIRouter(
    prefix="/soap",
    tags=["LLM"]
)


@router.post("/generate")
def generate_soap(payload: dict):
    # Expecting: { "conversation": [...] }
    conversation = payload.get("conversation")

    if not conversation:
        raise HTTPException(
            status_code=400,
            detail="conversation field is required"
        )

    try:
        result = generate_soap_note(conversation)
        return result

    except HTTPException:
        # Let FastAPI handle known HTTP errors
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"SOAP generation failed: {str(e)}"
        )
