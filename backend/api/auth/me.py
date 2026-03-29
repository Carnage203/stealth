from fastapi import APIRouter, HTTPException, status, Request, Depends
from utils.jwt_helper import get_current_user
from db.mongo_client import doctors_collection
from bson import ObjectId

router = APIRouter()

@router.get(
    "/me",
    status_code=status.HTTP_200_OK,
    summary="Get current authenticated user",
)
def get_current_user_info(request: Request):
    """
    Returns the current authenticated user's information
    """
    # Get email from JWT token
    email = get_current_user(request)
    
    # Fetch user from database
    user = doctors_collection.find_one({"email": email})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    if not user.get("is_active"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account not activated"
        )
    
    return {
        "message": "User retrieved successfully",
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "name": user["fullName"],
            "is_active": user.get("is_active", False)
        }
    }