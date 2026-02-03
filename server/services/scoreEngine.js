const weights = require('../config/weights');

function toSet(arr) {
  return new Set((arr || []).map(s => String(s).toLowerCase().trim()).filter(Boolean));
}

function overlapRatio(a, b) {
  const A = toSet(a);
  const B = toSet(b);
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / Math.max(A.size, B.size);
}

function fuzzyTitleMatch(resumeTitle, jobTitle) {
  if (!resumeTitle || !jobTitle) return 0;
  const r = resumeTitle.toLowerCase();
  const j = jobTitle.toLowerCase();
  if (r === j) return 1;
  if (r.includes(j) || j.includes(r)) return 1;
  // partial token overlap
  const rt = new Set(r.split(/\W+/).filter(Boolean));
  const jt = new Set(j.split(/\W+/).filter(Boolean));
  let inter = 0;
  for (const t of rt) if (jt.has(t)) inter++;
  const ratio = inter / Math.max(rt.size || 1, jt.size || 1);
  return ratio >= 0.6 ? 1 : ratio >= 0.3 ? 0.5 : 0;
}

function scoreBucket(value) {
  if (value >= 0.8) return 1;
  if (value >= 0.35) return 0.5;
  return 0;
}

function experienceScore(resumeYears, requiredYears) {
  const r = Number(resumeYears || 0);
  const q = Number(requiredYears || 0);
  if (r >= q) return 1;
  if (Math.abs(r - q) <= 1) return 0.5;
  return 0;
}

function locationScore(resumeLoc, jobLoc) {
  if (!resumeLoc || !jobLoc) return 0;
  const rc = (resumeLoc.city || '').toLowerCase().trim();
  const rco = (resumeLoc.country || '').toLowerCase().trim();
  const jc = (jobLoc.city || '').toLowerCase().trim();
  const jco = (jobLoc.country || '').toLowerCase().trim();
  if (rc && jc && rc === jc) return 1;
  if (rco && jco && rco === jco) return 0.5;
  return 0;
}

function computeScore(resume, job) {
  const r = resume || {};
  const j = job || {};

  const breakdown = {};

  const skillsRatio = overlapRatio(r.skills, j.skills);
  breakdown.skills = scoreBucket(skillsRatio);

  const toolsRatio = overlapRatio(r.tools, j.tools);
  breakdown.tools = scoreBucket(toolsRatio);

  breakdown.title = fuzzyTitleMatch(r.title || '', j.title || '');
  breakdown.title = breakdown.title === 1 ? 1 : breakdown.title === 0.5 ? 0.5 : breakdown.title;
  if (breakdown.title !== 1 && breakdown.title !== 0.5) {
    breakdown.title = breakdown.title >= 0.5 ? 0.5 : 0;
  }

  breakdown.experience = experienceScore(r.yearsExperience, j.yearsExperience);

  breakdown.location = locationScore(r.location, j.location);

  const industryRatio = overlapRatio(r.industries, j.industries);
  breakdown.industry = scoreBucket(industryRatio);

  const educationRatio = overlapRatio(r.education, j.education);
  breakdown.education = scoreBucket(educationRatio);

  const certRatio = overlapRatio(r.certifications, j.certifications);
  breakdown.certification = scoreBucket(certRatio);

  const respRatio = overlapRatio(r.responsibilities, j.responsibilities);
  breakdown.responsibility = scoreBucket(respRatio);

  const kwRatio = overlapRatio(r.keywords, j.keywords);
  breakdown.keywords = scoreBucket(kwRatio);

  // Ensure keys exist for all expected params
  const expected = ['skills','tools','title','experience','location','industry','education','certification','responsibility','keywords'];
  for (const k of expected) if (breakdown[k] === undefined) breakdown[k] = 0;

  // deterministic final score
  let total = 0;
  for (const key of Object.keys(weights)) {
    const val = breakdown[key] || 0;
    total += val * weights[key];
  }
  const finalScore = Math.round(total * 10000) / 100; // two decimals

  return { finalScore, breakdown };
}

module.exports = { computeScore }; 
