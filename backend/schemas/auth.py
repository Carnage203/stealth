from pydantic import BaseModel, EmailStr

class SignupRequest(BaseModel):
    email: EmailStr

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
