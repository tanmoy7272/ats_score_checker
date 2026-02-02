
const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');

// POST /api/score
router.post('/', scoreController.calculateScore);

module.exports = router;
