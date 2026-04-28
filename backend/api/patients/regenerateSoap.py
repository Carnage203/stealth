from fastapi import APIRouter, HTTPException, status, Depends
from db.mongo_client import visits_collection
from bson import ObjectId
from bson.errors import InvalidId
from llm.soap_generator import generate_soap_note
from utils.jwt_helper import verify_csrf, get_current_user
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/{visit_id}/regenerate-soap", status_code=status.HTTP_200_OK, dependencies=[Depends(verify_csrf)])
def regenerate_soap(visit_id: str, user_email: str = Depends(get_current_user)):
    try:
        oid = ObjectId(visit_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid visit id")

    visit = visits_collection.find_one({"_id": oid})
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")

    transcription = visit.get("transcription")
    if not transcription:
        raise HTTPException(status_code=400, detail="No transcription available to generate SOAP")

    try:
        notes = generate_soap_note(transcription)
        visits_collection.update_one({"_id": oid}, {"$set": {"notes": notes}})
        logger.info(f"SOAP regenerated for visit {visit_id} by {user_email}")
        return {"message": "SOAP regenerated successfully", "notes": notes}
    except Exception:
        logger.exception("Failed to regenerate SOAP")
        raise HTTPException(status_code=500, detail="Failed to regenerate SOAP")
