
/**
 * Centralized error handling middleware.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.message}`);
  
  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large. Max size is 5MB.' });
  }
  
  if (err.message === 'INVALID_FILE_TYPE') {
    return res.status(400).json({ error: 'Invalid file type. Only PDF and DOCX are allowed.' });
  }

  // Fallback to generic server error
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(status).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;
