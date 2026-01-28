from fastapi import FastAPI, APIRouter
from api.signup import router as signup_router
from api.activate import router as activate_router
from api.completeProfile import router as complete_profile_router
from api.updateProfile import router as update_profile_router
from api.refreshToken import router as refresh_token_router
from api.login import router as login_router
from api.logout import router as logout_router
from api.createPatient import router as patient_create_router
from api.getPatientByPatientId import router as patient_detail_router
from api.getPatients import router as get_patients_router
from api.getVisitsByPatientId import router as get_visits_by_patient_id_router
from api.getVisitsByVisitId import router as get_visits_by_visit_id_router
from api.updateVisit import router as update_visit_router
from api.getCloudinarySignature import router as generate_signature
from api.generateSoap import router as generate_soap_router

apiRouter = APIRouter()

# Defaults Api Routes
apiRouter.include_router(
    update_profile_router,
)

# Cloudinary Apis
apiRouter.include_router(
    generate_signature,
    prefix='/cloudinary',
    tags=['Cloudinary']
)

# Auth Api Routes 
apiRouter.include_router(
    signup_router,
    prefix='/auth',
    tags=['Auth']
)
apiRouter.include_router(
    activate_router,
    prefix='/auth',
    tags=['Auth']
)
apiRouter.include_router(
    complete_profile_router,
    prefix='/auth',
    tags=['Auth']
)
apiRouter.include_router(
    refresh_token_router,
    prefix='/auth',
    tags=['Auth']
)
apiRouter.include_router(
    login_router,
    prefix='/auth',
    tags=['Auth']
)
apiRouter.include_router(
    logout_router,
    prefix='/auth',
    tags=['Auth']
)


# Patients Api Routes
apiRouter.include_router(
    patient_detail_router,
    prefix='/patients',
    tags=['patients']
)
apiRouter.include_router(
    get_patients_router,
    prefix='/patients',
    tags=['patients']
)
apiRouter.include_router(
    get_visits_by_patient_id_router,
    prefix='/patients',
    tags=['patients']
)


# Visit Api Routes
apiRouter.include_router(
    update_visit_router,
    prefix='/visits',
    tags=['visits']
)
apiRouter.include_router(
    get_visits_by_visit_id_router,
    prefix='/visits',
    tags=['visits']
)
apiRouter.include_router(
    patient_create_router,
    prefix='/visits',
    tags=['visits']
)
apiRouter.include_router(
    generate_soap_router,
    prefix='/llm',
    tags=['llm']
)


