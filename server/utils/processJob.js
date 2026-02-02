
const { cleanText } = require('./cleanText');
const { SKILLS_DICTIONARY, DEGREE_KEYWORDS } = require('./extractFeatures');

/**
 * Processes a raw job description string and returns structured metadata.
 * 
 * @param {string} description - The raw JD text.
 * @returns {Object} - Cleaned and structured JD features.
 */
function processJobDescription(description) {
  if (!description) return null;

  // 1. Clean the text
  const cleanedText = cleanText(description);

  // 2. Extract Summary (First 500-700 chars)
  const summary = cleanedText.substring(0, 700);

  // 3. Extract Skills
  const extractedSkills = SKILLS_DICTIONARY.filter(skill => {
    const regex = new RegExp(`\\b${skill}\\b`, 'i');
    return regex.test(cleanedText);
  });

  // 4. Extract Experience Years
  const yearRegex = /(\d+)\+?\s*(years|yrs|year)/gi;
  let maxYears = 0;
  let match;

  while ((match = yearRegex.exec(cleanedText)) !== null) {
    const years = parseInt(match[1], 10);
    if (years > maxYears) {
      maxYears = years;
    }
  }

  // 5. Extract Degree Requirement
  let detectedDegree = null;
  for (const degree of DEGREE_KEYWORDS) {
    const regex = new RegExp(`\\b${degree}\\b`, 'i');
    if (regex.test(cleanedText)) {
      detectedDegree = degree;
      break;
    }
  }

  return {
    summary,
    skills: [...new Set(extractedSkills)],
    experienceYears: maxYears,
    degree: detectedDegree
  };
}

module.exports = {
  processJobDescription
};
