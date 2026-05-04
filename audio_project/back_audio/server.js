const express = require("express");
const cors = require("cors");
const transcriptionRoutes = require("./routes/transcriptionRouter");
const compressionRoutes = require("./routes/compressionRouter");

const app = express();

// Middleware global
app.use(cors());
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`🔍 ${new Date().toISOString()} - Requête: ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/", transcriptionRoutes);
app.use("/", compressionRoutes);

// Démarrage du serveur
app.listen(3005, () => {
  console.log("✅ Backend Node.js écoute sur http://localhost:3005");
});