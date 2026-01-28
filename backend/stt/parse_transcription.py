import re
from typing import Any, List, Dict


def parse_transcription_response(response: Any, gap_threshold: float = 0.7):
    """
    Parses ElevenLabs transcription API response into:
      - full_text: complete transcript string
      - sentence_segments: list of dicts with:
           start, end, sentence, speakers (list of speaker_ids in that sentence)

    Assumes `response.words` is iterable, each word object has:
       - text (str)
       - start (float/int)
       - end (float/int)
       - type (e.g. "word", "spacing", others)
       - speaker_id (str) when diarize=True

    Args:
        response: object/dict from ElevenLabs speech-to-text API
        gap_threshold: silence gap (in seconds) used to split sentences

    Returns:
        (full_text, sentence_segments)
    """
    words = getattr(response, "words", [])
    full_text = getattr(response, "text", "").strip()

    sentence_segments: List[Dict] = []
    current_words: List[Dict] = []
    current_start = None
    last_end = None

    for w in words:
        if getattr(w, "type", None) != "word":
            continue

        text = w.text
        start = float(w.start)
        end = float(w.end)
        speaker = getattr(w, "speaker_id", None)

        if current_start is None:
            current_start = start

        # Split if long silence
        if last_end and start - last_end > gap_threshold and current_words:
            sentence_text = " ".join(item["text"] for item in current_words)
            sentence_text = re.sub(r"\s+", " ", sentence_text).strip()
            speakers = list({item["speaker"] for item in current_words if item["speaker"]})
            sentence_segments.append({
                "start": round(current_start, 2),
                "end": round(current_words[-1]["end"], 2),
                "sentence": sentence_text,
                "speaker": speakers,
            })
            current_words = []
            current_start = start

        current_words.append({
            "text": text,
            "start": start,
            "end": end,
            "speaker": speaker,
        })
        last_end = end

        # Split on sentence-ending punctuation
        if re.search(r"[.!?।]$", text):
            sentence_text = " ".join(item["text"] for item in current_words)
            sentence_text = re.sub(r"\s+", " ", sentence_text).strip()
            speakers = list({item["speaker"] for item in current_words if item["speaker"]})
            sentence_segments.append({
                "start": round(current_start, 2),
                "end": round(end, 2),
                "sentence": sentence_text,
                "speaker": speakers,
            })
            current_words = []
            current_start = None

    # Flush leftover words
    if current_words:
        sentence_text = " ".join(item["text"] for item in current_words)
        sentence_text = re.sub(r"\s+", " ", sentence_text).strip()
        speakers = list({item["speaker"] for item in current_words if item["speaker"]})
        sentence_segments.append({
            "start": round(current_start, 2),
            "end": round(current_words[-1]["end"], 2),
            "sentence": sentence_text,
            "speaker": speakers,
        })

    return full_text, sentence_segments
