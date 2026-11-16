# Mary Audio

A web application for intelligent audio processing: transcribe, compress, convert and clean audio files, and extract insights (summary, topic, corrected text) with AI.

## Overview

Mary Audio is a full-stack application that combines:

- **Whisper (OpenAI)** for automatic speech transcription
- **n8n** as a workflow orchestrator
- **Ollama + Mistral** for local AI analysis (summary, topic, text correction)
- **Flask** for the Python audio processing backend
- **Node.js / Express** as an API gateway
- **React** for the user interface

## Architecture

```
React frontend
      |
Node.js / Express gateway (port 3005)
      |
n8n workflow engine (port 5678, Docker)
      |
Python Flask backend (port 5000)
      |
Ollama local LLM (port 11434)
```

## Features

| Feature | Description |
|---|---|
| Transcription | Converts an audio file to text with Whisper |
| Compression | Reduces file size (16 kHz, mono, 8-bit) |
| Conversion | Converts an audio file to MP3 |
| Cleaning | Removes background noise with noisereduce |
| Info | Extracts a summary, topic and corrected text with AI (Ollama / Mistral) |
| Metrics | Computes WER (Word Error Rate) and CER (Character Error Rate) |

## Tech stack

| Technology | Role |
|---|---|
| React, Vite, Tailwind CSS | User interface |
| Node.js, Express | API gateway |
| Python, Flask | Audio processing backend |
| Whisper (OpenAI) | Automatic transcription |
| n8n | Workflow orchestration |
| Ollama + Mistral | Local AI (summary, topic, correction) |
| librosa, noisereduce | Audio signal processing |
| pydub | Audio compression and conversion |
| Docker | Runs n8n in a container |

## Repository structure

```
.
â”œâ”€â”€ backend-python/        # Flask backend (audio processing)
â”‚   â”œâ”€â”€ main.py            # Flask entry point
â”‚   â”œâ”€â”€ process_audio.py   # Whisper transcription
â”‚   â”œâ”€â”€ audio_utils.py     # Compression, conversion, cleaning
â”‚   â”œâ”€â”€ tts_generator.py   # Text-to-speech
â”‚   â”œâ”€â”€ visualization.py
â”‚   â”œâ”€â”€ test.py            # Simple health-check script
â”‚   â””â”€â”€ Requirements.txt
â”œâ”€â”€ audio_project/
â”‚   â”œâ”€â”€ back_audio/        # Node.js API gateway
â”‚   â”‚   â”œâ”€â”€ server.js
â”‚   â”‚   â”œâ”€â”€ routes/
â”‚   â”‚   â”œâ”€â”€ controllers/
â”‚   â”‚   â””â”€â”€ models/
â”‚   â””â”€â”€ front_audio/       # React application (Vite)
â”‚       â””â”€â”€ src/
â”‚           â”œâ”€â”€ components/
â”‚           â”œâ”€â”€ hooks/
â”‚           â””â”€â”€ pages/
â””â”€â”€ README.md
```

## Prerequisites

- Node.js 18+
- Python 3.8+
- Docker Desktop
- [Ollama](https://ollama.com)
- Git

## Installation

1. **Clone the project**
   ```bash
   git clone https://github.com/MaryemBourourou/maryaudio.git
   cd maryaudio
   ```
2. **Python backend**
   ```bash
   cd backend-python
   pip install -r Requirements.txt
   cd ..
   ```
3. **Node.js backend**
   ```bash
   cd audio_project/back_audio
   npm install
   cd ../..
   ```
4. **React frontend**
   ```bash
   cd audio_project/front_audio
   npm install
   cd ../..
   ```
5. **AI model**
   ```bash
   ollama pull mistral
   ```

## Running the project

Start Docker Desktop first and wait until it is ready. Then run each service in its own terminal, in this order.

**1. n8n (Docker)**
```bash
docker run -it --rm --name n8n -p 5678:5678 -v n8n_data:/home/node/.n8n n8nio/n8n
```
n8n is available at http://localhost:5678.

> The n8n workflow export is not included in this repository. You need to create a workflow that exposes a webhook on `/webhook/audio` and handles the actions listed in the API section below.

**2. Ollama**
```bash
ollama serve
```
Ollama runs on http://localhost:11434.

**3. Python backend**
```bash
cd backend-python
python main.py
```
Flask runs on http://localhost:5000.

**4. Node.js backend**
```bash
cd audio_project/back_audio
node server.js
```
The gateway runs on http://localhost:3005.

**5. Frontend**
```bash
cd audio_project/front_audio
npm run dev
```
Open the local URL printed in the terminal.

## API endpoints

**Python Flask backend (port 5000)**

| Method | Endpoint | Description |
|---|---|---|
| POST | `/transcribe` | Audio to text |
| POST | `/compress` | Compress the audio file |
| POST | `/convert` | Convert audio to MP3 |
| POST | `/clean` | Remove background noise |
| POST | `/metrics` | Compute WER / CER |
| GET | `/helloworld` | Health check |

**Node.js gateway (port 3005)**

| Method | Endpoint | Description |
|---|---|---|
| GET | `/ping` | Health check |
| POST | `/audio?operation=transcription` | Transcription |
| POST | `/audio?operation=compression` | Compression |
| POST | `/audio?operation=conversion` | Conversion |
| POST | `/audio?operation=clean` | Cleaning |
| POST | `/audio?operation=info` | AI information extraction |
| POST | `/audio?operation=metrics` | WER / CER metrics |

**n8n webhook (port 5678)**

| Method | Endpoint | Description |
|---|---|---|
| POST | `/webhook/audio?action=transcription` | Transcription route |
| POST | `/webhook/audio?action=compression` | Compression route |
| POST | `/webhook/audio?action=conversion` | Conversion route |
| POST | `/webhook/audio?action=clean` | Cleaning route |
| POST | `/webhook/audio?action=info` | AI info route |
| POST | `/webhook/audio?action=metrics` | Metrics route |

## Notes

- Uploaded and generated audio files are excluded from the repository (see `.gitignore`).
- `backend-python/speech_01.wav` is a short sample file used for testing.

## Author

Maryem Bourourou
