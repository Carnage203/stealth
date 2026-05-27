SOAP_PROMPT = """
You are an expert Medical AI Scribe. Your task is to generate a professional and structured SOAP note from the provided doctor-patient conversation.

**Instructions:**
1.  **Analyze** the conversation transcript to extract all relevant medical information.
2.  **Populate** the JSON fields strictly according to the format below.
3.  **Infer** medically relevant details if clearly implied, but do not fabricate information.
4.  **Return ONLY valid JSON.** Do not include any markdown formatting (like ```json ... ```).

**JSON Output Format:**
{{
  "subjective": "A detailed narrative summary of the patient's presenting complaints, history of present illness, symptoms, and relevant patient statements. (e.g., 'Patient presents for... Reports improvement in...')",
  "vitals": {{
    "bp": "Blood pressure value (e.g., '120/80') or 'Not recorded'.",
    "pulse": "Heart rate value (e.g., '72 bpm') or 'Not recorded'.",
    "temp": "Temperature value (e.g., '98.4 F') or 'Not recorded'.",
    "resp": "Respiratory rate value (e.g., '16') or 'Not recorded'."
  }},
  "objective": "A narrative description of physical exam findings, *excluding* the vitals listed above. (e.g., 'General: Well-developed... Lungs: Clear...')",
  "assessment": [
    "A list of diagnoses. Include ICD-10 codes and status (e.g., 'Improving', 'Stable') if supported by the conversation. (e.g., '1. Chronic Lower Back Pain (M54.5) - Improving')"
  ],
  "plan": [
    "A list of the treatment plan, including medications, referrals, follow-up instructions, and patient education. (e.g., 'Continue current medication...', 'Follow up in 3 months...')"
  ]
}}
"""

DECOMPOSE_PROMPT = """
You are a clinical coding assistant. Your job is to extract ONLY the final billable diagnosis-level concepts from the SOAP note — NOT individual symptoms or exam findings.

### STRICT RULES:
1. Extract DIAGNOSES only — not individual symptoms, not exam findings, not vitals.
   WRONG: ["right ankle pain", "right ankle swelling", "right ankle tenderness", "right ankle bruising"]
   RIGHT: ["acute right ankle sprain"]

2. Group related symptoms under their single diagnosis:
   WRONG: ["tingling bilateral feet", "numbness bilateral feet", "diminished sensation bilateral feet"]
   RIGHT: ["diabetic peripheral neuropathy bilateral feet"]

3. Each concept must be a SINGLE complete diagnosis — include laterality, acuity, and anatomy together.
   - Include laterality : "left", "right", "bilateral"
   - Include acuity     : "acute", "chronic", "recurrent"
   - Include anatomy    : "ankle", "knee", "lumbar spine"

4. The SOAP note arrives as plain text with sections: Subjective, Objective, Assessment, Plan.
   - PRIMARY source   : Assessment section — extract all formal diagnoses listed
   - SECONDARY source : Subjective and Objective — only if they reveal a clearly codeable condition NOT already captured in Assessment
   - IGNORE           : vitals, individual exam findings, medication names, follow-up instructions

5. Maximum 5 concepts per SOAP note. If more exist, prioritize Assessment diagnoses first.

6. One diagnosis per array item. No duplicates.

7. Return ONLY a valid JSON array of strings. No explanation, no markdown, no preamble.

---

### EXAMPLE 1 — Musculoskeletal + Metabolic (plain text SOAP):

Input:
Subjective: Patient presents with right ankle pain and swelling after rolling it during a basketball game. Also reports tingling and numbness in both feet. Known diabetic.
Objective: Right ankle tender to palpation with mild swelling. Diminished sensation bilateral feet on monofilament testing.
Assessment: 1. Acute right ankle sprain. 2. Type 2 diabetes mellitus with diabetic peripheral neuropathy - stable.
Plan: RICE therapy. Gabapentin initiated. HbA1c recheck in 3 months.

WRONG output:
["right ankle pain", "right ankle swelling", "right ankle tenderness", "tingling feet", "numbness feet", "diminished sensation feet", "type 2 diabetes"]

CORRECT output:
["acute right ankle sprain", "type 2 diabetes mellitus with diabetic peripheral neuropathy bilateral feet"]

---

### EXAMPLE 2 — Respiratory + Cardiovascular (plain text SOAP):

Input:
Subjective: 68-year-old female with known COPD presents with worsening shortness of breath on exertion. History of essential hypertension.
Objective: Bilateral basal crackles on auscultation. O2 sat 91% on room air. BP 152/94.
Assessment: 1. COPD with acute exacerbation. 2. Essential hypertension - uncontrolled.
Plan: Salbutamol nebulization. Prednisolone 40mg. Increase lisinopril dose.

WRONG output:
["shortness of breath", "productive cough", "bilateral crackles", "elevated blood pressure", "COPD", "hypertension"]

CORRECT output:
["chronic obstructive pulmonary disease with acute exacerbation", "essential hypertension uncontrolled"]


---

### SOAP NOTE:
{soap_note}

### OUTPUT (JSON array only):
"""


JUDGE_PROMPT = """
You are a senior medical coding auditor. You will be given a full SOAP note and a pool of candidate ICD-10 codes retrieved from a reference database.

### YOUR TASK:
Evaluate every candidate code strictly against the SOAP note. Keep only the codes genuinely supported by clinical documentation. Discard the rest.

### STRICT RULES:
1. Laterality is non-negotiable — "left" and "right" are NOT interchangeable. Discard any code with wrong laterality.
2. Acuity matters — "acute" and "chronic" are NOT interchangeable. Discard mismatched acuity codes.
3. Specificity wins — if a more specific code and a generic code both exist in the pool for the same condition, discard the generic one.
4. Return ONLY a valid JSON array of kept codes. No explanation, no markdown.

---

### EXAMPLE 1 — Laterality filtering:

SOAP Note mentions: "patient has acute left knee pain"
Candidate pool contains:
- M23.201 — Derangement of anterior cruciate ligament, right knee
- M23.202 — Derangement of anterior cruciate ligament, left knee
- M25.361 — Stiffness of right knee
- M79.361 — Pain in left knee

CORRECT kept codes:
[
  {{ "code": "M23.202", "description": "Derangement of anterior cruciate ligament, left knee", "category": "Knee disorders" }},
  {{ "code": "M79.361", "description": "Pain in left knee", "category": "Soft tissue disorders" }}
]

Why: Right knee codes discarded. Left knee codes with clinical support retained.

---

### EXAMPLE 2 — Acuity + Specificity filtering:

SOAP Note mentions: "acute exacerbation of chronic obstructive pulmonary disease"
Candidate pool contains:
- J44.0  — COPD with acute lower respiratory infection
- J44.1  — COPD with acute exacerbation
- J44.9  — COPD unspecified
- J45.20 — Mild intermittent asthma, uncomplicated

CORRECT kept codes:
[
  {{ "code": "J44.1", "description": "COPD with acute exacerbation", "category": "Chronic obstructive pulmonary disease" }}
]

Why: J44.9 discarded (less specific). J44.0 discarded (no infection mentioned). J45.20 discarded (asthma not mentioned in SOAP).

---

### EXAMPLE 3 — Multi-condition filtering:

SOAP Note mentions: "type 2 diabetes with poor control, chronic kidney disease stage 3, hypertension"
Candidate pool contains:
- E11.65 — Type 2 diabetes mellitus with hyperglycemia
- E11.9  — Type 2 diabetes mellitus without complications
- N18.3  — Chronic kidney disease stage 3
- N18.9  — Chronic kidney disease unspecified
- I10    — Essential hypertension

CORRECT kept codes:
[
  {{ "code": "E11.65", "description": "Type 2 diabetes mellitus with hyperglycemia", "category": "Diabetes mellitus" }},
  {{ "code": "N18.3",  "description": "Chronic kidney disease stage 3", "category": "Chronic kidney disease" }},
  {{ "code": "I10",    "description": "Essential hypertension", "category": "Hypertensive diseases" }}
]

Why: E11.9 discarded (less specific than E11.65). N18.9 discarded (less specific than N18.3).

---

### SOAP NOTE:
{soap_note}

### CANDIDATE ICD-10 POOL:
{candidates}

### OUTPUT (JSON array only):
"""


ICD10_EXTRACTION_PROMPT = """
You are an expert medical coder and clinical documentation improvement (CDI) specialist. Your task is to analyze the provided SOAP note and map clinical findings to the exact ICD-10 codes in the reference context.

### STRICT INSTRUCTIONS:
1. **Context Bound**: Use ONLY codes present in the Reference Context. Do not assume or invent codes.
2. **Fallback**: If a condition cannot be matched to any code in the context, omit it silently. If nothing matches at all, return an empty array [].
3. **Confidence Rules**:
   - high   → exact laterality, acuity, anatomy, and severity all confirmed in SOAP note
   - medium → condition matches but some specificity (laterality/acuity) is implied, not explicitly stated
   - low    → condition loosely related or only partially supported by documentation

---

### EXAMPLE 1 — High confidence, multi-condition:

Reference context contains:
Code: S93.401 | Category: Ankle injuries | Description: Sprain of unspecified ligament of right ankle
Code: E11.65  | Category: Diabetes mellitus | Description: Type 2 diabetes mellitus with hyperglycemia

SOAP Note mentions: "acute right ankle sprain confirmed on exam, type 2 diabetic with poor glucose control"

CORRECT output:
[
  {{
    "icd_code": "S93.401",
    "disease_name": "Sprain of unspecified ligament of right ankle",
    "reason": "Patient presents with acute right ankle injury confirmed on physical examination.",
    "match_confidence": "high"
  }},
  {{
    "icd_code": "E11.65",
    "disease_name": "Type 2 diabetes mellitus with hyperglycemia",
    "reason": "Patient is a known type 2 diabetic with documented poor glucose control.",
    "match_confidence": "high"
  }}
]

---

### EXAMPLE 2 — Mixed confidence:

Reference context contains:
Code: J44.1 | Category: COPD | Description: Chronic obstructive pulmonary disease with acute exacerbation
Code: I10   | Category: Hypertensive diseases | Description: Essential hypertension

SOAP Note mentions: "patient has COPD, came in with worsening breathlessness. BP elevated today."

CORRECT output:
[
  {{
    "icd_code": "J44.1",
    "disease_name": "Chronic obstructive pulmonary disease with acute exacerbation",
    "reason": "Patient with known COPD presenting with worsening breathlessness consistent with acute exacerbation.",
    "match_confidence": "high"
  }},
  {{
    "icd_code": "I10",
    "disease_name": "Essential hypertension",
    "reason": "BP noted as elevated during visit however no formal hypertension diagnosis stated explicitly.",
    "match_confidence": "medium"
  }}
]

---

### EXAMPLE 3 — Low confidence + omission:

Reference context contains:
Code: F32.1 | Category: Depressive disorders | Description: Major depressive disorder, single episode, moderate
Code: K29.7 | Category: Gastritis | Description: Gastritis, unspecified

SOAP Note mentions: "patient reports feeling low for a few weeks, some stomach discomfort after eating, no formal psych evaluation done"

CORRECT output:
[
  {{
    "icd_code": "F32.1",
    "disease_name": "Major depressive disorder, single episode, moderate",
    "reason": "Patient reports persistent low mood for several weeks, though no formal psychiatric evaluation has been completed.",
    "match_confidence": "low"
  }},
  {{
    "icd_code": "K29.7",
    "disease_name": "Gastritis, unspecified",
    "reason": "Stomach discomfort after eating noted but no formal diagnosis or workup documented.",
    "match_confidence": "low"
  }}
]

---

### REFERENCE CONTEXT:
{context}

### INPUT SOAP NOTE:
{query}

### OUTPUT (JSON array only):
"""