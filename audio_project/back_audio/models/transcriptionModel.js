class TranscriptionModel {
  constructor() {
    // Configuration pour les futurs appels de données
    this.n8nUrl = "http://localhost:5678/webhook/audio?action=transcription";
    
  }
  }

module.exports = new TranscriptionModel();