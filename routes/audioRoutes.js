const express = require('express');
const {
  handleTextToSpeechRequest,
  handleTranscribeRequest
} = require('../controllers/audioController');

const router = express.Router();

router.post('/tts', handleTextToSpeechRequest);
router.post('/transcribe', handleTranscribeRequest);

module.exports = router;
