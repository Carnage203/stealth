from utils.security import generate_activation_token, token_expiry

def get_user_by_email(email: str):
    pass

def create_user_activation_token(email: str):
    token = generate_activation_token()
    expiry = token_expiry()

    # Insert token into DB
    return token

def get_activation_token(token: str):
    pass

def activate_user_by_email(email: str):
    pass

def delete_activation_token(token: str):
    pass