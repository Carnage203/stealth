from fastapi import APIRouter, Request
from db.mongo_client import patients_collection, visits_collection
from utils.jwt_helper import get_current_user
from datetime import datetime, timezone

router = APIRouter()


@router.get("/stats", summary="Get dashboard stats for the current doctor")
def get_dashboard_stats(request: Request):
    email = get_current_user(request)

    # All patients belonging to this doctor
    doctor_patients = list(
        patients_collection.find(
            {"doctorEmail": email},
            {"_id": 1, "patientId": 1, "name": 1, "status": 1},
        )
    )

    patient_ids = [p["patientId"] for p in doctor_patients]
    patient_map = {p["patientId"]: p for p in doctor_patients}

    # Today's visits
    start_of_day = datetime.now(timezone.utc).replace(
        hour=0, minute=0, second=0, microsecond=0
    )
    today_visits = visits_collection.count_documents(
        {"patientId": {"$in": patient_ids}, "date": {"$gte": start_of_day}}
    )

    # Status counts
    in_review = sum(1 for p in doctor_patients if p.get("status") == "review")
    ready_for_billing = sum(1 for p in doctor_patients if p.get("status") == "billing")

    # Recent activity: last 10 visits with patient info
    recent_visits = list(
        visits_collection.find(
            {"patientId": {"$in": patient_ids}},
            {"_id": 1, "patientId": 1, "date": 1},
        )
        .sort("date", -1)
        .limit(10)
    )

    recent_activity = []
    for visit in recent_visits:
        patient = patient_map.get(visit["patientId"])
        if not patient:
            continue
        recent_activity.append(
            {
                "visitId": str(visit["_id"]),
                "patientMongoId": str(patient["_id"]),
                "patientId": visit["patientId"],
                "patientName": patient.get("name", "Unknown"),
                "visitDate": visit["date"].isoformat() if visit.get("date") else None,
                "status": patient.get("status", "review"),
            }
        )

    return {
        "todayVisits": today_visits,
        "inReview": in_review,
        "readyForBilling": ready_for_billing,
        "recentActivity": recent_activity,
    }
