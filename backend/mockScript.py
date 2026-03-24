from datetime import datetime
from bson import ObjectId
from db.mongo_client import visits_collection, patients_collection

# ── Pre-generate ObjectIds so _id and patientId always match ─────────────────

p1, p2, p3, p4, p5, p6, p7 = [ObjectId() for _ in range(7)]
v1, v2, v3, v4, v5, v6, v7 = [ObjectId() for _ in range(7)]

# ── Mock Visits ───────────────────────────────────────────────────────────────

mock_visits = [
    {
        "_id": v1,
        "patientId": str(p1),
        "date": datetime(2026, 1, 10, 9, 30),
        "notes": ["Patient reports mild fever", "Prescribed Paracetamol 500mg"],
        "transcription": ["Doctor: How are you feeling?", "Patient: I have a mild fever since yesterday."]
    },
    {
        "_id": v2,
        "patientId": str(p1),
        "date": datetime(2026, 2, 14, 11, 0),
        "notes": ["Follow-up visit", "Fever resolved, patient recovering well"],
        "transcription": ["Doctor: Any more fever?", "Patient: No, feeling much better now."]
    },
    {
        "_id": v3,
        "patientId": str(p2),
        "date": datetime(2026, 1, 20, 10, 0),
        "notes": ["Chest pain complaint", "ECG normal", "Referred for stress test"],
        "transcription": ["Doctor: Describe your chest pain.", "Patient: It comes and goes, especially after walking."]
    },
    {
        "_id": v4,
        "patientId": str(p3),
        "date": datetime(2026, 2, 5, 14, 0),
        "notes": ["Routine checkup", "BP slightly elevated 140/90", "Advised lifestyle changes"],
        "transcription": ["Doctor: Any headaches lately?", "Patient: Yes, occasional headaches in the evening."]
    },
    {
        "_id": v5,
        "patientId": str(p4),
        "date": datetime(2026, 3, 1, 8, 30),
        "notes": ["Knee pain complaint", "X-ray recommended", "Prescribed anti-inflammatory"],
        "transcription": ["Doctor: When did the knee pain start?", "Patient: About two weeks ago after jogging."]
    },
    {
        "_id": v6,
        "patientId": str(p5),
        "date": datetime(2026, 2, 18, 15, 0),
        "notes": ["Diabetes management", "HbA1c: 7.2%", "Metformin dosage adjusted"],
        "transcription": ["Doctor: Have you been monitoring your sugar levels?", "Patient: Yes, they have been slightly high in the mornings."]
    },
    {
        "_id": v7,
        "patientId": str(p5),
        "date": datetime(2026, 3, 8, 10, 30),
        "notes": ["Follow-up for diabetes", "HbA1c improved to 6.8%", "Continue current medication"],
        "transcription": ["Doctor: Great improvement in your numbers.", "Patient: I have been following the diet strictly."]
    },
]

# ── Mock Patients ─────────────────────────────────────────────────────────────

mock_patients = [
    {
        "_id": p1,
        "patientId": str(p1),
        "doctorEmail": "mukherjeearnab988@gmail.com",
        "name": "John Carter",
        "age": 34,
        "gender": "Male",
        "phone": "9876543210",
        "history": [str(v1), str(v2)],
        "status": "completed",
        "created_at": datetime(2026, 1, 5)
    },
    {
        "_id": p2,
        "patientId": str(p2),
        "doctorEmail": "mukherjeearnab988@gmail.com",
        "name": "Sarah Mitchell",
        "age": 52,
        "gender": "Female",
        "phone": "9123456780",
        "history": [str(v3)],
        "status": "review",
        "created_at": datetime(2026, 1, 18)
    },
    {
        "_id": p3,
        "patientId": str(p3),
        "doctorEmail": "mukherjeearnab988@gmail.com",
        "name": "Raj Patel",
        "age": 45,
        "gender": "Male",
        "phone": "9001234567",
        "history": [str(v4)],
        "status": "billing",
        "created_at": datetime(2026, 2, 1)
    },
    {
        "_id": p4,
        "patientId": str(p4),
        "doctorEmail": "mukherjeearnab988@gmail.com",
        "name": "Emily Zhang",
        "age": 28,
        "gender": "Female",
        "phone": "9812345678",
        "history": [str(v5)],
        "status": "completed",
        "created_at": datetime(2026, 2, 28)
    },
    {
        "_id": p5,
        "patientId": str(p5),
        "doctorEmail": "mukherjeearnab988@gmail.com",
        "name": "Michael Osei",
        "age": 60,
        "gender": "Male",
        "phone": "9700000001",
        "history": [str(v6), str(v7)],
        "status": "completed",
        "created_at": datetime(2026, 2, 15)
    },
    {
        "_id": p6,
        "patientId": str(p6),
        "doctorEmail": "mukherjeearnab988@gmail.com",
        "name": "Priya Sharma",
        "age": 37,
        "gender": "Female",
        "phone": "9988776655",
        "history": [],
        "status": "review",
        "created_at": datetime(2026, 3, 10)
    },
    {
        "_id": p7,
        "patientId": str(p7),
        "doctorEmail": "mukherjeearnab988@gmail.com",
        "name": "Lucas Fernandez",
        "age": 22,
        "gender": "Male",
        "phone": "9111222333",
        "history": [],
        "status": "billing",
        "created_at": datetime(2026, 3, 11)
    },
]


def seed():
    # ── Insert Visits ──────────────────────────────────────────────────────────
    for visit in mock_visits:
        visits_collection.update_one(
            {"_id": visit["_id"]},
            {"$set": visit},
            upsert=True
        )
    print(f"✅ Seeded {len(mock_visits)} visits")

    # ── Insert Patients ────────────────────────────────────────────────────────
    for patient in mock_patients:
        patients_collection.update_one(
            {"_id": patient["_id"]},
            {"$set": patient},
            upsert=True
        )
    print(f"✅ Seeded {len(mock_patients)} patients")

    print("\n📋 Summary:")
    print(f"   Patients : {len(mock_patients)}")
    print(f"   Visits   : {len(mock_visits)}")
    print(f"   Doctor   : mukherjeearnab988@gmail.com")


if __name__ == "__main__":
    seed()