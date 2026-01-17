from fastapi import APIRouter, HTTPException, status
from schemas.auth import SignupRequest
from utils.email_helper import send_activation_email
from db.users import get_token_by_email, create_user_activation_token
from datetime import datetime, timezone
import logging

router = APIRouter(prefix="/auth", tags=["Auth"])

logger = logging.getLogger(__name__)

@router.post(
    "/signup",
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user and send activation email",
)
def signup(request: SignupRequest):
    token_doc = get_token_by_email(request.email)
    if token_doc:
        expires_at = token_doc["expires_at"]
        if expires_at.tzinfo is None:
                expires_at = expires_at.replace(tzinfo=timezone.utc)
        if expires_at > datetime.now(timezone.utc):
            return {
                "message": "An activation email has already been sent. Please check your inbox.",
            }
    activation_token = create_user_activation_token(request.name, request.email)
    try:
        send_activation_email(request.name, request.email, activation_token)
    except Exception as e:
        logger.exception("Failed to send activation email")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to send activation email",
        )
    return {
        "message": "Activation email sent successfully",
    }

