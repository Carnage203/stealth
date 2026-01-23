from fastapi import APIRouter, Depends
from utils.jwt_helper import verify_csrf, get_current_user
router = APIRouter()


@router.post("/update-profile", dependencies=[Depends(verify_csrf)])
def update_profile(
    user_email: str = Depends(get_current_user)
):
    return {"email": user_email}
