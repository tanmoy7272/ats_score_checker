const { matchArrays, matchArraysKeywords, matchArraysTokenized } = require('../utils/arrayOverlap');
const { normalizeTokens } = require('../utils/normalizeTokens');
const { normalizeIndustry } = require('../utils/normalizeIndustry');
const { computeSkillCoverage } = require('../utils/computeSkillCoverage');
const { stripProficiency } = require('../utils/stripProficiency');
const { stemToken } = require('../utils/stemToken');
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

  if (label === 'Industry') {
    const resumeIndustry = normalizeIndustry(resumeValue);
    const jobIndustry = normalizeIndustry(jobValue);
    if (resumeIndustry && resumeIndustry === jobIndustry) {
      return { match: 1, reason: 'Industry match' };
    }
  }

  const resumeTokens = normalizeTokens([resumeValue]);
  const jobTokens = normalizeTokens([jobValue]);

  if (resumeTokens.length === 0 || jobTokens.length === 0) return { match: 0, reason: 'No data provided' };

  const resumeNorm = resumeTokens.join(' ');
  const jobNorm = jobTokens.join(' ');

  if (resumeNorm.includes(jobNorm) || jobNorm.includes(resumeNorm)) {
    return { match: 1, reason: 'Normalized include' };
  }

  const resumeSet = new Set(resumeTokens);
  const overlap = jobTokens.filter(t => resumeSet.has(t)).length;

  if (overlap > 0) return { match: 0.5, reason: 'Token overlap' };

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

function normalizeSoftSkillTokens(values) {
  const tokens = normalizeTokens(values || []);
  const stemmed = tokens.map(stemToken).filter(Boolean);
  return [...new Set(stemmed)];
}

function matchSoftSkills(required, candidate) {
  if (!required || !candidate || required.length === 0 || candidate.length === 0) {
    return { match: 0, reason: 'No data provided' };
  }

  const requiredTokens = normalizeSoftSkillTokens(required);
  const candidateTokens = normalizeSoftSkillTokens(candidate);

  if (requiredTokens.length === 0 || candidateTokens.length === 0) {
    return { match: 0, reason: 'No data provided' };
  }

  const requiredSet = new Set(requiredTokens);
  const candidateSet = new Set(candidateTokens);

  const intersection = new Set([...requiredSet].filter(t => candidateSet.has(t)));
  const matched = intersection.size;
  const total = requiredSet.size;
  const ratio = total === 0 ? 0 : matched / total;

  if (ratio >= 0.6) return { match: 1, reason: `Strong match (${matched}/${total})` };
  if (ratio >= 0.3) return { match: 0.5, reason: `Partial match (${matched}/${total})` };

  return { match: 0, reason: `Low overlap (${matched}/${total})` };
}

function getParameterMatches(resumeFeatures, jobFeatures) {
  const matches = {};
  
  matches.coreSkills = matchArraysTokenized(jobFeatures.coreSkills || [], resumeFeatures.coreSkills || []);
  matches.secondarySkills = matchArraysTokenized(jobFeatures.secondarySkills || [], resumeFeatures.secondarySkills || []);
  matches.tools = matchArraysTokenized(jobFeatures.tools || [], resumeFeatures.tools || []);
  matches.responsibilities = matchArraysTokenized(jobFeatures.responsibilities || [], resumeFeatures.responsibilities || []);
  matches.keywords = matchArraysTokenized(jobFeatures.keywords || [], resumeFeatures.keywords || []);
  matches.softSkills = matchSoftSkills(jobFeatures.softSkills || [], resumeFeatures.softSkills || []);
  matches.certifications = matchArrays(jobFeatures.certifications || [], resumeFeatures.certifications || []);
  matches.leadership = matchArrays(jobFeatures.leadership || [], resumeFeatures.leadership || []);
  const resumeTools = (resumeFeatures.toolProficiency || []).map(stripProficiency);
  const jobTools = (jobFeatures.toolProficiency || []).map(stripProficiency);
  matches.toolProficiency = matchArraysTokenized(jobTools, resumeTools);
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
  
  matches.skillCoverage = computeSkillCoverage(
    [...(resumeFeatures.coreSkills || []), ...(resumeFeatures.secondarySkills || [])],
    [...(jobFeatures.coreSkills || []), ...(jobFeatures.secondarySkills || [])]
  );
  
  matches.skillRecency = matchQuality(resumeFeatures.skillRecency, ['current', 'recent']);
  matches.employmentStability = matchQuality(resumeFeatures.employmentStability, ['stable']);
  matches.careerProgression = matchQuality(resumeFeatures.careerProgression, ['growing']);
  matches.responsibilityComplexity = matchQuality(resumeFeatures.responsibilityComplexity, ['high']);
  matches.resumeStructure = matchQuality(resumeFeatures.resumeStructure, ['well']);
  matches.languageQuality = matchQuality(resumeFeatures.languageQuality, ['excellent', 'good']);
  
  return matches;
}

module.exports = { getParameterMatches };
