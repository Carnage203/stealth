from fastapi import APIRouter
from db.mongo_client import sessions_collection
from bson import ObjectId

router = APIRouter()

@router.delete("/logout/all-devices",
            summary="Logout from all devices",
            description="Revokes all active sessions for the authenticated user.")
async def logout_all(user_id: str):
    result = sessions_collection.update_many(
        {"user_id": ObjectId(user_id)},
        {"$set": {"revoked": True}}
    )
    
    if result.modified_count == 0:
        return {"status": "error", "message": "No sessions found for user"}
    
    return {"status": "success", "message": f"Logged out {result.modified_count} device(s)"}