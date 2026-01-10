from pydantic import BaseModel

class Doctor(BaseModel):
    id: int
    name: str
    specialty: str
    years_of_experience: int
    organisation: str
    phone: str
    email: str
    password_hash: str
    is_active: bool
    created_at: str