import time
import cloudinary
import cloudinary.utils
from fastapi import APIRouter


router = APIRouter()

@router.get(
    "/signature",
    summary="Provide signed params to upload audio"
)
def generate_signature():
    timestamp = int(time.time())

    params = {
        "timestamp": timestamp,
        "upload_preset": "audio_signed_preset"
    }

    signature = cloudinary.utils.api_sign_request(
        params,
        cloudinary.config().api_secret
    )

    return {
        "timestamp": timestamp,
        "signature": signature,
        "api_key": cloudinary.config().api_key,
        "cloud_name": cloudinary.config().cloud_name
    }
