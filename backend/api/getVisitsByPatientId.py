from fastapi import APIRouter, HTTPException
from db.mongo_client import patients_collection, visits_collection

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.get("/{patient_id}/visits")
def get_patient_visits(patient_id: str):
    
    patient_exists = patients_collection.find_one(
        {"patientId": patient_id},
        {"_id": 1}
    )

    if not patient_exists:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    visits = list(
        visits_collection.find(
            {"patientId": patient_id}
        )
    )

    for v in visits:
        v["id"] = str(v.pop("_id"))

    return visits
