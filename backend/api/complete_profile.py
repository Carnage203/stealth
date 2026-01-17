from fastapi import APIRouter, HTTPException, status
from schemas.schema import CompleteProfileRequest
from db.mongo_client import doctors_collection
from db.users import delete_activation_token
from utils.security import hash_password
import logging

router = APIRouter(prefix="/auth", tags=["Auth"])
logger = logging.getLogger(__name__)

@router.post(
    "/complete-profile",
    status_code=status.HTTP_200_OK,
    summary="Store user profile information",
)
def complete_profile(payload: CompleteProfileRequest):
    
    existing_doctor = doctors_collection.find_one({"email": payload.doctor.email})
    if not existing_doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found. Verify email first."
        )

    update_data = {
        "fullName": payload.doctor.fullName,
        "speciality": payload.doctor.speciality,
        "practiceType": payload.doctor.practiceType,
        "yearsOfExperience": payload.doctor.yearsOfExperience,
        "organizationName": payload.doctor.organizationName,
        "phoneNumber": payload.doctor.phoneNumber,
        "password_hash": hash_password(payload.doctor.password),
        "profile_completed": True
    }
    
    # Update the doctor profile
    result = doctors_collection.update_one(
        {"email": payload.doctor.email},
        {"$set": update_data}
    )

    if result.modified_count > 0:
        delete_activation_token(payload.token)
        logger.info(f"Profile completed and activation token deleted for {payload.doctor.email}")
    else:
        logger.warning(f"No document modified for {payload.doctor.email}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update profile"
        )


    return {"message": "Profile completed successfully"}