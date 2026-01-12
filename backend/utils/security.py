import secrets
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def generate_activation_token():
    return secrets.token_urlsafe(32)

def token_expiry():
    return datetime.now(timezone.utc) + timedelta(hours=24)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password)

if __name__ == "__main__":
    # Example usage
    print("Hashed Password:", hash_password("stealth@123"))
    stored_hash = hash_password("stealth@123")
    print(verify_password("stealth@123", stored_hash))  
    print(verify_password("wrongpass", stored_hash))  
