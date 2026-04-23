const express = require('express');
const { handleTranslateRequest } = require('../controllers/translateController');

const router = express.Router();

router.post('/', handleTranslateRequest);

module.exports = router;
