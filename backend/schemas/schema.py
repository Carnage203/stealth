from pydantic import BaseModel
from datetime import datetime

class Doctor(BaseModel):
    name: str
    specialty: str
    years_of_experience: int
    organisation: str
    phone: str
    email: str
    password_hash: str
    is_active: bool = False
    created_at: datetime = None