const { saveInteraction } = require('../database/db');
const { generateAgentReply } = require('../services/aiService');

const ADMIN_KEYWORDS = [
  'certificat',
  'acte',
  'naissance',
  'mariage',
  'casier',
  'carte',
  'legalisation',
  'passeport',
  'piece',
  'administratif',
  'mairie',
  'commune',
  'ministere',
  'dossier'
];

function detectIntent(message = '') {
  const normalized = message.toLowerCase();
  const isAdministrative = ADMIN_KEYWORDS.some((word) => normalized.includes(word));
  return isAdministrative ? 'administrative_request' : 'general_request';
}

function detectLanguageCode(message = '') {
  const normalized = message.toLowerCase();

  if (normalized.includes('yoruba') || normalized.includes('yo')) return 'yo';
  if (normalized.includes('fon')) return 'fon';
  if (normalized.includes('adja') || normalized.includes('ajg')) return 'ajg';

  return 'fr';
}

async function handleAgentRequest(req, res, next) {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Le champ "message" est requis.' });
    }

    const intent = detectIntent(message);
    const languageCode = detectLanguageCode(message);

    const aiResult = await generateAgentReply({
      message: intent === 'administrative_request'
        ? `Demande administrative: ${message}`
        : message,
      languageCode
    });

    saveInteraction({
      endpoint: '/agent',
      userInput: message,
      aiOutput: aiResult.text,
      intent,
      language: languageCode
    });

    return res.json({
      intent,
      language: languageCode,
      response: aiResult.text
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  handleAgentRequest,
  detectIntent,
  detectLanguageCode
};
