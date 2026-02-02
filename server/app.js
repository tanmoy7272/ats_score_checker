
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const healthRoutes = require('./routes/healthRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const jobRoutes = require('./routes/jobRoutes');
const scoreRoutes = require('./routes/scoreRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security: Basic Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: { error: 'Too many requests, please try again later.' }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/', limiter);

// Routes
app.use('/health', healthRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/job', jobRoutes);
app.use('/api/score', scoreRoutes);

// Centralized Error Handling
app.use(errorHandler);

module.exports = app;
