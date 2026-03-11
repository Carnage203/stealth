from fastapi import APIRouter
from db.mongo_client import sessions_collection
from bson import ObjectId

router = APIRouter()

@router.delete("/logout/single-device",
               summary="Logout from a specific device",
            description="Revokes the active session for the specified device.")
async def logout_device(session_id: str):
    result = sessions_collection.update_one(
        {"_id": ObjectId(session_id)},
        {"$set": {"revoked": True}}
    )
    
    if result.modified_count == 0:
        return {"status": "error", "message": "Session not found"}
    
    return {"status": "success", "message": "logged out"}