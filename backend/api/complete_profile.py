from fastapi import APIRouter, HTTPException, status
from schemas.schema import Doctor
from db.mongo_client import doctors_collection
from utils.security import hash_password
import logging

router = APIRouter(prefix="/auth", tags=["Auth"])
logger = logging.getLogger(__name__)

@router.post(
    "/complete-profile",
    status_code=status.HTTP_200_OK,
    summary="Store user profile information",
)
def complete_profile(payload: Doctor, email: str  ):
    
    existing_doctor = doctors_collection.find_one({"email": email})
    if not existing_doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found. Verify email first."
        )

    
    update_data = {
        "name": payload.name,
        "specialty": payload.specialty,
        "years_of_experience": payload.years_of_experience,
        "organisation": payload.organisation,
        "phone": payload.phone,
        "password_hash": hash_password(payload.password),
        "profile_completed": True
    }

    
    doctors_collection.update_one(
        {"email": email},
        {"$set": update_data}
    )

    return {"message": "Profile completed successfully"}