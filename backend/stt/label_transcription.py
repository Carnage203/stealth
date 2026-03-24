import json
from google.genai import types
from schemas.schema import TranscriptionSegment


LABEL_PROMPT = """
You are an expert AI for processing medical consultation transcripts.
Your task is to analyze a diarized transcript from a doctor-patient consultation and assign "Doctor" or "Patient" roles to each speaker.

Follow these steps:
1. **Analyze Context**: Read the conversation to identify which speaker ID (e.g., "speaker_0", "speaker_1") is the Doctor and which is the Patient. The Doctor typically asks clinical questions, discusses diagnoses, orders tests, and prescribes treatment.
2. **Assign Roles**: Consistently apply "Doctor" or "Patient" to the corresponding speaker throughout the entire transcript. The 'speaker' field is a list; replace the speaker ID with the assigned role label.
3. **Preserve All Fields**: Keep start, end, and sentence values exactly as provided — do not modify them.
4. **Format Output**: Return a clean JSON array of objects. Each object must contain the keys "start", "end", "sentence", and "speaker" (as a list with exactly one element: "Doctor" or "Patient").

**IMPORTANT**: Your response must be ONLY the JSON array, without any commentary or markdown formatting like ```json.

---
## Example

### Input Transcript:
[
    {"start": 0.0, "end": 4.52, "sentence": "Good morning, what brings you in today?", "speaker": ["speaker_0"]},
    {"start": 5.1, "end": 12.8, "sentence": "I've been having chest pain for the past two days.", "speaker": ["speaker_1"]},
    {"start": 13.0, "end": 19.5, "sentence": "Can you describe the pain, is it sharp or more of a pressure?", "speaker": ["speaker_0"]},
    {"start": 20.1, "end": 27.3, "sentence": "It's more like a tightness, especially when I climb stairs.", "speaker": ["speaker_1"]}
]

### Correct Output:
[
  {
    "start": 0.0,
    "end": 4.52,
    "sentence": "Good morning, what brings you in today?",
    "speaker": ["Doctor"]
  },
  {
    "start": 5.1,
    "end": 12.8,
    "sentence": "I've been having chest pain for the past two days.",
    "speaker": ["Patient"]
  },
  {
    "start": 13.0,
    "end": 19.5,
    "sentence": "Can you describe the pain, is it sharp or more of a pressure?",
    "speaker": ["Doctor"]
  },
  {
    "start": 20.1,
    "end": 27.3,
    "sentence": "It's more like a tightness, especially when I climb stairs.",
    "speaker": ["Patient"]
  }
]
"""


def label_transcription(transcript: list[dict], llm) -> tuple[list[dict], str | None]:
    """
    Labels speaker IDs in a diarized doctor-patient transcript as "Doctor" or "Patient".

    Args:
        transcript: List of segment dicts with keys: start, end, sentence, speaker
        llm: Gemini genai.Client instance

    Returns:
        tuple: (labeled_transcript_list, error_message_or_None)
    """
    try:
        response = llm.models.generate_content(
            model="gemini-2.5-flash",
            config=types.GenerateContentConfig(
                system_instruction=LABEL_PROMPT,
                response_schema=list[TranscriptionSegment],
                response_mime_type="application/json",
                temperature=0.2,
            ),
            contents=[str(transcript)],
        )

        if not response.text:
            raise ValueError("Empty response from Gemini")

        labeled = json.loads(response.text)
        return labeled, None

    except Exception as e:
        return [], str(e)
