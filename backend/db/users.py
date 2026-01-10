from utils.security import generate_activation_token, token_expiry
from db.mongo_client import tokens_collection
from datetime import datetime, timezone

def get_user_by_email(email: str):
    pass

def create_user_activation_token(email: str):
    token = generate_activation_token()
    expiry = token_expiry()

    token_doc = {
        "email": email,
        "token": token,
        "expires_at": expiry,
        "created_at": datetime.now(timezone.utc)
    }
    tokens_collection.insert_one(token_doc)

    return token

def get_activation_token(token: str):
    try:
        obj = tokens_collection.find_one({"token": token})
        email, token = obj["email"], obj["token"]
    except Exception as e:
        raise RuntimeError(f"Error retrieving token: {e}")
    return {"email": email, "token": token}

def activate_user_by_email(email: str):
    pass

def delete_activation_token(token: str):
    pass