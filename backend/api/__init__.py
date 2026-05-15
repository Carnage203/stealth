from fastapi import APIRouter
from api.auth.signup import router as signup_router
from api.auth.activate import router as activate_router
from api.profile.completeProfile import router as complete_profile_router
from api.profile.updateProfile import router as update_profile_router
from api.profile.getProfile import router as get_profile_router
from api.auth.refreshToken import router as refresh_token_router
from api.auth.login import router as login_router
from api.auth.me import router as me_router
from api.auth.logout import router as logout_router
from api.createConsulation import router as create_consultation_router
from api.patients.getPatientByPatientId import router as patient_detail_router
from api.patients.getPatients import router as get_patients_router
from api.patients.getVisitByVisitId import router as get_visits_by_visit_id_router
from api.cloudinary.getCloudinarySignature import router as generate_signature
from api.cloudinary.deleteCloudinaryFile import router as delete_cloudinary_file_router
from api.session.getAllSessions import router as get_all_sessions_router
from api.session.logoutDeviceBySessionId import router as logout_device_by_session_id_router
from api.session.logoutAllDeviceBYUserId import router as logout_all_device_router
from api.auth.resetToken import router as reset_token_router
from api.dashboard.getDashboardStats import router as dashboard_stats_router

apiRouter = APIRouter()

# Cloudinary Apis
apiRouter.include_router(
    generate_signature,
    prefix='/cloudinary',
    tags=['Cloudinary']
)
apiRouter.include_router(
    delete_cloudinary_file_router,
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
apiRouter.include_router(
    update_profile_router,
    prefix='/auth',
    tags=['Auth']
)
apiRouter.include_router(
    get_profile_router,
    prefix='/auth',
    tags=['Auth']
)
apiRouter.include_router(
    me_router,
    prefix='/auth',
    tags=['Auth']
)
apiRouter.include_router(
    reset_token_router,
    prefix='/auth',
    tags=['Auth']
)


# Patients Api Routes
apiRouter.include_router(
    patient_detail_router,
    prefix='/patients',
    tags=['Patients']
)
apiRouter.include_router(
    get_patients_router,
    prefix='/patients',
    tags=['Patients']
)

apiRouter.include_router(
    get_visits_by_visit_id_router,
    prefix='/visits',
    tags=['Visits']
)
apiRouter.include_router(
    create_consultation_router,
    prefix='/visits',
    tags=['Visits']
)


# Dashboard Api Routes
apiRouter.include_router(
    dashboard_stats_router,
    prefix='/dashboard',
    tags=['Dashboard']
)

# Session Api Routes
apiRouter.include_router(
    get_all_sessions_router,
    prefix='/sessions',
    tags=['Sessions']
)
apiRouter.include_router(
    logout_device_by_session_id_router,
    prefix='/sessions',
    tags=['Sessions']
)
apiRouter.include_router(
    logout_all_device_router,
    prefix='/sessions',
    tags=['Sessions']
)