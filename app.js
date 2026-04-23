require('dotenv').config();
const express = require('express');
const { initDatabase } = require('./database/db');
const agentRoutes = require('./routes/agentRoutes');
const translateRoutes = require('./routes/translateRoutes');
const procedureRoutes = require('./routes/procedureRoutes');
const audioRoutes = require('./routes/audioRoutes');

const app = express();

app.use(express.json());

initDatabase();

app.get('/', (_req, res) => {
  res.json({
    service: 'Assistant Administratif Citoyen',
    status: 'running',
    endpoints: ['/health', '/agent', '/translate', '/procedure', '/audio/tts', '/audio/transcribe']
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Assistant Administratif Citoyen' });
});

app.use('/agent', agentRoutes);
app.use('/translate', translateRoutes);
app.use('/procedure', procedureRoutes);
app.use('/audio', audioRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Erreur interne du serveur.' });
});

module.exports = app;
