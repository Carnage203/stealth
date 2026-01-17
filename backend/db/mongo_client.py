import os, logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ConfigurationError
from dotenv import load_dotenv

load_dotenv()

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
