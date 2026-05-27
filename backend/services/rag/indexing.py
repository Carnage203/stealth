"""RUN THIS ON COLAB T4 GPU"""

import os
import pandas as pd
from sentence_transformers import SentenceTransformer
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from google.colab import userdata
from tqdm import tqdm
import numpy as np
import time

print("Connecting to MongoDB...")
mongo = MongoClient(userdata.get("MONGO_URI"), server_api=ServerApi('1'))
col = mongo[userdata.get("MONGO_DB_NAME")]["icd10_codes"]
mongo[userdata.get("MONGO_DB_NAME")].command("ping")
print("MongoDB connected!")

print("Loading embedding model...")
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
print("Model loaded!")

print("Loading CSV...")
df = pd.read_csv(
    "/content/ICD10codes.csv",
    header=None,
    names=["base_code", "sub_code", "code", "description_full", "description", "category"]
)
df = df.dropna(subset=["code", "description", "category"])
df = df.reset_index(drop=True)
print(f"Total rows in CSV: {len(df)}")

print("Checking existing indexed codes...")
existing = set(col.distinct("code"))
print(f"Already indexed: {len(existing)} codes")
df = df[~df["code"].isin(existing)].reset_index(drop=True)
print(f"Remaining to embed & insert: {len(df)}")

if len(df) == 0:
    print("Already fully indexed. Nothing to do.")
    mongo.close()
    exit()

print("Building rich text strings...")
rich_texts = [
    f"Code: {row['code']} | Category: {row['category']} | Description: {row['description']}"
    for _, row in tqdm(df.iterrows(), total=len(df), desc="Building texts")
]

BATCH_SIZE = 512
print(f"\nGenerating embeddings (batch_size={BATCH_SIZE})...")

all_embeddings = model.encode(
    rich_texts,
    batch_size=BATCH_SIZE,
    show_progress_bar=True,
    convert_to_numpy=True
)
print(f"Embeddings done! Shape: {all_embeddings.shape}")

INSERT_BATCH  = 500
MAX_RETRIES   = 3
docs          = []
inserted      = 0
failed_codes  = []

print(f"\nInserting into MongoDB (batch={INSERT_BATCH})...")

with tqdm(total=len(df), desc="Saving to MongoDB", unit="doc") as pbar:
    for i, (_, row) in enumerate(df.iterrows()):
        docs.append({
            "code":        str(row["code"]),
            "description": str(row["description"]),
            "category":    str(row["category"]),
            "embedding":   all_embeddings[i].tolist()
        })

        if len(docs) >= INSERT_BATCH:
            for attempt in range(1, MAX_RETRIES + 1):
                try:
                    col.insert_many(docs, ordered=False)
                    inserted += len(docs)
                    pbar.update(len(docs))
                    pbar.set_postfix({
                        "inserted": inserted,
                        "failed":   len(failed_codes)
                    })
                    docs = []
                    break
                except Exception as e:
                    print(f"\nAttempt {attempt}/{MAX_RETRIES} failed: {e}")
                    if attempt == MAX_RETRIES:
                        print(f"Batch failed after {MAX_RETRIES} attempts. Logging failed codes...")
                        failed_codes.extend([d["code"] for d in docs])
                        docs = []
                    else:
                        time.sleep(2 ** attempt)

    if docs:
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                col.insert_many(docs, ordered=False)
                inserted += len(docs)
                pbar.update(len(docs))
                docs = []
                break
            except Exception as e:
                print(f"\nFinal batch attempt {attempt}/{MAX_RETRIES} failed: {e}")
                if attempt == MAX_RETRIES:
                    failed_codes.extend([d["code"] for d in docs])
                else:
                    time.sleep(2 ** attempt)

print(f"\n{'='*50}")
print("Indexing complete!")
print(f"Successfully inserted : {inserted} docs")
print(f"Already existed       : {len(existing)} docs")
print(f"Failed codes          : {len(failed_codes)}")

if failed_codes:
    print("\nFailed codes saved to 'failed_codes.txt' — re-run script to retry them")
    with open("failed_codes.txt", "w") as f:
        f.write("\n".join(failed_codes))

print(f"Total in MongoDB      : {col.count_documents({})}")
print(f"{'='*50}")

mongo.close()