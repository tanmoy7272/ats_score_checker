
const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const resumeController = require('../controllers/resumeController');

// POST /api/resume/upload
// 'resume' is the field name expected in the multipart/form-data
router.post('/upload', upload.single('resume'), resumeController.uploadResume);

module.exports = router;
