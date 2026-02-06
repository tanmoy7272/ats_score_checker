const weights = require('../config/weights');
const { getParameterMatches } = require('./geminiScorer');

function computeScore(resume, job) {
  const breakdown = getParameterMatches(resume, job);
  
  let total = 0;
  const detailedBreakdown = {};
  
  for (const param of Object.keys(weights)) {
    const matchData = breakdown[param] || { match: 0, reason: 'Not evaluated' };
    const matchValue = matchData.match || 0;
    const weight = weights[param];
    total += matchValue * weight;
    
    detailedBreakdown[param] = {
      resumeValue: resume[param],
      jobValue: job[param],
      match: matchValue,
      reason: matchData.reason || 'No reason provided'
    };
  }
  
  const finalScore = Math.round(total * 10000) / 100;
  
  return { finalScore, breakdown: detailedBreakdown };
}

module.exports = { computeScore }; 
