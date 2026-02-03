
const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');

// POST /api/score (legacy AI scorer)
router.post('/', scoreController.calculateScore);

// POST /api/score/v2 (deterministic scoring engine)
router.post('/v2', scoreController.calculateScoreV2);

module.exports = router;
