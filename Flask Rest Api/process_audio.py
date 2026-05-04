import whisper

model = whisper.load_model("tiny")

def transcribe_audio(filepath):
    result = model.transcribe(filepath)
    return result["text"]
