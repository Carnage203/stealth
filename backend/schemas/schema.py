from datetime import datetime
from pydantic import BaseModel, Field
from typing import Dict, Literal, Optional, List
from enum import Enum

class PatientStatus(str, Enum):
    review = "review"
    billing = "billing"
    completed = "completed"

class Patient(BaseModel):
    patientId: str = Field(..., description="Unique patient identifier")
    doctorEmail: str = Field(..., description="Doctor's email")
    name: str
    age: int
    gender: str
    phone: Optional[str] = None
    history: List[str] = Field(default_factory=list, description="List of visit IDs")
    status: PatientStatus = Field(..., description="Patient status")
    created_at: datetime

    class Config:
        orm_mode = True

class Doctor(BaseModel):
    fullName: str = Field(..., min_length=2)
    email: str
    speciality: str
    practiceType: str
    yearsOfExperience: int = Field(..., ge=0, le=60)
    organizationName: str
    phoneNumber: str = Field(..., min_length=10, max_length=15)
    password: str = Field(..., min_length=8)

class ConsultationRequest(BaseModel):
    patientId: Optional[str] = None  
    name: str = Field(..., min_length=2)
    age: int = Field(..., ge=0, le=120)
    gender: Literal["Male", "Female", "Other"]
    phone: str = Field(..., min_length=10, max_length=15)
    audioUrl: str
    doctorEmail: str = Field(..., min_length=2)

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

class SoapVitals(BaseModel):
    bp: str = Field(default="Not recorded", description="Blood pressure (e.g. '120/80')")
    pulse: str = Field(default="Not recorded", description="Heart rate (e.g. '72 bpm')")
    temp: str = Field(default="Not recorded", description="Temperature (e.g. '98.4 F')")
    resp: str = Field(default="Not recorded", description="Respiratory rate (e.g. '16')")

class LLMSoapSchema(BaseModel):
    subjective: str = Field(..., description="Narrative summary of patient complaints and history")
    vitals: SoapVitals
    objective: str = Field(..., description="Physical exam findings excluding vitals")
    assessment: List[str] = Field(..., description="Diagnoses with ICD-10 codes and status")
    plan: List[str] = Field(..., description="Treatment plan including medications, referrals, follow-up")

class TranscriptionSegment(BaseModel):
    start: float = Field(..., description="Segment start time in seconds")
    end: float = Field(..., description="Segment end time in seconds")
    sentence: str = Field(..., description="Transcribed sentence text")
    speaker: List[str] = Field(default_factory=list, description="List of speaker IDs in this segment")

class VisitUpdate(BaseModel):
    transcript: Dict[str, str]

class VisitNotesUpdate(BaseModel):
    subjective: Optional[str] = None
    vitals: Optional[SoapVitals] = None
    objective: Optional[str] = None
    assessment: Optional[List[str]] = None
    plan: Optional[List[str]] = None

class VisitListItem(BaseModel):
    id: str
    date: datetime

class VisitResponse(BaseModel):
    id: str
    patientId: str
    date: datetime
    notes: LLMSoapSchema
    transcription: List[TranscriptionSegment]

class PatientWithVisitsResponse(BaseModel):
    patient: PatientResponse
    visits: list[VisitListItem]

class PatientListItem(BaseModel):
    id: str
    name: str
    age: int
    gender: str
    phone: Optional[str] = None
    visits: int
    lastVisit: Optional[datetime] = None
    status: PatientStatus

    class Config:
        orm_mode = True

class MatchConfidence(str, Enum):
    high   = "high"
    medium = "medium"
    low    = "low"
 
class ICDSuggestion(BaseModel):
    icd_code:         str = Field(..., description="ICD-10 code (e.g. 'J44.1')")
    disease_name:     str = Field(..., description="Full description of the diagnosis")
    reason:           str = Field(..., description="Clinical justification from the SOAP note")
    match_confidence: MatchConfidence = Field(..., description="Confidence level: high | medium | low")
 
class ICD10Response(BaseModel):
    visit_id:        str                = Field(...)
    icd_suggestions: List[ICDSuggestion] = Field(...)