import secrets
from datetime import datetime, timedelta, timezone

def generate_activation_token():
    return secrets.token_urlsafe(32)

def token_expiry():
    return datetime.now(timezone.utc) + timedelta(hours=24)
