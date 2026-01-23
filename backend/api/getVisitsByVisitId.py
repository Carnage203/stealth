from fastapi import APIRouter, HTTPException
from db.mongo_client import visits_collection
from bson import ObjectId
from bson.errors import InvalidId
from schemas.schema import VisitResponse

router = APIRouter(prefix="/visits", tags=["Visits"])

@router.get("/{visit_id}", response_model=VisitResponse)
def get_visit(visit_id: str):
    try:
        visit = visits_collection.find_one({"_id": ObjectId(visit_id)})
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid visit id")

    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")

    visit["id"] = str(visit.pop("_id"))

    return visit


