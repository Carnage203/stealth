from fastapi import APIRouter, HTTPException
from db.mongo_client import visits_collection
from bson import ObjectId
from bson.errors import InvalidId
from schemas.schema import VisitNotesUpdate, VisitResponse

router = APIRouter()

@router.get("/{visit_id}", response_model=VisitResponse)
def get_visit(visit_id: str):
    try:
        visit = visits_collection.find_one({"_id": ObjectId(visit_id)})
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid visit id")

    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")

    visit["id"] = str(visit.pop("_id"))

    return {
        "id": visit["id"],
        "patientId": visit.get("patientId"),
        "date": visit.get("date"),
        "notes": visit.get("notes", []),
        "transcription": visit.get("transcription", [])
    }

@router.put("/{visit_id}", response_model=VisitResponse)
def update_visit_notes(visit_id: str, payload: VisitNotesUpdate):
    try:
        object_id = ObjectId(visit_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid visit id")

    if hasattr(payload, "model_dump"):
        changes = payload.model_dump(exclude_none=True)
    else:
        changes = payload.dict(exclude_none=True)

    if not changes:
        raise HTTPException(status_code=400, detail="No note changes provided")

    update_payload = {f"notes.{key}": value for key, value in changes.items()}
    result = visits_collection.update_one(
        {"_id": object_id},
        {"$set": update_payload},
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Visit not found")

    visit = visits_collection.find_one({"_id": object_id})
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")

    visit["id"] = str(visit.pop("_id"))

    return {
        "id": visit["id"],
        "patientId": visit.get("patientId"),
        "date": visit.get("date"),
        "notes": visit.get("notes", []),
        "transcription": visit.get("transcription", [])
    }
