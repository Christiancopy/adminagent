const axios = require('axios');

const AI_BASE_URL = process.env.AI_BASE_URL || 'https://build.lewisnote.com/v1';
const AI_API_KEY = process.env.AI_API_KEY;
const DEFAULT_MODEL = process.env.DEFAULT_TEXT_MODEL || 'gpt-5.4-mini';

if (!AI_API_KEY) {
  console.warn('AI_API_KEY manquante dans .env');
}

const aiClient = axios.create({
  baseURL: AI_BASE_URL,
  headers: {
    Authorization: `Bearer ${AI_API_KEY}`,
    'Content-Type': 'application/json'
  },
  timeout: 60000
});

function extractTextFromChatResponse(data) {
  const content = data?.choices?.[0]?.message?.content;

  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((chunk) => {
        if (typeof chunk === 'string') return chunk;
        if (chunk?.type === 'text') return chunk.text || '';
        return '';
      })
      .join('')
      .trim();
  }

  return '';
}

async function chatCompletion(messages, options = {}) {
  const payload = {
    model: options.model || DEFAULT_MODEL,
    messages,
    reasoning_effort: options.reasoningEffort || 'medium'
  };

  if (typeof options.webSearch === 'boolean') {
    payload.web_search = options.webSearch;
  }

  const response = await aiClient.post('/chat/completions', payload);
  const text = extractTextFromChatResponse(response.data);

  return {
    text,
    raw: response.data
  };
}

async function generateAgentReply({ message, languageCode = 'fr' }) {
  const system = `Tu es un assistant administratif citoyen pour le Benin. Reponds simplement, en phrases courtes, avec des etapes pratiques. Si l'information exacte officielle manque, indique-le clairement et propose la meilleure orientation.`;

  const user = `Langue cible: ${languageCode}.\nQuestion utilisateur: ${message}`;

  return chatCompletion(
    [
      { role: 'system', content: system },
      { role: 'user', content: user }
    ],
    { reasoningEffort: 'medium' }
  );
}

async function translateText({ text, sourceLanguage = 'auto', targetLanguage = 'fr' }) {
  const system = 'Tu es un traducteur precis. Tu dois retourner uniquement le texte traduit, sans commentaire.';
  const user = `Traduis le texte suivant.\nLangue source: ${sourceLanguage}\nLangue cible: ${targetLanguage}\nTexte: ${text}`;

  return chatCompletion(
    [
      { role: 'system', content: system },
      { role: 'user', content: user }
    ],
    { reasoningEffort: 'low' }
  );
}

async function generateProcedure({ request, languageCode = 'fr' }) {
  const system = `Tu es un conseiller administratif pour le Benin. Reponds strictement en JSON valide avec ce schema: {"etapes":["..."],"documents":["..."],"conseils":["..."]}. Les elements doivent etre courts et pratiques.`;

  const user = `Langue cible: ${languageCode}.\nDemande: ${request}`;

  const result = await chatCompletion(
    [
      { role: 'system', content: system },
      { role: 'user', content: user }
    ],
    { reasoningEffort: 'medium' }
  );

  try {
    const parsed = JSON.parse(result.text);
    return { parsed, rawText: result.text };
  } catch (_error) {
    return {
      parsed: {
        etapes: ['Consultez le guichet ou service competent de votre commune.'],
        documents: ['Piece d identite valide', 'Formulaire de demande'],
        conseils: ['Verifiez les horaires officiels avant de vous deplacer.']
      },
      rawText: result.text
    };
  }
}

async function synthesizeSpeech({ text, lang = 'fr' }) {
  const response = await aiClient.post('/audio/afri-voice/tts', { text, lang });
  return response.data;
}

async function transcribeAudioFromUrl({ url, lang = 'fr' }) {
  const response = await aiClient.post('/audio/afri-asr/transcribe', { url, lang });
  return response.data;
}

module.exports = {
  generateAgentReply,
  translateText,
  generateProcedure,
  synthesizeSpeech,
  transcribeAudioFromUrl
};
