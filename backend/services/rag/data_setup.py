import os
import time
import json
import pandas as pd
from fpdf import FPDF
from services.rag.client import get_pageindex_client

CSV_PATH = "data/icd10_source_codes.csv"
PDF_PATH = "data/icd10_compiled_document.pdf"
CACHE_PATH = "data/icd10_extracted_cache.json"

def extract_text_nodes(node_list: list) -> list:
    """Recursively extracts text elements from deep visual hierarchical node trees."""
    chunks = []
    for node in node_list:
        if "text" in node and node["text"]:
            chunks.append(node["text"])
        if "nodes" in node and isinstance(node["nodes"], list):
            chunks.extend(extract_text_nodes(node["nodes"]))
    return chunks

def run_one_time_indexing(csv_path: str = CSV_PATH):
    """Processes the full CSV file dataset, generates a structured PDF, and caches the results."""
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Required base CSV file was not found at path: {csv_path}")

    try:
        
        df = pd.read_csv(csv_path, header=None, dtype=str).dropna()
        
        os.makedirs(os.path.dirname(PDF_PATH), exist_ok=True)
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)

        for _, row in df.iterrows():
            
            code, desc, category = row[2], row[3], row[5]
            chunk = f"Category: {category} | Diagnosis: {desc} | ICD-10 Code: {code}"
            clean_chunk = chunk.encode('latin-1', 'replace').decode('latin-1')
            
            pdf.multi_cell(0, 10, txt=clean_chunk)
            pdf.ln(5)

        pdf.output(PDF_PATH)
        
        
        pi_client = get_pageindex_client()
        upload_result = pi_client.submit_document(PDF_PATH)
        doc_id = upload_result.get("doc_id")
        
        if not doc_id:
            raise RuntimeError("PageIndex platform did not return a valid document token identifier")

        
        time.sleep(20)

        tree_result = pi_client.get_tree(doc_id=doc_id, node_summary=True)
        pi_tree = tree_result.get("result", [])
        extracted_chunks = extract_text_nodes(pi_tree)

        if not extracted_chunks:
            raise RuntimeError("Extraction failed: Compiled tree returned empty structure elements")

        cache_data = {
            "doc_id": doc_id,
            "extracted_chunks": extracted_chunks
        }

        with open(CACHE_PATH, "w", encoding="utf-8") as cache_file:
            json.dump(cache_data, cache_file, indent=4)

    except Exception as e:
        
        if os.path.exists(PDF_PATH):
            try:
                os.remove(PDF_PATH)
            except OSError:
                pass
        raise RuntimeError(f"Ingestion engine encountered a terminal failure: {str(e)}")