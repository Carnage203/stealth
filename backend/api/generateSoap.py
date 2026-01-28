from fastapi import APIRouter, HTTPException
from llm.soap_generator import generate_soap_note

router = APIRouter(
    prefix="/generate_soap",   
    tags=["llm"]
)

@router.post("")
def generate_soap(payload: dict):
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
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"SOAP generation failed: {str(e)}"
        )
