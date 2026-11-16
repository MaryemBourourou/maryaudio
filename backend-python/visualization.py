import librosa
import librosa.display
import matplotlib.pyplot as plt
import os
import uuid

def generate_spectrogram(filepath):
    # Charger l'audio avec librosa
    y, sr = librosa.load(filepath, sr=None)

    # Tracer la forme d’onde avec waveshow
    plt.figure(figsize=(10, 4))
    librosa.display.waveshow(y, sr=sr, color='steelblue')
    plt.title('Waveform')
    plt.xlabel('Time (s)')
    plt.ylabel('Amplitude')
    plt.tight_layout()

    # Sauvegarder l'image
    output_path = os.path.join("static", f"waveform_{uuid.uuid4().hex}.png")
    plt.savefig(output_path)
    plt.close()

    return output_path
