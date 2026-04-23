const { saveInteraction } = require('../database/db');
const { generateProcedure } = require('../services/aiService');
const { detectLanguageCode } = require('./agentController');

async function handleProcedureRequest(req, res, next) {
  try {
    const { request, language } = req.body;

    if (!request || typeof request !== 'string') {
      return res.status(400).json({ error: 'Le champ "request" est requis.' });
    }

    const languageCode = language || detectLanguageCode(request);
    const procedure = await generateProcedure({ request, languageCode });

    saveInteraction({
      endpoint: '/procedure',
      userInput: request,
      aiOutput: JSON.stringify(procedure.parsed),
      intent: 'administrative_procedure',
      language: languageCode
    });

    return res.json({
      language: languageCode,
      etapes: procedure.parsed.etapes || [],
      documents: procedure.parsed.documents || [],
      conseils: procedure.parsed.conseils || []
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  handleProcedureRequest
};
