from pydantic import BaseModel, EmailStr

class SignupRequest(BaseModel):
    email: EmailStr
