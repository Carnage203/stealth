from fastapi import APIRouter, HTTPException, status
from schemas.schema import Patient
from db.mongo_client import patients_collection, visits_collection
from utils.id_generator import generate_patient_id
from datetime import datetime, timezone

router = APIRouter(prefix="/visits", tags=["visits"])

@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    summary="Create a new patient record",
)
def create_patient_and_visit(payload: Patient):
    patient_id = generate_patient_id()
    
    try:
        patient_doc = {
            "patient_id": patient_id,
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
            "patient_id": patient_id,
            "transcript": [payload.transcript],
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
            "patient_id": patient_id,
            "visit_id": str(visit_id),
        }

    except Exception:
        # rollback (no orphan data)
        patients_collection.delete_one({"patient_id": patient_id})
        visits_collection.delete_many({"patient_id": patient_id})

        raise HTTPException(
            status_code=500,
            detail="Failed to create patient visit"
        )