from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from dotenv import load_dotenv
from fastapi import Request, HTTPException
import os   

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = os.getenv("ALGORITHM")

ACCESS_EXPIRE_MINUTES = 15
REFRESH_EXPIRE_DAYS = 7


def _create_token(subject: str, expires_delta: timedelta, token_type: str):
    now = datetime.now(timezone.utc)
    payload = {
        "sub": subject,
        "type": token_type,
        "iat": now,
        "exp": now + expires_delta,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def create_access_token(email: str):
    return _create_token(
        email,
        timedelta(minutes=ACCESS_EXPIRE_MINUTES),
        "access",
    )


def create_refresh_token(email: str):
    return _create_token(
        email,
        timedelta(days=REFRESH_EXPIRE_DAYS),
        "refresh",
    )

def verify_csrf(request: Request):
    csrf_cookie = request.cookies.get("csrf_token")
    csrf_header = request.headers.get("X-CSRF-Token")
    print(f"CSRF Cookie: {csrf_cookie}, CSRF Header: {csrf_header}")

    
    if not csrf_cookie or csrf_cookie != csrf_header:
        raise HTTPException(status_code=403, detail="CSRF validation failed")

def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401)

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401)
        return payload["sub"]  
    except JWTError:
        raise HTTPException(status_code=401)


def create_reset_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "type": "password_reset",
        "exp": datetime.now(timezone.utc) + timedelta(hours=1),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, os.getenv("JWT_SECRET"), algorithm="HS256")

def verify_reset_token(token: str) -> str:
    """Returns user_id if valid, raises HTTPException otherwise."""
    try:
        payload = jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
        if payload.get("type") != "password_reset":
            raise HTTPException(status_code=400, detail="Invalid token type")
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Reset link has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Invalid reset token")