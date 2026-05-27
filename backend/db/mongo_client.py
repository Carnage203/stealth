import os, logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ConfigurationError
from dotenv import load_dotenv
from pymongo.server_api import ServerApi

load_dotenv(override=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)
logger = logging.getLogger(__name__)

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = "database"

if not MONGO_URI:
    raise RuntimeError(
        "MONGO_URI is not set. Define it in environment variables."
    )

try:
    client = MongoClient(
        MONGO_URI,
        serverSelectionTimeoutMS=5000
    )

    client.admin.command("ping")
    logger.info("MongoDB connection successful")
except (ConnectionFailure, ConfigurationError) as e:
    logger.error("MongoDB connection failed", exc_info=True)
    raise RuntimeError(f"MongoDB connection failed: {e}")

db = client[DB_NAME]
doctors_collection = db["doctors"]
tokens_collection = db["tokens"]
patients_collection = db["patients"]
visits_collection = db["visits"]
sessions_collection = db["sessions"]

_rag_client = None

def get_rag_client() -> MongoClient:
    global _rag_client
    if _rag_client is None:
        uri = os.getenv("MONGO_URI_RAG")
        if not uri:
            raise RuntimeError("MONGO_URI_RAG not set in environment")
        _rag_client = MongoClient(uri, server_api=ServerApi('1'))
    return _rag_client

def get_rag_db():
    db_name = os.getenv("MONGO_DB_NAME_RAG")
    if not db_name:
        raise RuntimeError("MONGO_DB_NAME_RAG not set in environment")
    return get_rag_client()[db_name]

def get_rag_collection(collection_name: str):
    return get_rag_db()[collection_name]