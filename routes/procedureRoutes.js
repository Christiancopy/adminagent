const express = require('express');
const { handleProcedureRequest } = require('../controllers/procedureController');

const router = express.Router();

router.post('/', handleProcedureRequest);

module.exports = router;
