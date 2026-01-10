from fastapi import APIRouter
from schemas.auth import SignupRequest
from utils.email_helper import send_activation_email
from db.users import get_user_by_email, create_user_activation_token

router = APIRouter()

@router.post("/api/auth/signup")
def signup(request: SignupRequest):
    existing_user = get_user_by_email(request.email)
    if existing_user:
        return {"error": "Email already registered"}

    activation_token = create_user_activation_token(request.email)
    send_activation_email(request.email, activation_token)

    return {"message": "Activation email sent"}
