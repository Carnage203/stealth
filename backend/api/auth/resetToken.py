from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from db.mongo_client import doctors_collection
from utils.email_helper import send_reset_password_email
from utils.jwt_helper import create_reset_token, verify_reset_token
from datetime import datetime, timedelta, timezone

router = APIRouter()

class ResetTokenRequest(BaseModel):
    email: EmailStr

@router.post("/forgot-password")
def request_reset_token(body: ResetTokenRequest):
    user = doctors_collection.find_one({"email": body.email})

    # Always return success to prevent email enumeration
    if not user:
        return {"status": "success", "message": "If this email exists, a reset link has been sent."}

    token = create_reset_token(str(user["_id"]))

    # Store token + expiry in DB
    expiry = datetime.now(timezone.utc) + timedelta(hours=1)
    doctors_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {
            "reset_token": token,
            "reset_token_expiry": expiry
        }}
    )

    send_reset_password_email(
        name=user.get("fullName", "Doctor"),
        email=body.email,
        token=token
    )

    return {"status": "success", "message": "If this email exists, a reset link has been sent."}



@router.get("/validate-reset-token")
def validate_reset_token(token: str):
    user = doctors_collection.find_one({"reset_token": token})

    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    if not verify_reset_token(token):
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    
    return {"status": "success", "message": "Token is valid"}