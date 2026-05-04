const FormData = require("form-data");
const axios = require("axios");
const fs = require("fs");

// Traitement de la compression audio
const compress = async (req, res) => {
  try {
    console.log("✅ Requête compress reçue !");
    
    // Vérifier si un fichier a été uploadé
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier audio fourni" });
    }

    const audioPath = req.file.path;

    // Créer le FormData pour l'envoi à n8n
    const form = new FormData();
    form.append("audio", fs.createReadStream(audioPath), req.file.originalname);

    // URL n8n pour la compression (tu peux changer cette URL si différente)
  const n8nUrl = "http://localhost:5678/webhook/audio?action=compression";

    // Envoi de la requête à n8n
    const response = await axios.post(n8nUrl, form, {
      headers: form.getHeaders(),
      timeout: 60000 // 60 secondes car la compression peut prendre plus de temps
    });

    // Nettoyage du fichier temporaire
    fs.unlinkSync(audioPath);
    
    // Retourner la réponse
    res.json(response.data);
    
  } catch (error) {
    console.error("Erreur compression :", error);
    
    // Nettoyage du fichier en cas d'erreur
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Erreur lors du nettoyage du fichier :", unlinkError);
      }
    }
    
    res.status(500).json({ error: "Échec de la compression audio" });
  }
};

module.exports = {
  compress
};