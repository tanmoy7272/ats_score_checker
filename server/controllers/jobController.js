
const { processJobDescription } = require('../utils/processJob');

const analyzeJob = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return res.status(400).json({ error: 'Job description text is required.' });
    }

    const processedJob = processJobDescription(description);

    return res.status(200).json({
      success: true,
      job: processedJob
    });
  } catch (error) {
    console.error('Error in analyzeJob controller:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to process job description.' 
    });
  }
};

module.exports = {
  analyzeJob
};
