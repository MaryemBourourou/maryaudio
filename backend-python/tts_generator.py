from gtts import gTTS
import os
import uuid

def synthesize_text_to_speech(text, lang='en'):
    tts = gTTS(text=text, lang=lang)
    filename = f"tts_output_{uuid.uuid4().hex}.mp3"
    filepath = os.path.join("static", filename)
    os.makedirs("static", exist_ok=True)
    tts.save(filepath)
    return filepath
