const weights = require('../config/weights');
const { getParameterMatches } = require('./geminiScorer');

/**
 * Compute ATS score using simple deterministic math
 * No AI scoring - just weighted sum of parameter matches
 */
function computeScore(resume, job) {
  const breakdown = getParameterMatches(resume, job);
  
  // Calculate final score as weighted sum
  let total = 0;
  for (const param of Object.keys(weights)) {
    const matchValue = breakdown[param] !== undefined ? breakdown[param] : 0;
    const weight = weights[param];
    total += matchValue * weight;
  }
  
  // Convert to 0-100 scale
  const finalScore = Math.round(total * 10000) / 100;
  
  return { finalScore, breakdown };
}

module.exports = { computeScore }; 
