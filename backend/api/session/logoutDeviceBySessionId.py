from fastapi import APIRouter
from db.mongo_client import sessions_collection
from bson import ObjectId

router = APIRouter()

@router.delete("/{session_id}")
async def logout_device(session_id: str):
    result = sessions_collection.update_one(
        {"_id": ObjectId(session_id)},
        {"$set": {"revoked": True}}
    )
    
    if result.modified_count == 0:
        return {"status": "error", "message": "Session not found"}
    
    return {"status": "success", "message": "logged out"}