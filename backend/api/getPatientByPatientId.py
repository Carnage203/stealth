from fastapi import APIRouter, HTTPException
from db.mongo_client import patients_collection
from schemas.schema import PatientResponse


router = APIRouter(prefix="/patients", tags=["Patients_id"])

@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(patient_id: str):
    patient = patients_collection.find_one({"patient_id": patient_id})

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    patient["id"] = str(patient.pop("_id"))

    return patient


