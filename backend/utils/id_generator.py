from datetime import datetime, timezone
import uuid

def generate_patient_id() -> str:
    date_part = datetime.now(timezone.utc).strftime("%d%m%y")
    uuid_part = uuid.uuid4().hex[:4]
    return f"{date_part}-{uuid_part}"