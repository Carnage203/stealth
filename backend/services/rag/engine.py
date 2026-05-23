import os
import json
from llm.gemini_client import get_gemini_client
from llm.prompts import ICD10_EXTRACTION_PROMPT

CACHE_PATH = "data/icd10_extracted_cache.json"

class LiveVectorlessEngine:
    """Handles low-latency inference queries directly from pre-cached memory matrices."""
    
    def __init__(self):
        self.context_string = ""
        self.is_ready = False
        self.load_knowledge_base()

    def load_knowledge_base(self):
        """Loads structural text nodes directly into server memory space."""
        if not os.path.exists(CACHE_PATH):
            return
            
        try:
            with open(CACHE_PATH, "r", encoding="utf-8") as cache_file:
                cache_data = json.load(cache_file)
                extracted_chunks = cache_data.get("extracted_chunks", [])
                
            self.context_string = "\n\n---\n\n".join(extracted_chunks)
            self.is_ready = True
        except (json.JSONDecodeError, KeyError, IOError):
            self.is_ready = False

    async def retrieve_and_generate(self, soap_query: str) -> str:
        """Processes clinical notes and queries them against Gemini using your custom client initialization wrapper."""
        if not self.is_ready:
            self.load_knowledge_base()
            if not self.is_ready:
                raise RuntimeError("RAG Engine data is unavailable: Pre-cached index structure file is unreadable or missing")

        client = get_gemini_client()
        
        formatted_prompt = ICD10_EXTRACTION_PROMPT.format(
            context=self.context_string,
            query=soap_query
        )
        
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=formatted_prompt
        )
        
        if not response.text:
            raise RuntimeError("Gemini model returned an empty generation response layer")
            
        return response.text


rag_engine = LiveVectorlessEngine()