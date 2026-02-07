const { normalizeTokens } = require('./normalizeTokens');

function computeSkillCoverage(resumeSkills, jobSkills) {
  const resumeArr = Array.isArray(resumeSkills) ? resumeSkills : [];
  const jobArr = Array.isArray(jobSkills) ? jobSkills : [];

  if (!jobArr.length) {
    return { match: 0, reason: 'No skills listed in job' };
  }

  const resumeNorm = normalizeTokens(resumeArr);
  const jobNorm = normalizeTokens(jobArr);

  const resumeSet = new Set(resumeNorm);
  const overlap = jobNorm.filter(t => resumeSet.has(t));
  const ratio = jobNorm.length ? overlap.length / jobNorm.length : 0;

  if (ratio >= 0.6) return { match: 1, reason: `${overlap.length}/${jobNorm.length} skills matched` };
  if (ratio >= 0.3) return { match: 0.5, reason: `Partial (${overlap.length}/${jobNorm.length})` };
  return { match: 0, reason: `Low overlap (${overlap.length}/${jobNorm.length})` };
}

module.exports = { computeSkillCoverage };
