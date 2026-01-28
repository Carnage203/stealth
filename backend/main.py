from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from api import apiRouter

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


app.include_router(apiRouter, prefix='/api/v1',)

@app.get("/")
def health():
    return {"status": "ok"}
