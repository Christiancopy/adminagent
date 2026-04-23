const express = require('express');
const { handleAgentRequest } = require('../controllers/agentController');

const router = express.Router();

router.post('/', handleAgentRequest);

module.exports = router;
