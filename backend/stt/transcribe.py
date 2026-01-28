import os
from dotenv import load_dotenv
from io import BytesIO
import requests
from parse_transcription import parse_transcription_response
from elevenlabs.client import ElevenLabs

load_dotenv()

elevenlabs = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY"),
)

def transcribe_audio_from_url(
    audio_url: str,
    language_code: str = "eng",
    diarize: bool = True,
    num_speakers: int = 2,
):
    """
    Downloads audio from a URL and transcribes it using ElevenLabs STT.
    """

    response = requests.get(audio_url)
    response.raise_for_status()

    audio_data = BytesIO(response.content)

    transcription = elevenlabs.speech_to_text.convert(
        file=audio_data,
        model_id="scribe_v2",
        language_code=language_code,
        diarize=diarize,
        num_speakers=num_speakers,
    )

    return transcription

if __name__ == "__main__":
    test_audio_url = (
        "https://storage.googleapis.com/eleven-public-cdn/audio/marketing/nicole.mp3"
    )

    result = transcribe_audio_from_url(
        audio_url=test_audio_url,
        language_code="eng",
        diarize=True,
        num_speakers=2,
    )

    full_text, sentence_segments = parse_transcription_response(result)

    print(sentence_segments)
