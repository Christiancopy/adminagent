const { saveInteraction } = require('../database/db');
const { translateText } = require('../services/aiService');

async function handleTranslateRequest(req, res, next) {
  try {
    const { text, sourceLanguage = 'auto', targetLanguage } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Le champ "text" est requis.' });
    }

    if (!targetLanguage || typeof targetLanguage !== 'string') {
      return res.status(400).json({ error: 'Le champ "targetLanguage" est requis.' });
    }

    const aiResult = await translateText({ text, sourceLanguage, targetLanguage });

    saveInteraction({
      endpoint: '/translate',
      userInput: text,
      aiOutput: aiResult.text,
      language: targetLanguage
    });

    return res.json({
      sourceLanguage,
      targetLanguage,
      translatedText: aiResult.text
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  handleTranslateRequest
};
