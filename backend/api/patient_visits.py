from fastapi import APIRouter, HTTPException
from db.mongo_client import patients_collection, visits_collection
from bson import ObjectId

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.get("/")
def get_all_patients():
    patients = []

    try:
        for p in patients_collection.find({}, {"_id": 0}):
            patients.append(p)

        return patients
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve patients: {str(e)}"
        )
    
@router.get("/{patient_id}")
def get_patient(patient_id: str):
    patient = patients_collection.find_one({"patient_id": patient_id}, {"_id": 0})
    if not patient:
        raise HTTPException(404, "Patient not found")
    return patient

@router.get("/{patient_id}/visits")
def get_patient_visits(patient_id: str):
    patient = patients_collection.find_one({"patient_id": patient_id})
    if not patient:
        raise HTTPException(404, "Patient not found")

    visits = list(
        visits_collection.find({"_id": {"$in": patient.get("history", [])}})
    )
    for v in visits:
        v["_id"] = str(v["_id"])
    return visits