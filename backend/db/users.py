from typing import Optional
from utils.security import generate_activation_token, token_expiry
from db.mongo_client import tokens_collection, doctors_collection
from datetime import datetime, timezone

def get_token_by_email(email: str) -> Optional[dict]:
    token_doc = tokens_collection.find_one(
        {"email": email},
        sort=[("created_at", -1)]
    )
    if not token_doc:
        return None
    return {
        "email": token_doc["email"],
        "token": token_doc["token"],
        "expires_at": token_doc["expires_at"],
        "created_at": token_doc["created_at"],
    }

def create_user_activation_token(name:str, email: str):
    token = generate_activation_token()
    expiry = token_expiry()

    token_doc = {
        "name" : name,
        "email": email,
        "token": token,
        "expires_at": expiry,
        "created_at": datetime.now(timezone.utc)
    }
    tokens_collection.insert_one(token_doc)

    return token

def get_activation_token(token: str) -> Optional[dict]:

    obj = tokens_collection.find_one({"token": token})
    if not obj:
        return None
    return {
        "name" : obj["name"],
        "email": obj["email"],
        "token": obj["token"],
        "expires_at": obj["expires_at"],
        "created_at": obj.get("created_at"),
    }

def activate_user_by_email(email: str):
    """
    Create and activate doctor account if it does not already exist.
    """

    doctors_collection.update_one(
        {"email": email},
        {
            "$setOnInsert": {
                "email": email,
                "is_active": True,
                "profile_completed": False,
                "created_at": datetime.now(timezone.utc),
            }
        },
        upsert=True,
    )

def delete_activation_token(token: str):
    tokens_collection.delete_one({"token": token})