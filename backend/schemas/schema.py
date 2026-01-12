from pydantic import BaseModel, Field

class Doctor(BaseModel):
    name: str = Field(..., min_length=2)
    specialty: str
    years_of_experience: int = Field(..., ge=0, le=60)
    organisation: str
    phone: str = Field(..., min_length=10, max_length=15)
    password: str = Field(..., min_length=8)
