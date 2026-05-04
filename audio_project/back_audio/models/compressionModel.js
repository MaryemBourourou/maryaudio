class CompressionModel {
  constructor() {
    // Configuration pour les futurs appels de données
    this.n8nUrl = "http://localhost:5678/webhook/audio?action=compression";
    
  }
  }

module.exports = new CompressionModel();