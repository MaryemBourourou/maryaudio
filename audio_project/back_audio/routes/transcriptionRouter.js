const express = require("express");
const multer = require("multer");
const transcriptionController = require("../controllers/transcriptionController");

const router = express.Router();

// Configuration multer pour l'upload de fichiers
const upload = multer({ dest: "uploads/" });

// Route de test
router.get("/ping", transcriptionController.ping);
router.post("/audio", upload.single("audio"), transcriptionController.processAudio);

// Route pour la transcription audio
router.post("/transcribe", upload.single("audio"), transcriptionController.transcribe);
router.post("/compress", upload.single("audio"), transcriptionController.compress);
router.post("/conversion", upload.single("audio"), transcriptionController.conversion);
router.post("/clean", upload.single("audio"), transcriptionController.clean);
router.post("/info", upload.single("audio"), transcriptionController.info);
router.post("/metrics", upload.single("audio"), transcriptionController.metrics);
module.exports = router;