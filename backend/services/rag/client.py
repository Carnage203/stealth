import os
from dotenv import load_dotenv
from pageindex import PageIndexClient

load_dotenv()

class PageIndexClientManager:
    """Singleton pattern to maintain a single network connection pool handle."""
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            api_key = os.getenv("PAGEINDEX_API_KEY")
            if not api_key:
                raise RuntimeError("PAGEINDEX_API_KEY environment variable is not configured")
            cls._instance = PageIndexClient(api_key=api_key)
        return cls._instance

def get_pageindex_client() -> PageIndexClient:
    """Unified application access hook for PageIndex client interactions."""
    return PageIndexClientManager()