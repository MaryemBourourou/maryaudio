# 🎙️ Mary Audio

Une application web de traitement audio intelligente qui permet de transcrire, compresser, convertir, nettoyer des fichiers audio et d'en extraire des informations grâce à l'IA.

---

## 📋 Table des matières

- [Description](#description)
- [Architecture](#architecture)
- [Fonctionnalités](#fonctionnalités)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Lancement](#lancement)
- [Structure du projet](#structure-du-projet)
- [API Endpoints](#api-endpoints)

---

## 📌 Description

**Mary Audio** est une application full-stack de traitement audio qui combine :
- **Whisper** (OpenAI) pour la transcription automatique de la parole
- **n8n** comme orchestrateur de workflows
- **Ollama + Mistral** pour l'analyse IA locale (résumé, sujet, correction de texte)
- **Flask** pour le backend Python de traitement audio
- **Node.js/Express** comme API Gateway
- **React** pour l'interface utilisateur

---

## 🏗️ Architecture

```
Frontend React (port 3000)
        ↓
Backend Node.js Express (port 3005)
        ↓
n8n Workflow Engine (port 5678) [Docker]
        ↓
Backend Python Flask (port 5000)
        ↓
Ollama LLM local (port 11434)
```

---

## ✨ Fonctionnalités

| Fonctionnalité | Description |
|---|---|
| 🎙️ **Transcription** | Convertit un fichier audio en texte avec Whisper |
| 🗜️ **Compression** | Réduit la taille du fichier audio (16kHz, mono, 8-bit) |
| 🔄 **Conversion** | Convertit un fichier audio en MP3 |
| 🧹 **Nettoyage** | Supprime le bruit de fond avec noisereduce |
| 📄 **Info** | Extrait le résumé, le sujet et le texte corrigé via IA (Ollama/Mistral) |
| 📊 **Métriques** | Calcule le WER (Word Error Rate) et CER (Character Error Rate) |

---

## 🛠️ Prérequis

Assurez-vous d'avoir installé les outils suivants :

- [Node.js](https://nodejs.org) v18+ 
- [Python](https://python.org) 3.8+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Ollama](https://ollama.com/download/windows)
- Git

---

## ⚙️ Installation

### 1. Cloner le projet

```bash
git clone https://github.com/votre-username/mary-audio.git
cd mary-audio
```

### 2. Installer les dépendances Python (Flask)

```bash
cd backend-python
pip install flask flask-restful openai-whisper librosa soundfile noisereduce pydub jiwer
```

### 3. Installer les dépendances Node.js

```bash
cd backend-node
npm install
```

### 4. Installer les dépendances React

```bash
cd frontend
npm install
```

### 5. Télécharger le modèle Ollama

```bash
ollama pull mistral
```

---

## 🚀 Lancement

> ⚠️ **Important** : Lancez les services dans cet ordre exact, chacun dans un terminal séparé.

### Terminal 1 — Docker Desktop
Ouvrez **Docker Desktop** et attendez que l'icône soit verte ✅

### Terminal 2 — n8n (via Docker)

```bash
docker run -it --rm --name n8n \
  -p 5678:5678 \
  -v C:\Users\marye\.n8n:/home/node/.n8n \
  -v C:\Users\marye\.n8n-binary:/home/node/.n8n/binaryData \
  n8nio/n8n
```

✅ Accès à n8n : **http://localhost:5678**

> 💡 Importez votre workflow depuis le fichier `workflow/audio-workflow.json` si c'est la première fois.

### Terminal 3 — Ollama

```bash
$env:OLLAMA_HOST="0.0.0.0"
ollama serve
```

✅ Ollama tourne sur : **http://localhost:11434**

### Terminal 4 — Backend Python Flask

```bash
cd backend-python
python main.py
```

✅ Flask tourne sur : **http://localhost:5000**

### Terminal 5 — Backend Node.js

```bash
cd backend-node
node server.js
```

✅ Node.js tourne sur : **http://localhost:3005**

### Terminal 6 — Frontend React

```bash
cd frontend
npm run dev
```

✅ Application disponible sur : **http://localhost:3000**

---

## 📁 Structure du projet

```
mary-audio/
│
├── backend-python/          # Backend Flask (traitement audio)
│   ├── main.py              # Point d'entrée Flask
│   ├── process_audio.py     # Transcription Whisper
│   ├── audio_utils.py       # Compression, conversion, nettoyage
│   ├── tts_generator.py     # Text-to-Speech
│   └── uploads/             # Fichiers audio temporaires
│
├── backend-node/            # API Gateway Node.js
│   ├── server.js            # Point d'entrée Express
│   ├── routes/
│   │   ├── transcriptionRouter.js
│   │   └── compressionRouter.js
│   ├── controllers/
│   │   ├── transcriptionController.js
│   │   └── compressionController.js
│   └── models/
│       ├── TranscriptionModel.js
│       └── CompressionModel.js
│
├── frontend/                # Interface React
│   ├── src/
│   │   ├── components/
│   │   │   ├── MyNavbar.jsx
│   │   │   ├── ResponsiveMenu.jsx
│   │   │   ├── TranscriptionModal.jsx
│   │   │   ├── CompressionModal.jsx
│   │   │   ├── ConversionModal.jsx
│   │   │   ├── CleanModal.jsx
│   │   │   ├── InfoModal.jsx
│   │   │   └── MetricsModal.jsx
│   │   └── pages/
│   │       └── treatments.jsx
│   └── package.json
│
├── workflow/
│   └── audio-workflow.json  # Export du workflow n8n
│
└── README.md
```

---

## 🔌 API Endpoints

### Backend Python Flask (port 5000)

| Méthode | Endpoint | Description |
|---|---|---|
| POST | `/transcribe` | Transcription audio → texte |
| POST | `/compress` | Compression du fichier audio |
| POST | `/convert` | Conversion audio en MP3 |
| POST | `/clean` | Nettoyage du bruit de fond |
| POST | `/metrics` | Calcul WER/CER |
| GET | `/helloworld` | Test de santé |

### Backend Node.js (port 3005)

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/ping` | Test de santé |
| POST | `/audio?operation=transcription` | Transcription |
| POST | `/audio?operation=compression` | Compression |
| POST | `/audio?operation=conversion` | Conversion |
| POST | `/audio?operation=clean` | Nettoyage |
| POST | `/audio?operation=info` | Extraction d'informations IA |
| POST | `/audio?operation=metrics` | Métriques WER/CER |

### n8n Webhook (port 5678)

| Méthode | Endpoint | Description |
|---|---|---|
| POST | `/webhook/audio?action=transcription` | Route transcription |
| POST | `/webhook/audio?action=compression` | Route compression |
| POST | `/webhook/audio?action=conversion` | Route conversion |
| POST | `/webhook/audio?action=clean` | Route nettoyage |
| POST | `/webhook/audio?action=info` | Route info IA |
| POST | `/webhook/audio?action=metrics` | Route métriques |

---

## 🤖 Technologies utilisées

| Technologie | Rôle |
|---|---|
| React + Flowbite | Interface utilisateur |
| Node.js + Express | API Gateway |
| Python + Flask | Backend traitement audio |
| Whisper (OpenAI) | Transcription automatique |
| n8n | Orchestration des workflows |
| Ollama + Mistral | IA locale (résumé, sujet, correction) |
| librosa + noisereduce | Traitement du signal audio |
| pydub | Compression et conversion audio |
| Docker | Conteneurisation de n8n |

---

## 👩‍💻 Auteur

**Maryem Bourourou** — Mary Audio © 2025