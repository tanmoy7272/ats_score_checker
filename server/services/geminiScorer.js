const { matchArrays, matchArraysKeywords } = require('../utils/arrayOverlap');
const { fuzzyTextMatch } = require('../utils/fuzzyMatch');
const { areSynonyms } = require('../utils/synonymNormalizer');

/**
 * Simple deterministic matcher - no AI scoring
 * Returns 0, 0.5, or 1 for each parameter
 */
function getParameterMatches(resumeFeatures, jobFeatures) {
  const matches = {};
  
  // Arrays - use overlap ratio
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
  
  // Text - use fuzzy + synonyms
  const jobTitle = jobFeatures.title || '';
  const resumeTitle = resumeFeatures.title || '';
  if (!jobTitle || !resumeTitle) {
    matches.title = 0;
  } else if (areSynonyms(jobTitle, resumeTitle, 'title')) {
    matches.title = 1;
  } else {
    matches.title = fuzzyTextMatch(jobTitle, resumeTitle);
  }
  
  const jobIndustry = jobFeatures.industry || '';
  const resumeIndustry = resumeFeatures.industry || '';
  if (!jobIndustry || !resumeIndustry) {
    matches.industry = 0;
  } else if (areSynonyms(jobIndustry, resumeIndustry, 'industry')) {
    matches.industry = 1;
  } else {
    matches.industry = fuzzyTextMatch(jobIndustry, resumeIndustry);
  }
  
  const jobEduLevel = jobFeatures.educationLevel || '';
  const resumeEduLevel = resumeFeatures.educationLevel || '';
  if (!jobEduLevel || !resumeEduLevel) {
    matches.educationLevel = 0;
  } else if (areSynonyms(jobEduLevel, resumeEduLevel, 'education')) {
    matches.educationLevel = 1;
  } else {
    matches.educationLevel = fuzzyTextMatch(jobEduLevel, resumeEduLevel);
  }
  
  const jobEduField = jobFeatures.educationField || '';
  const resumeEduField = resumeFeatures.educationField || '';
  if (!jobEduField || !resumeEduField) {
    matches.educationField = 0;
  } else {
    matches.educationField = fuzzyTextMatch(jobEduField, resumeEduField);
  }
  
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
  
  // Quality indicators - presence check
  matches.projectRelevance = (resumeFeatures.projects && resumeFeatures.projects.length > 0) ? 1 : 0;
  matches.portfolio = resumeFeatures.portfolio ? 1 : 0;
  
  // Skill coverage ratio
  const totalJobSkills = (jobFeatures.coreSkills || []).length + (jobFeatures.secondarySkills || []).length;
  const totalResumeSkills = (resumeFeatures.coreSkills || []).length + (resumeFeatures.secondarySkills || []).length;
  if (totalJobSkills === 0 || totalResumeSkills === 0) {
    matches.skillCoverage = 0;
  } else if (totalResumeSkills >= totalJobSkills) {
    matches.skillCoverage = 1;
  } else if (totalResumeSkills >= totalJobSkills * 0.6) {
    matches.skillCoverage = 0.5;
  } else {
    matches.skillCoverage = 0;
  }
  
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
