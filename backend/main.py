from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from api.signup import router as signup_router
from api.activate import router as activate_router
from backend.api.completeProfile import router as complete_profile_router
from backend.api.updateProfile import router as update_profile_router
from backend.api.refreshToken import router as refresh_token_router
from api.login import router as login_router
from api.logout import router as logout_router
from backend.api.create_patient import router as patient_create_router
from backend.api.fetch_patient import router as patient_detail_router
from backend.api.fetch_visits import router as patient_visits_router
from backend.api.getPatients import router as patients_list_router
from backend.api.getVisitsByVisitId import router as visits_router

load_dotenv()

app = FastAPI(title="Stealth Backend",version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[ "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(signup_router, prefix="/api")
app.include_router(activate_router, prefix="/api")
app.include_router(complete_profile_router, prefix="/api")
app.include_router(login_router, prefix="/api")
app.include_router(logout_router, prefix="/api")
app.include_router(update_profile_router, prefix="/api")
app.include_router(refresh_token_router, prefix="/api")
app.include_router(patient_create_router, prefix="/api")
app.include_router(patient_detail_router, prefix="/api")
app.include_router(patient_visits_router, prefix="/api")
app.include_router(patients_list_router, prefix="/api")
app.include_router(visits_router, prefix="/api")

@app.get("/")
def health():
    return {"status": "ok"}