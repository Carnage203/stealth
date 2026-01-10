from fastapi import FastAPI
from dotenv import load_dotenv


load_dotenv()

from api.signup import router as signup_router

app = FastAPI(
    title="Stealth Backend",
    version="1.0.0"
)

# Register router
app.include_router(signup_router)

@app.get("/")
def health():
    return {"status": "ok"}