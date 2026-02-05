
const { extractStructuredFeatures } = require('../services/geminiExtractor');
const { computeScore } = require('../services/scoreEngine');
const { explain } = require('../services/geminiExplainer');

const calculateScore = async (req, res) => {
  try {
    const { resume, job } = req.body;

    if (!resume || !job) {
      return res.status(400).json({ error: 'Both resume and job features are required for scoring.' });
    }

    const { finalScore, breakdown } = computeScore(resume, job);

    return res.status(200).json({
      success: true,
      result: {
        score: finalScore,
        breakdown
      }
    });
  } catch (error) {
    console.error('Error in scoreController:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to calculate score.' 
    });
  }
};

const calculateScoreV2 = async (req, res) => {
  try {
    const { resumeText, jobText } = req.body;

    if (!resumeText || !jobText) {
      return res.status(400).json({ error: 'Both resumeText and jobText are required.' });
    }

    // 1. extract resume features
    const resumeFeatures = await extractStructuredFeatures(resumeText);

    // 2. extract job features
    const jobFeatures = await extractStructuredFeatures(jobText);

    // 3. compute deterministic score
    const { finalScore: score, breakdown } = computeScore(resumeFeatures, jobFeatures);

    console.log('Score calculation complete:');
    console.log('- Score:', score);
    console.log('- Breakdown keys:', Object.keys(breakdown).length);
    console.log('- Matched params:', Object.values(breakdown).filter(v => v === 1).length);

    // 4. generate explanation
    const explanation = await explain({ score, breakdown, resumeFeatures, jobFeatures });

    return res.status(200).json({
      score,
      breakdown,
      resumeFeatures,
      jobFeatures,
      reasons: explanation.reasons || [],
      improvements: explanation.improvements || []
    });
  } catch (error) {
    console.error('Error in calculateScoreV2:', error);
    
    // Extract meaningful error message
    let errorMessage = error.message || 'Failed to calculate score.';
    let statusCode = 500;
    
    // Handle OpenAI API errors
    if (error.status === 429) {
      errorMessage = 'API quota exceeded. Please check your billing or wait for quota reset.';
      statusCode = 429;
    } else if (error.status === 401) {
      errorMessage = 'Invalid API key. Please check your configuration.';
      statusCode = 401;
    } else if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    
    return res.status(statusCode).json({ 
      error: errorMessage,
      details: error.message 
    });
  }
};

module.exports = {
  calculateScore,
  calculateScoreV2
};
