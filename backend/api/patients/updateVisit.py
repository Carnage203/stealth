from fastapi import APIRouter, HTTPException
from db.mongo_client import visits_collection
from bson import ObjectId
from bson.errors import InvalidId
from schemas.schema import SoapNotesUpdate

router = APIRouter()

@router.put("/{visit_id}")
def update_visit(visit_id: str, payload: SoapNotesUpdate):
    try:
        oid = ObjectId(visit_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid visit id")

    update_data = payload.dict(exclude_unset=True)

    if not update_data:
        raise HTTPException(status_code=400, detail="No data provided")

    # Build nested update for notes
    update_query = {
        f"notes.{key}": value
        for key, value in update_data.items()
    }

    result = visits_collection.update_one(
        {"_id": oid},
        {"$set": update_query}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Visit not found")

    return {"message": "Visit updated successfully"}