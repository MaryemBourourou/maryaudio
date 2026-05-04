const express = require("express");
const multer = require("multer");
const compressionController = require("../controllers/compressionController");

const router = express.Router();

// Configuration multer pour l'upload de fichiers
const upload = multer({ dest: "uploads/" });

// Route pour la compression audio
router.post("/compress", upload.single("audio"), compressionController.compress);

module.exports = router;