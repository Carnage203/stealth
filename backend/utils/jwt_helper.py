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


