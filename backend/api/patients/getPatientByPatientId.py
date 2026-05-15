from fastapi import APIRouter, HTTPException
from db.mongo_client import patients_collection, visits_collection
from schemas.schema import PatientWithVisitsResponse
from bson import ObjectId
from bson.errors import InvalidId


router = APIRouter()


@router.get("/{patient_id}", response_model=PatientWithVisitsResponse)
def get_patient(patient_id: str):
    patient = None

    # 1. Search by last 6 chars of MongoDB _id (primary UI search method)
    results = list(patients_collection.aggregate([
        {"$addFields": {"idStr": {"$toString": "$_id"}}},
        {"$match": {"idStr": {"$regex": f"{patient_id.lower()}$"}}},
        {"$limit": 1},
    ]))
    if results:
        patient = results[0]

    # 2. Fall back to full MongoDB ObjectId
    if not patient:
        try:
            patient = patients_collection.find_one({"_id": ObjectId(patient_id)})
        except InvalidId:
            pass

    # 3. Fall back to custom patientId field
    if not patient:
        patient = patients_collection.find_one({"patientId": patient_id})

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    patient["id"] = str(patient.pop("_id"))

    patient_payload = {
        "id": patient.get("id"),
        "name": patient.get("name"),
        "age": patient.get("age"),
        "gender": patient.get("gender"),
        "phone": patient.get("phone"),
        "status": patient.get("status", "completed"),
    }

    actual_patient_id = patient.get("patientId", patient_id)

    visits_cursor = visits_collection.find(
        {"patientId": actual_patient_id},
        {"date": 1}
    )

    visits = []
    for v in visits_cursor:
        visits.append({
            "id": str(v["_id"]),
            "date": v.get("date")
        })

    return {"patient": patient_payload, "visits": visits}