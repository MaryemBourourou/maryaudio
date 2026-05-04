const FormData = require("form-data");
const axios = require("axios");
const fs = require("fs");
const path = require('path');


// Route de test pour vérifier que l'API fonctionne
const ping = (req, res) => {
  console.log("✅ Ping reçu !");
  res.send("ping");
};

// Traitement unifié pour audio (transcription ET compression)
const processAudio = async (req, res) => {
  const operation = req.query.operation;

  try {
    console.log(`✅ Requête ${operation} reçue !`);

    // Vérification des paramètres
    if (!operation || !['transcription', 'compression','conversion','clean','info','metrics'].includes(operation)) {
      return res.status(400).json({ error: "Opération invalide. Utilisez 'transcription' ou 'compression' ou 'conversion' ou 'clean'ou 'info'ou 'metrics'." });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier audio fourni." });
    }

    const audioPath = req.file.path;
    const originalName = req.file.originalname;
   const form = new FormData();
form.append("file", fs.createReadStream(audioPath), {
  filename: originalName,
  knownLength: fs.statSync(audioPath).size  // ← ajouter ceci
});

    const n8nUrl = `http://host.docker.internal:5678/webhook/audio?action=${operation}`;

    if (operation === 'compression' || operation === 'conversion'|| operation === 'clean') {
      console.log(`📦 ${operation} demandée, envoi vers n8n...`);

      try {
        const fileResponse = await axios.post(n8nUrl, form, {
          headers: form.getHeaders(),
          responseType: 'arraybuffer',
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        });

        fs.unlinkSync(audioPath);
        

        let outputName;

        if (operation === 'conversion'|| operation === 'clean') {
          const baseName = path.parse(originalName).name; // retire toute extension
          if(operation==="conversion"){
          outputName = `${baseName}_converted.mp3`;}else {
            outputName = `${baseName}_cleaned.mp3`;
          }
        } else if (operation === 'compression') {
          const baseName = path.basename(originalName); // garde le nom tel quel
           outputName = `${baseName.replace(/\.[^/.]+$/, "")}_compressed.wav`;
        }


        res.setHeader('Content-Type', 'audio/wav');
        res.setHeader('Content-Disposition', `attachment; filename="${outputName}"`);
        res.setHeader('Content-Length', fileResponse.data.byteLength);
        res.setHeader('Cache-Control', 'no-cache');

        res.send(Buffer.from(fileResponse.data));
        console.log(`✅ ${operation} envoyé avec succès`);
        return;

      } catch (err) {
       console.error(`❌ Erreur ${operation} :`, err.response?.data || err.message);
        if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
        return res.status(500).json({ error: `Erreur lors de la ${operation}`, details: err.message });
      }
    }
    // 🔍 Traitement spécial pour l'opération "info"
if (operation === 'info') {
  console.log("📄 Extraction d'informations demandée, envoi vers n8n...");

  try {
    const infoResponse = await axios.post(n8nUrl, form, {
      headers: form.getHeaders()
    });

    fs.unlinkSync(audioPath);

    // On renvoie directement la réponse JSON reçue de n8n
    return res.json({
      operation,
      success: true,
      texte_corrige: infoResponse.data.texte_corrige,
      resume: infoResponse.data.resume,
      sujet: infoResponse.data.sujet
    });

  } catch (err) {
    console.error(`❌ Erreur info :`, err.message);
    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
    return res.status(500).json({ error: "Erreur lors de l'extraction d'informations", details: err.message });
  }
}
 // 📊 Opération METRICS
    if (operation === 'metrics') {
      console.log("📊 Calcul des métriques demandé, envoi vers n8n...");

      try {
        const metricsResponse = await axios.post(n8nUrl, form, {
          headers: form.getHeaders()
        });

        fs.unlinkSync(audioPath);

        return res.json({
          operation,
          success: true,
          cer: metricsResponse.data.cer,
          wer: metricsResponse.data.wer
        });

      } catch (err) {
        console.error(`❌ Erreur metrics :`, err.message);
        if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
        return res.status(500).json({ error: "Erreur lors du calcul des métriques", details: err.message });
      }
    }

    // Pour la transcription
    const response = await axios.post(n8nUrl, form, {
      headers: form.getHeaders(),
      timeout: 300000 ,// 5 minutes,
      maxContentLength: Infinity,
     maxBodyLength: Infinity
    });

    fs.unlinkSync(audioPath);

    res.json({
      operation,
      success: true,
      result: response.data
    });

  } catch (error) {
    console.error(`❌ Erreur traitement ${operation} :`, error.message);

    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      operation: operation || 'unknown',
      success: false,
      error: error.message || "Erreur lors du traitement audio"
    });
  }
};


// Pour compatibilité avec tes routes existantes
const transcribe = async (req, res) => {
  req.query.operation = 'transcription';
  await processAudio(req, res);
};

const compress = async (req, res) => {
  req.query.operation = 'compression';
  await processAudio(req, res);
};
const conversion = async (req, res) => {
  req.query.operation = 'conversion';
  await processAudio(req, res);
};
const clean = async (req, res) => {
  req.query.operation = 'clean';
  await processAudio(req, res);
};
const info = async (req, res) => {
  req.query.operation = 'info';
  await processAudio(req, res);
};
const metrics = async (req, res) => {
  req.query.operation = 'metrics';
  await processAudio(req, res);
};
module.exports = {
  ping,
  processAudio,
  transcribe,
  compress,
  conversion,
  clean,
  info,
  metrics
};