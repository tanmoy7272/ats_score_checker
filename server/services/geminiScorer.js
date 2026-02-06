const { matchArrays, matchArraysKeywords } = require('../utils/arrayOverlap');
const { fuzzyTextMatch } = require('../utils/fuzzyMatch');
const { areSimilar } = require('../utils/synonymNormalizer');

const TINY_NORM = {
  'it': 'technology', 'tech': 'technology', 'software': 'technology',
  'cs': 'computer', 'computer science': 'computer', 'computing': 'computer',
  'dev': 'developer', 'developer': 'developer', 'engineer': 'developer',
  'bachelor': 'bachelor', 'btech': 'bachelor', 'be': 'bachelor', 'bs': 'bachelor',
  'master': 'master', 'mtech': 'master', 'ms': 'master', 'mca': 'master',
  'web': 'web', 'frontend': 'web', 'backend': 'web', 'fullstack': 'web'
};

function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 1)
    .map(w => TINY_NORM[w] || w);
}

function matchExperience(candidate, required, label) {
  if (!required) return { match: 0, reason: 'Not required' };
  if (candidate >= required) return { match: 1, reason: `${candidate} years (meets ${required}+ required)` };
  if (candidate >= required * 0.6) return { match: 0.5, reason: `${candidate} years (below ${required} required)` };
  return { match: 0, reason: `${candidate} years (below ${required} required)` };
}

function matchText(resumeValue, jobValue, label) {
  if (!jobValue || !resumeValue) return { match: 0, reason: 'No data provided' };
  
  const rTokens = tokenize(resumeValue);
  const jTokens = tokenize(jobValue);
  
  if (rTokens.length === 0 || jTokens.length === 0) return { match: 0, reason: 'No data provided' };
  
  const rSet = new Set(rTokens);
  const overlap = jTokens.filter(t => rSet.has(t)).length;
  const ratio = overlap / jTokens.length;
  
  if (ratio >= 0.5) return { match: 1, reason: 'Strong overlap' };
  if (ratio >= 0.2 || overlap > 0) return { match: 0.5, reason: 'Partial overlap' };
  
  return { match: 0, reason: 'Different field' };
}

function matchBoolean(value, label) {
  if (value) return { match: 1, reason: 'Provided' };
  return { match: 0, reason: 'Not provided' };
}

function matchQuality(value, positiveKeywords) {
  if (!value) return { match: 0, reason: 'Not detected' };
  const lower = value.toLowerCase();
  const isPositive = positiveKeywords.some(kw => lower.includes(kw));
  if (isPositive) return { match: 1, reason: value };
  return { match: 0, reason: value };
}

function computeSkillCoverage(resumeFeatures, jobFeatures) {
  const resume = [...(resumeFeatures.coreSkills || []), ...(resumeFeatures.secondarySkills || [])];
  const job = [...(jobFeatures.coreSkills || []), ...(jobFeatures.secondarySkills || [])];
  
  if (job.length === 0) return { match: 0, reason: 'No skills required' };
  
  return matchArrays(job, resume);
}

function getParameterMatches(resumeFeatures, jobFeatures) {
  const matches = {};
  
  matches.coreSkills = matchArrays(jobFeatures.coreSkills || [], resumeFeatures.coreSkills || []);
  matches.secondarySkills = matchArrays(jobFeatures.secondarySkills || [], resumeFeatures.secondarySkills || []);
  matches.tools = matchArrays(jobFeatures.tools || [], resumeFeatures.tools || []);
  matches.responsibilities = matchArraysKeywords(jobFeatures.responsibilities || [], resumeFeatures.responsibilities || []);
  matches.keywords = matchArrays(jobFeatures.keywords || [], resumeFeatures.keywords || []);
  matches.softSkills = matchArrays(jobFeatures.softSkills || [], resumeFeatures.softSkills || []);
  matches.certifications = matchArrays(jobFeatures.certifications || [], resumeFeatures.certifications || []);
  matches.leadership = matchArrays(jobFeatures.leadership || [], resumeFeatures.leadership || []);
  matches.toolProficiency = matchArrays(jobFeatures.toolProficiency || [], resumeFeatures.toolProficiency || []);
  matches.achievements = matchArrays(jobFeatures.achievements || [], resumeFeatures.achievements || []);
  
  matches.relevantExperience = matchExperience(
    resumeFeatures.relevantExperience || 0,
    jobFeatures.relevantExperience || 0,
    'Relevant Experience'
  );
  
  matches.totalExperience = matchExperience(
    resumeFeatures.totalExperience || 0,
    jobFeatures.totalExperience || 0,
    'Total Experience'
  );
  
  matches.title = matchText(resumeFeatures.title, jobFeatures.title, 'Title');
  matches.industry = matchText(resumeFeatures.industry, jobFeatures.industry, 'Industry');
  matches.educationLevel = matchText(resumeFeatures.educationLevel, jobFeatures.educationLevel, 'Education Level');
  matches.educationField = matchText(resumeFeatures.educationField, jobFeatures.educationField, 'Education Field');
  
  matches.city = matchText(resumeFeatures.city, jobFeatures.city, 'City');
  matches.country = matchText(resumeFeatures.country, jobFeatures.country, 'Country');
  matches.remotePreference = matchText(resumeFeatures.remotePreference, jobFeatures.remotePreference, 'Remote Preference');
  matches.employmentType = matchText(resumeFeatures.employmentType, jobFeatures.employmentType, 'Employment Type');
  
  const hasProjects = (resumeFeatures.projects && resumeFeatures.projects.length > 0);
  if (hasProjects) {
    matches.projectRelevance = { match: 1, reason: `${resumeFeatures.projects.length} projects listed` };
  } else {
    matches.projectRelevance = { match: 0, reason: 'No projects listed' };
  }
  
  matches.portfolio = matchBoolean(resumeFeatures.portfolio, 'Portfolio');
  matches.noticePeriod = matchBoolean(resumeFeatures.noticePeriod, 'Notice Period');
  
  matches.skillCoverage = computeSkillCoverage(resumeFeatures, jobFeatures);
  
  matches.skillRecency = matchQuality(resumeFeatures.skillRecency, ['current', 'recent']);
  matches.employmentStability = matchQuality(resumeFeatures.employmentStability, ['stable']);
  matches.careerProgression = matchQuality(resumeFeatures.careerProgression, ['growing']);
  matches.responsibilityComplexity = matchQuality(resumeFeatures.responsibilityComplexity, ['high']);
  matches.resumeStructure = matchQuality(resumeFeatures.resumeStructure, ['well']);
  matches.languageQuality = matchQuality(resumeFeatures.languageQuality, ['excellent', 'good']);
  
  return matches;
}

module.exports = { getParameterMatches };
