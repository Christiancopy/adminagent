const { saveInteraction } = require('../database/db');
const { synthesizeSpeech, transcribeAudioFromUrl } = require('../services/aiService');

function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (_error) {
    return false;
  }
}

async function handleTextToSpeechRequest(req, res, next) {
  try {
    const { text, lang = 'fr' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Le champ "text" est requis.' });
    }

    if (lang && typeof lang !== 'string') {
      return res.status(400).json({ error: 'Le champ "lang" doit etre une chaine.' });
    }

    const audioResult = await synthesizeSpeech({ text, lang });

    saveInteraction({
      endpoint: '/audio/tts',
      userInput: text,
      aiOutput: JSON.stringify(audioResult),
      intent: 'audio_tts',
      language: lang
    });

    return res.json({
      lang,
      result: audioResult
    });
  } catch (error) {
    return next(error);
  }
}

async function handleTranscribeRequest(req, res, next) {
  try {
    const { url, lang = 'fr' } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Le champ "url" est requis.' });
    }

    if (!isValidHttpUrl(url)) {
      return res.status(400).json({ error: 'Le champ "url" doit etre une URL http(s) valide.' });
    }

    if (lang && typeof lang !== 'string') {
      return res.status(400).json({ error: 'Le champ "lang" doit etre une chaine.' });
    }

    const transcriptionResult = await transcribeAudioFromUrl({ url, lang });

    saveInteraction({
      endpoint: '/audio/transcribe',
      userInput: url,
      aiOutput: JSON.stringify(transcriptionResult),
      intent: 'audio_transcription',
      language: lang
    });

    return res.json({
      lang,
      result: transcriptionResult
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  handleTextToSpeechRequest,
  handleTranscribeRequest
};
