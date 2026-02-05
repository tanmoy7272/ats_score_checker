const { matchArrays, matchArraysKeywords } = require('../utils/arrayOverlap');
const { fuzzyTextMatch } = require('../utils/fuzzyMatch');
const { areSynonyms } = require('../utils/synonymNormalizer');

const VALID_TOOLS = ['git', 'github', 'gitlab', 'postman', 'vscode', 'npm', 'yarn', 'docker', 'kubernetes', 'jenkins', 'jira', 'ci/cd'];

const INDUSTRY_MAP = {
  'software': 'technology',
  'web': 'technology',
  'app': 'technology',
  'development': 'technology',
  'saas': 'technology',
  'it': 'technology',
  'information technology': 'technology',
  'tech': 'technology'
};

const TITLE_KEYWORDS = {
  'developer': ['web developer', 'software developer', 'full stack', 'frontend', 'backend', 'engineer'],
  'engineer': ['software engineer', 'web developer', 'developer', 'full stack'],
  'computer': ['it', 'technology', 'software', 'computer science', 'mca', 'bca']
};

function normalizeIndustry(industry) {
  if (!industry) return '';
  const lower = industry.toLowerCase().trim();
  for (const [key, normalized] of Object.entries(INDUSTRY_MAP)) {
    if (lower.includes(key)) return normalized;
  }
  return lower;
}

function filterTools(tools) {
  if (!Array.isArray(tools)) return [];
  return tools.filter(tool => {
    const lower = tool.toLowerCase();
    return VALID_TOOLS.some(valid => lower.includes(valid) || valid.includes(lower)) && !lower.includes('api');
  });
}

function lenientTextMatch(text1, text2, keywords) {
  if (!text1 || !text2) return 0;
  const t1 = text1.toLowerCase().trim();
  const t2 = text2.toLowerCase().trim();
  
  if (t1 === t2) return 1;
  if (t1.includes(t2) || t2.includes(t1)) return 1;
  
  if (keywords) {
    for (const [key, similar] of Object.entries(keywords)) {
      const in1 = t1.includes(key) || similar.some(s => t1.includes(s));
      const in2 = t2.includes(key) || similar.some(s => t2.includes(s));
      if (in1 && in2) return 1;
    }
  }
  
  const fuzzy = fuzzyTextMatch(t1, t2);
  return fuzzy >= 0.4 ? (fuzzy >= 0.7 ? 1 : 0.5) : 0;
}

function computeSkillCoverage(resumeSkills, jobSkills) {
  const resume = [...(resumeSkills.coreSkills || []), ...(resumeSkills.secondarySkills || [])];
  const job = [...(jobSkills.coreSkills || []), ...(jobSkills.secondarySkills || [])];
  
  if (job.length === 0) return 0;
  
  const resumeSet = new Set(resume.map(s => s.toLowerCase().trim()));
  const intersection = job.filter(skill => resumeSet.has(skill.toLowerCase().trim()));
  const ratio = intersection.length / job.length;
  
  if (ratio >= 0.6) return 1;
  if (ratio >= 0.3) return 0.5;
  return 0;
}

/**
 * Simple deterministic matcher - no AI scoring
 * Returns 0, 0.5, or 1 for each parameter
 */
function getParameterMatches(resumeFeatures, jobFeatures) {
  const matches = {};
  
  const resumeTools = filterTools(resumeFeatures.tools || []);
  const jobTools = filterTools(jobFeatures.tools || []);
  
  // Arrays - use overlap ratio
  matches.coreSkills = matchArrays(jobFeatures.coreSkills || [], resumeFeatures.coreSkills || []);
  matches.secondarySkills = matchArrays(jobFeatures.secondarySkills || [], resumeFeatures.secondarySkills || []);
  matches.tools = matchArrays(jobTools, resumeTools);
  matches.responsibilities = matchArraysKeywords(jobFeatures.responsibilities || [], resumeFeatures.responsibilities || []);
  matches.keywords = matchArrays(jobFeatures.keywords || [], resumeFeatures.keywords || []);
  matches.softSkills = matchArrays(jobFeatures.softSkills || [], resumeFeatures.softSkills || []);
  matches.certifications = matchArrays(jobFeatures.certifications || [], resumeFeatures.certifications || []);
  matches.leadership = matchArrays(jobFeatures.leadership || [], resumeFeatures.leadership || []);
  matches.toolProficiency = matchArrays(jobFeatures.toolProficiency || [], resumeFeatures.toolProficiency || []);
  matches.achievements = matchArrays(jobFeatures.achievements || [], resumeFeatures.achievements || []);
  
  // Numbers - experience
  const reqRelevant = jobFeatures.relevantExperience || 0;
  const candRelevant = resumeFeatures.relevantExperience || 0;
  if (!reqRelevant) {
    matches.relevantExperience = 0;
  } else if (candRelevant >= reqRelevant) {
    matches.relevantExperience = 1;
  } else if (candRelevant >= reqRelevant * 0.7) {
    matches.relevantExperience = 0.5;
  } else {
    matches.relevantExperience = 0;
  }
  
  const reqTotal = jobFeatures.totalExperience || 0;
  const candTotal = resumeFeatures.totalExperience || 0;
  if (!reqTotal) {
    matches.totalExperience = 0;
  } else if (candTotal >= reqTotal) {
    matches.totalExperience = 1;
  } else if (candTotal >= reqTotal * 0.7) {
    matches.totalExperience = 0.5;
  } else {
    matches.totalExperience = 0;
  }
  
  // Text - use lenient matching
  matches.title = lenientTextMatch(resumeFeatures.title, jobFeatures.title, TITLE_KEYWORDS);
  
  const resumeInd = normalizeIndustry(resumeFeatures.industry);
  const jobInd = normalizeIndustry(jobFeatures.industry);
  if (!jobInd || !resumeInd) {
    matches.industry = 0;
  } else if (resumeInd === jobInd) {
    matches.industry = 1;
  } else {
    matches.industry = lenientTextMatch(resumeInd, jobInd);
  }
  
  matches.educationLevel = lenientTextMatch(resumeFeatures.educationLevel, jobFeatures.educationLevel, TITLE_KEYWORDS);
  matches.educationField = lenientTextMatch(resumeFeatures.educationField, jobFeatures.educationField, TITLE_KEYWORDS);
  
  // Location
  const jobCity = jobFeatures.city || '';
  const resumeCity = resumeFeatures.city || '';
  if (!jobCity || !resumeCity) {
    matches.city = 0;
  } else {
    matches.city = fuzzyTextMatch(jobCity, resumeCity);
  }
  
  const jobCountry = jobFeatures.country || '';
  const resumeCountry = resumeFeatures.country || '';
  if (!jobCountry || !resumeCountry) {
    matches.country = 0;
  } else {
    matches.country = fuzzyTextMatch(jobCountry, resumeCountry);
  }
  
  // Direct text comparison
  const jobRemote = jobFeatures.remotePreference || '';
  const resumeRemote = resumeFeatures.remotePreference || '';
  if (!jobRemote || !resumeRemote) {
    matches.remotePreference = 0;
  } else {
    matches.remotePreference = fuzzyTextMatch(jobRemote, resumeRemote);
  }
  
  const jobEmpType = jobFeatures.employmentType || '';
  const resumeEmpType = resumeFeatures.employmentType || '';
  if (!jobEmpType || !resumeEmpType) {
    matches.employmentType = 0;
  } else {
    matches.employmentType = fuzzyTextMatch(jobEmpType, resumeEmpType);
  }
  
  // Quality indicators - lenient presence check
  const hasProjects = (resumeFeatures.projects && resumeFeatures.projects.length > 0) || 
                     (resumeFeatures.achievements && resumeFeatures.achievements.length > 0);
  const isDev = (jobFeatures.title || '').toLowerCase().includes('developer') || 
                (jobFeatures.title || '').toLowerCase().includes('engineer');
  
  if (hasProjects && isDev) {
    matches.projectRelevance = 0.5;
  } else if (hasProjects) {
    matches.projectRelevance = 1;
  } else {
    matches.projectRelevance = 0;
  }
  
  matches.portfolio = resumeFeatures.portfolio ? 1 : 0;
  
  // Skill coverage - always compute
  matches.skillCoverage = computeSkillCoverage(resumeFeatures, jobFeatures);
  
  // Quality assessments
  const skillRecency = resumeFeatures.skillRecency || '';
  matches.skillRecency = skillRecency.toLowerCase().includes('current') || skillRecency.toLowerCase().includes('recent') ? 1 : 0;
  
  const stability = resumeFeatures.employmentStability || '';
  matches.employmentStability = stability.toLowerCase().includes('stable') ? 1 : 0;
  
  const progression = resumeFeatures.careerProgression || '';
  matches.careerProgression = progression.toLowerCase().includes('growing') ? 1 : 0;
  
  const complexity = resumeFeatures.responsibilityComplexity || '';
  matches.responsibilityComplexity = complexity.toLowerCase().includes('high') ? 1 : 0;
  
  const structure = resumeFeatures.resumeStructure || '';
  matches.resumeStructure = structure.toLowerCase().includes('well') ? 1 : 0;
  
  const language = resumeFeatures.languageQuality || '';
  matches.languageQuality = language.toLowerCase().includes('excellent') || language.toLowerCase().includes('good') ? 1 : 0;
  
  // Notice period - simple presence check
  matches.noticePeriod = resumeFeatures.noticePeriod ? 1 : 0;
  
  return matches;
}

module.exports = { getParameterMatches };
