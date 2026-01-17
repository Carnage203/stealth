from fastapi import APIRouter, HTTPException, status
from db.users import get_activation_token, activate_user_by_email, delete_activation_token
from datetime import datetime, timezone
import logging

router = APIRouter(prefix="/auth", tags=["Auth"])
logger = logging.getLogger(__name__)


@router.post(
    "/activate",
    status_code=status.HTTP_200_OK,
    summary="Activate user account using email token",
)
def activate_account(token: str):
    token_doc = get_activation_token(token)

    if not token_doc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired activation token",
        )

    expires_at = token_doc.get("expires_at")

    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired activation token",
        )

    email = token_doc["email"]
    name  = token_doc["name"]

    try:
        activate_user_by_email(email)
        # delete_activation_token(token)


    except Exception:
        logger.exception("Account activation failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to activate account",
        )

    return {
        "name" : name,
        "email" : email,
        "message": "Account activated successfully."
    }
