from fastapi import APIRouter, HTTPException, status
from schemas.schema import Patient
from db.mongo_client import patients_collection, visits_collection
from backend.utils.uniqueid import generate_patient_id
from datetime import datetime, timezone

router = APIRouter(prefix="/visits", tags=["visits"])

@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    summary="Create patient and visit record",
)
def create_visit(payload: Patient):
    existing_patient = patients_collection.find_one({"patientId": payload.patientId})

    if existing_patient:
        patient_id = existing_patient["patientId"]
    else:
        patient_id = generate_patient_id()
    
    try:
        patient_doc = {
            "patientId": patient_id,
            "name": payload.name,
            "age": payload.age,
            "gender": payload.gender,
            "phone": payload.phone,
            "history": [],
            "created_at": datetime.now(timezone.utc),
        }
        patient_result = patients_collection.insert_one(patient_doc)
        patient_mongo_id = patient_result.inserted_id

        visit_doc = {
            "patientId": patient_id,
            "transcript": payload.transcript,
            "date": datetime.now(timezone.utc),
        }

        visit_result = visits_collection.insert_one(visit_doc)
        visit_id = visit_result.inserted_id

        
        patients_collection.update_one(
            {"_id": patient_mongo_id},
            {"$push": {"history": visit_id}}
        )

        return {
            "message": "Patient and visit created successfully",
            "patientId": patient_id,
            "visitId": str(visit_id),
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create visit: {str(e)}"
        )