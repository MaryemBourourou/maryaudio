from pydub import AudioSegment 
import os 
import librosa
import noisereduce as nr
import soundfile as sf
from jiwer import wer, cer 


#conversion
def convert_audio(filepath, target_format="mp3"):
    audio= AudioSegment.from_file(filepath)
    output_path= filepath.rsplit('.',1)[0]+ "."+ target_format
    audio.export(output_path, format=target_format)
    return output_path


#compression
def compress_audio(filepath):
    audio = AudioSegment.from_file(filepath)
    compressed = audio.set_frame_rate(16000).set_channels(1).set_sample_width(1)
    output_path = filepath.rsplit('.', 1)[0] + "_compressed.wav"
    compressed.export(output_path, format="wav")
    return output_path


#noisereduce 
def clean_audio(filepath):
    # Charge l'audio
    y, sr = librosa.load(filepath, sr=None)

    # Réduction de bruit (en se basant sur les premiers instants comme bruit)
    reduced_noise = nr.reduce_noise(y=y, sr=sr)

    # Chemin de sortie temporaire
    cleaned_path = os.path.splitext(filepath)[0] + "_cleaned.wav"

    # Sauvegarde l'audio nettoyé
    sf.write(cleaned_path, reduced_noise, sr)

    return cleaned_path

#metrics 
def calculate_wer_cer(reference, hypothesis):
    return wer(reference, hypothesis), cer(reference, hypothesis)