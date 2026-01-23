from fastapi import APIRouter, HTTPException
from db.mongo_client import visits_collection
from bson import ObjectId
from bson.errors import InvalidId
from schemas.schema import VisitResponse, VisitUpdate

router = APIRouter(prefix="/visits", tags=["Visits"])


@router.put("/{visit_id}", response_model=VisitResponse)
def update_visit(visit_id: str, payload: VisitUpdate):
    try:
        updated_visit = visits_collection.find_one_and_update(
            {"_id": ObjectId(visit_id)},
            {"$set": {"transcript": payload.transcript}},
            return_document=True
        )
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid visit id")

    if not updated_visit:
        raise HTTPException(status_code=404, detail="Visit not found")

    updated_visit["id"] = str(updated_visit.pop("_id"))

    return updated_visit
