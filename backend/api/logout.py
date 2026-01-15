from fastapi import APIRouter, Response

router = APIRouter()

@router.post("/logout", tags=["Auth"], summary="Log out the user")
def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/auth/refresh")
    response.delete_cookie("csrf_token", path="/")
    return {"message": "Logged out"}
