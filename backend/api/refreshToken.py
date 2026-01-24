from fastapi import APIRouter, HTTPException, status, Request, Response
from utils.jwt_helper import create_access_token, create_refresh_token, REFRESH_EXPIRE_DAYS
from db.mongo_client import doctors_collection
from jose import jwt, JWTError
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = os.getenv("ALGORITHM")
IS_PROD = os.getenv("ENVIRONMENT") == "production"


router = APIRouter(prefix="/auth", tags=["Auth"])

@router.get(
    "/refresh",
    status_code=status.HTTP_200_OK,
    summary="Refresh access and refresh tokens",
)
def refresh_token(request: Request, response: Response):
    token = request.cookies.get("refresh_token")

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token missing",
        )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type",
            )

        email = payload.get("sub")
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
            )

         # Fetch user from database
        user = doctors_collection.find_one({"email": email})

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )

        if not user.get("is_active"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account not activated"
            )


        access_token = create_access_token(email)
        refresh_token = create_refresh_token(email)

        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=IS_PROD,
            samesite="none",
            max_age=900,
            path="/"
        )

        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=IS_PROD,
            samesite="none",
            max_age=REFRESH_EXPIRE_DAYS * 86400,
            path="/"
        )

        return {
            
            "message": "Token refreshed successfully",
                "user": {
                "id": str(user["_id"]),
                "email": user["email"],
                "name": user["fullName"]
            }
        }

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )
