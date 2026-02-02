
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

// POST /api/job/analyze
router.post('/analyze', jobController.analyzeJob);

module.exports = router;
