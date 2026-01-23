from fastapi import APIRouter, HTTPException, Query
from db.mongo_client import patients_collection
from schemas.schema import PatientResponse

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.get("/", response_model=list[PatientResponse])
def get_all_patients(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    patients = []

    try:
        cursor = (
            patients_collection
            .find({}, {"_id": 0})
            .skip(offset)
            .limit(limit)
        )

        patients = list(cursor)

        for p in patients:
            p["id"] = str(p.pop("_id"))

        return patients

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve patients: {str(e)}"
        )