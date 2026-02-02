
const { getAIScore } = require('../services/geminiScorer');

const calculateScore = async (req, res) => {
  try {
    const { resume, job } = req.body;

    if (!resume || !job) {
      return res.status(400).json({ error: 'Both resume and job features are required for scoring.' });
    }

    const aiResult = await getAIScore(resume, job);

    return res.status(200).json({
      success: true,
      result: aiResult
    });
  } catch (error) {
    console.error('Error in scoreController:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to calculate AI score.' 
    });
  }
};

module.exports = {
  calculateScore
};
