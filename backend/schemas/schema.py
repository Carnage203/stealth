from datetime import datetime
from pydantic import BaseModel, Field
from typing import Dict, Literal, Optional

class Doctor(BaseModel):
    fullName: str = Field(..., min_length=2)
    email: str
    speciality: str
    practiceType: str
    yearsOfExperience: int = Field(..., ge=0, le=60)
    organizationName: str
    phoneNumber: str = Field(..., min_length=10, max_length=15)
    password: str = Field(..., min_length=8)

class Patient(BaseModel):
    patientId: Optional[str] = None  
    name: str = Field(..., min_length=2)
    age: int = Field(..., ge=0, le=120)
    gender: Literal["Male", "Female", "Other"]
    phone: str = Field(..., min_length=10, max_length=15)
    transcript: dict[str, str]

class PatientResponse(BaseModel):
    id: Optional[str] 
    name: str
    age: int
    gender: str
    phone: str

    class Config:
        populate_by_name = True
        from_attributes = True
    
class CompleteProfileRequest(BaseModel):
    doctor: Doctor
    token : str

class VisitUpdate(BaseModel):
    transcript: Dict[str, str]

class VisitResponse(BaseModel):
    id: str
    patientId: str
    transcript: Dict[str, str]
    date: datetime
