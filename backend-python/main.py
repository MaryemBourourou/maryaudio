from flask import Flask, request, jsonify , send_file
from flask_restful import Api, Resource
import os 
from process_audio import transcribe_audio
from audio_utils import convert_audio, compress_audio, clean_audio, calculate_wer_cer
import noisereduce as nr
import librosa
import soundfile as sf
from tts_generator import synthesize_text_to_speech
#from visualization import generate_spectrogram


app=Flask(__name__)
api=Api(app)

UPLOAD_FOLDER= 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

#transcription
@app.route('/transcribe', methods=['POST'])
def transcribe():
 if 'file' not in request.files:
  return jsonify({"error": "No file part"}), 400
 file = request.files['file']
 if file.filename == '' : 
  return jsonify({"error": "No selected file "}), 400
 filepath= os.path.join(UPLOAD_FOLDER, file.filename)
 file.save(filepath)
 result = transcribe_audio(filepath)
 os.remove(filepath)
 return jsonify({"transcription" : result })


#conversion format .wav to mp3 
"""
@app.route('/convert', methods=['POST'])
def convert():
  if 'file' not in request.files or 'format' not in request.form:
    return jsonify({"error" : "File or target format missing "}) , 400
  file = request.files['file']
  target_format=request.form['format']
  filepath= os.path.join(UPLOAD_FOLDER, file.filename)
  file.save(filepath)

  output_path = convert_audio(filepath, target_format)
  os.remove(filepath)
  return jsonify({"converted_file" : output_path})
"""
@app.route('/convert', methods=['POST'])
def convert():
    if 'file' not in request.files or 'format' not in request.form:
        return jsonify({"error": "File or target format missing"}), 400

    file = request.files['file']
    target_format = request.form['format']
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    try:
        output_path = convert_audio(filepath, target_format)
        os.remove(filepath)  # supprime l'original

        # 🔁 Envoie le fichier converti directement
        return send_file(
            output_path,
            mimetype=f"audio/{target_format}",
            as_attachment=True,
            attachment_filename=os.path.basename(output_path)
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


#compression : 
"""
@app.route('/compress', methods=['POST'])
def compress():
    if 'file' not in request.files:
        return jsonify({"error": "No file"}), 400
    file = request.files['file']
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    compressed_path = compress_audio(filepath)
    os.remove(filepath)
    return jsonify({"compressed_file": compressed_path})"""
#nouvelle compression : 
@app.route('/compress', methods=['POST'])
def compress():
    if 'file' not in request.files:
        return jsonify({"error": "No file"}), 400

    file = request.files['file']
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    compressed_path = compress_audio(filepath)

    os.remove(filepath)  # Supprime le fichier original
    # Optionnel : supprime le fichier compressé après envoi

    # 🔁 Envoie le fichier compressé directement à n8n
    return send_file(
    compressed_path,
    mimetype="audio/wav",
    as_attachment=True,
    attachment_filename=os.path.basename(compressed_path)
)


#noisereduce :
"""
@app.route('/clean', methods=['POST'])
def clean():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    # Nettoyage
    cleaned_path = clean_audio(filepath)

    # Supprime le fichier original
    os.remove(filepath)

    return jsonify({"cleaned_file": cleaned_path})"""
@app.route('/clean', methods=['POST'])
def clean():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    try:
        # Appel à ta fonction de nettoyage
        cleaned_path = clean_audio(filepath)

        # Supprime le fichier original
        os.remove(filepath)

        # 🔁 Renvoie le fichier nettoyé (binaire)
        return send_file(
            cleaned_path,
            mimetype="audio/wav",
            as_attachment=True,
            attachment_filename=os.path.basename(cleaned_path)
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# WER / CER metrics
@app.route('/metrics', methods=['POST'])
def metrics():
    data = request.get_json()
    if not data or 'ref' not in data or 'hyp' not in data:
        return jsonify({"error": "Missing reference or hypothesis"}), 400

    wer, cer = calculate_wer_cer(data['ref'], data['hyp'])
    return jsonify({"wer": wer, "cer": cer})


#tts 
"""
@app.route('/synthesize', methods=['POST'])
def synthesize():
    data = request.get_json()
    text = data.get("text")
    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    try:
        audio_path = synthesize_text_to_speech(text)
        return jsonify({"audio_path": audio_path})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
"""
@app.route('/synthesize', methods=['POST'])
def synthesize():
    data = request.get_json()
    text = data.get("text")
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    try:
        # Appel à ta fonction TTS
        audio_path = synthesize_text_to_speech(text)

        # 🔁 Retourne le fichier audio directement
        return send_file(
            audio_path,
            mimetype="audio/wav",
            as_attachment=True,
            attachment_filename=os.path.basename(audio_path)
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500

"""
# Spectrogram : visualization
@app.route('/visualize', methods=['POST'])
def visualize():
    if 'file' not in request.files:
        return jsonify({"error": "No file"}), 400
    file = request.files['file']
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    image_path = generate_spectrogram(filepath)
    os.remove(filepath)
    return jsonify({"spectrogram_path": image_path})"""



 #hello world 
class HelloWorld(Resource):
 def get(self):
  return {"data" :"Hello world"}

api.add_resource(HelloWorld,"/helloworld")

if __name__== "__main__":
 app.run(debug=True, host='0.0.0.0', port=5000)
