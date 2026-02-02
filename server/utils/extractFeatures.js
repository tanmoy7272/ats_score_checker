
const SKILLS_DICTIONARY = [
  "react", "node", "express", "mongodb", "mysql", "python", "java",
  "docker", "aws", "kubernetes", "typescript", "nextjs", "redis",
  "html", "css", "git"
];

const DEGREE_KEYWORDS = ["btech", "be", "bachelor", "mtech", "master", "msc", "phd"];

/**
 * Extracts structured features from parsed resume sections.
 * 
 * @param {Object} parsedResume - The object containing fullText and section texts.
 * @returns {Object} - Extracted features (skills, experienceYears, degree).
 */
function extractResumeFeatures(parsedResume) {
  const { fullText } = parsedResume;
  
  // 1. Skill Extraction
  const extractedSkills = SKILLS_DICTIONARY.filter(skill => {
    const regex = new RegExp(`\\b${skill}\\b`, 'i');
    return regex.test(fullText);
  });

  // 2. Experience Extraction
  const yearRegex = /(\d+)\+?\s*(years|yrs|year)/gi;
  let maxYears = 0;
  let match;

  while ((match = yearRegex.exec(fullText)) !== null) {
    const years = parseInt(match[1], 10);
    if (years > maxYears) {
      maxYears = years;
    }
  }

  // 3. Degree Extraction
  let detectedDegree = null;

  for (const degree of DEGREE_KEYWORDS) {
    const regex = new RegExp(`\\b${degree}\\b`, 'i');
    if (regex.test(fullText)) {
      detectedDegree = degree;
      break;
    }
  }

  return {
    skills: [...new Set(extractedSkills)],
    experienceYears: maxYears,
    degree: detectedDegree
  };
}

module.exports = {
  extractResumeFeatures,
  SKILLS_DICTIONARY,
  DEGREE_KEYWORDS
};
