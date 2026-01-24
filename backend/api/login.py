from fastapi import APIRouter, HTTPException, status, Response
from schemas.auth import LoginRequest
from db.mongo_client import doctors_collection
from utils.security import verify_password
from utils.jwt_helper import create_access_token, create_refresh_token,REFRESH_EXPIRE_DAYS
import secrets 
from dotenv import load_dotenv
import os

load_dotenv()

IS_PROD = os.getenv("ENVIRONMENT") == "production"

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post(
    "/login",
    status_code=status.HTTP_200_OK,
    summary="Login user and issue JWT cookie",
)
def login(payload: LoginRequest, response: Response):
    user = doctors_collection.find_one({"email": payload.email})

    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.get("is_active"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account not activated"
        )

    access_token = create_access_token(user["email"])
    refresh_token = create_refresh_token(user["email"])
    csrf_token = secrets.token_urlsafe(16)

    # Access token
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=IS_PROD,
        samesite="none",
        max_age=900,
        path="/"
    )

    # Refresh token
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=IS_PROD,
        samesite="none",
        max_age=REFRESH_EXPIRE_DAYS * 86400,
        path="/"
    )

    # CSRF token
    response.set_cookie(
        key="csrf_token",
        value=csrf_token,
        httponly=False,
        secure=IS_PROD,
        samesite="none",
        path="/"
    )

    return {
        "message": "Login successful",
            "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "name": user["fullName"]
        }        
    }