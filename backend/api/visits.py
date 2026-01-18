from fastapi import APIRouter, HTTPException
from db.mongo_client import visits_collection
from bson import ObjectId
from bson.errors import InvalidId
from schemas.schema import VisitUpdate

router = APIRouter(prefix="/visits", tags=["Visits"])

@router.get("/{visit_id}")
def get_visit(visit_id: str):
    try:
        visit = visits_collection.find_one({"_id": ObjectId(visit_id)})
    except InvalidId:
        raise HTTPException(400, "Invalid visit id")

    if not visit:
        raise HTTPException(404, "Visit not found")

    visit["_id"] = str(visit["_id"])
    return visit

@router.put("/{visit_id}")
def update_visit(visit_id: str, payload: VisitUpdate):
    try:
        result = visits_collection.update_one(
            {"_id": ObjectId(visit_id)},
            {"$set": {"transcript": payload.transcript}}
        )
    except InvalidId:
        raise HTTPException(400, "Invalid visit id")

    if result.matched_count == 0:
        raise HTTPException(404, "Visit not found")

    return {"message": "Visit updated successfully"}
