from fastapi import APIRouter, HTTPException, status, Request
from utils.jwt_helper import get_current_user
from db.mongo_client import doctors_collection

router = APIRouter()


@router.get(
    "/profile",
    status_code=status.HTTP_200_OK,
    summary="Get current doctor's full profile",
)
def get_doctor_profile(request: Request):
    email = get_current_user(request)

    doctor = doctors_collection.find_one({"email": email})
    if not doctor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found")

    created_at = doctor.get("created_at")

    return {
        "id": str(doctor["_id"]),
        "email": doctor["email"],
        "fullName": doctor.get("fullName", ""),
        "speciality": doctor.get("speciality", ""),
        "practiceType": doctor.get("practiceType", ""),
        "yearsOfExperience": doctor.get("yearsOfExperience", 0),
        "organizationName": doctor.get("organizationName", ""),
        "phoneNumber": doctor.get("phoneNumber", ""),
        "createdAt": created_at.isoformat() if created_at else None,
        "isActive": doctor.get("is_active", False),
    }
