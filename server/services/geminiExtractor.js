const { AIClient } = require('./aiClient');
const { cleanForAI } = require('../utils/cleanForAI');

const INVALID_TOOL_KEYWORDS = ['api', 'weather', 'map', 'locationiq', 'openmeteo', 'usgs', 'service'];

const CITY_COUNTRY_MAP = {
  'mumbai': 'India', 'delhi': 'India', 'bangalore': 'India', 'bengaluru': 'India',
  'pune': 'India', 'hyderabad': 'India', 'chennai': 'India', 'kolkata': 'India',
  'ahmedabad': 'India', 'jaipur': 'India', 'indore': 'India', 'noida': 'India',
  'gurgaon': 'India', 'gurugram': 'India', 'new york': 'USA', 'los angeles': 'USA',
  'chicago': 'USA', 'san francisco': 'USA', 'london': 'UK', 'manchester': 'UK',
  'toronto': 'Canada', 'sydney': 'Australia', 'singapore': 'Singapore'
};

const FEATURE_SCHEMA = `{
  "coreSkills": ["skill1", "skill2"],
  "secondarySkills": ["skill1"],
  "tools": ["tool1"],
  "title": "string",
  "relevantExperience": 0,
  "totalExperience": 0,
  "responsibilities": ["resp1"],
  "industry": "string",
  "projects": ["proj1"],
  "skillRecency": "Current|Recent|Outdated|",
  "toolProficiency": ["tool1"],
  "employmentStability": "Stable|Frequent Changes|Unknown|",
  "careerProgression": "Growing|Lateral|Declining|Unknown|",
  "responsibilityComplexity": "High|Medium|Low|",
  "leadership": ["lead1"],
  "educationLevel": "Bachelor|Master|PhD|",
  "educationField": "string",
  "certifications": ["cert1"],
  "portfolio": "string",
  "city": "string",
  "country": "string",
  "remotePreference": "Remote|Hybrid|Onsite|",
  "noticePeriod": "string",
  "employmentType": "Full-time|Contract|Part-time|",
  "keywords": ["kw1"],
  "softSkills": ["skill1"],
  "achievements": ["ach1"],
  "resumeStructure": "Well-structured|Basic|Poor|",
  "languageQuality": "Excellent|Good|Fair|"
}`;

const PROMPT_SINGLE = `Extract ATS hiring features into strict JSON. Follow schema exactly. Return JSON only.\n${FEATURE_SCHEMA}`;
const PROMPT_PAIR = `Extract ATS hiring features into strict JSON. Follow schema exactly. Return JSON only.\n{\n  "resume": ${FEATURE_SCHEMA},\n  "job": ${FEATURE_SCHEMA}\n}`;

const EMPTY_FEATURES = {
  coreSkills: [],
  secondarySkills: [],
  tools: [],
  title: '',
  relevantExperience: 0,
  totalExperience: 0,
  responsibilities: [],
  industry: '',
  projects: [],
  skillRecency: '',
  toolProficiency: [],
  employmentStability: '',
  careerProgression: '',
  responsibilityComplexity: '',
  leadership: [],
  educationLevel: '',
  educationField: '',
  certifications: [],
  portfolio: '',
  city: '',
  country: '',
  remotePreference: '',
  noticePeriod: '',
  employmentType: '',
  keywords: [],
  softSkills: [],
  achievements: [],
  resumeStructure: '',
  languageQuality: ''
};

function parseJsonFromText(text) {
  if (!text) {
    throw new Error('Empty AI response');
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      const slice = text.slice(start, end + 1)
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']');
      return JSON.parse(slice);
    }
    throw err;
  }
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function safeString(value) {
  return typeof value === 'string' && value !== 'Not detected' ? value : '';
}

function safeNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function compressText(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .slice(0, 6000);
}

function buildSafeText(text) {
  const cleaned = cleanForAI(text);
  if (cleaned) return compressText(cleaned);
  return compressText(text);
}

function extractProjectsFallback(text) {
  const projectKeywords = [
    'built', 'developed', 'implemented', 'created',
    'engineered', 'designed', 'architected', 'launched'
  ];

  return String(text || '')
    .split('.')
    .map(line => line.trim())
    .filter(Boolean)
    .filter(line => projectKeywords.some(k => line.toLowerCase().includes(k)))
    .slice(0, 5);
}

function normalizeFeatures(parsed, originalText) {
  const tools = safeArray(parsed.tools).filter(tool => {
    const lower = tool.toLowerCase();
    return !INVALID_TOOL_KEYWORDS.some(invalid => lower.includes(invalid));
  }).slice(0, 20);

  let relevantExp = safeNumber(parsed.relevantExperience);
  let totalExp = safeNumber(parsed.totalExperience);
  if (totalExp < relevantExp) {
    totalExp = relevantExp;
  }

  let industry = safeString(parsed.industry);
  if (!industry && originalText) {
    const lower = originalText.toLowerCase();
    const techKeywords = ['software', 'web', 'dev', 'app', 'code', 'programming', 'engineer', 'tech', 'it'];
    if (techKeywords.some(kw => lower.includes(kw))) {
      industry = 'Technology';
    }
  }

  let city = safeString(parsed.city);
  let country = safeString(parsed.country);
  if (city && !country) {
    const cityLower = city.toLowerCase().trim();
    country = CITY_COUNTRY_MAP[cityLower] || '';
  }

  const projects = safeArray(parsed.projects).slice(0, 10);
  const fallbackProjects = extractProjectsFallback(originalText);
  const resolvedProjects = projects.length > 0
    ? projects
    : (fallbackProjects.length > 0 ? fallbackProjects : ['General development experience detected']);

  return {
    coreSkills: safeArray(parsed.coreSkills).slice(0, 30),
    secondarySkills: safeArray(parsed.secondarySkills).slice(0, 30),
    tools,
    title: safeString(parsed.title),
    relevantExperience: relevantExp,
    totalExperience: totalExp,
    responsibilities: safeArray(parsed.responsibilities).slice(0, 10),
    industry,
    projects: resolvedProjects,
    skillRecency: safeString(parsed.skillRecency),
    toolProficiency: safeArray(parsed.toolProficiency).slice(0, 20),
    employmentStability: safeString(parsed.employmentStability),
    careerProgression: safeString(parsed.careerProgression),
    responsibilityComplexity: safeString(parsed.responsibilityComplexity),
    leadership: safeArray(parsed.leadership).slice(0, 10),
    educationLevel: safeString(parsed.educationLevel),
    educationField: safeString(parsed.educationField),
    certifications: safeArray(parsed.certifications).slice(0, 10),
    portfolio: safeString(parsed.portfolio),
    city,
    country,
    remotePreference: safeString(parsed.remotePreference),
    noticePeriod: safeString(parsed.noticePeriod),
    employmentType: safeString(parsed.employmentType),
    keywords: safeArray(parsed.keywords).slice(0, 30),
    softSkills: safeArray(parsed.softSkills).slice(0, 15),
    achievements: safeArray(parsed.achievements).slice(0, 10),
    resumeStructure: safeString(parsed.resumeStructure),
    languageQuality: safeString(parsed.languageQuality)
  };
}

async function extractStructuredFeatures(text, isJD = false) {
  if (!text) {
    return { ...EMPTY_FEATURES };
  }

  try {
    const safeText = buildSafeText(text);

    const aiClient = new AIClient();
    const prompt = `${PROMPT_SINGLE}\n\nText:\n${safeText}`;
    const txt = await aiClient.generateContent(prompt);
    const clean = txt.replace(/```json|```/g, '').trim();
    const parsed = parseJsonFromText(clean);

    return normalizeFeatures(parsed || {}, text);
  } catch (err) {
    console.error('Feature extraction error:', err.message);
    return { ...EMPTY_FEATURES };
  }
}

async function extractStructuredFeaturesPair(resumeText, jobText) {
  if (!resumeText && !jobText) {
    return { resumeFeatures: { ...EMPTY_FEATURES }, jobFeatures: { ...EMPTY_FEATURES } };
  }

  try {
    const resumeInput = buildSafeText(resumeText);
    const jobInput = buildSafeText(jobText);

    const aiClient = new AIClient();
    const prompt = `${PROMPT_PAIR}\n\nResume:\n${resumeInput}\n\nJob:\n${jobInput}`;
    const txt = await aiClient.generateContent(prompt);
    const clean = txt.replace(/```json|```/g, '').trim();
    const parsed = parseJsonFromText(clean) || {};

    const resumeParsed = parsed.resume || {};
    const jobParsed = parsed.job || {};

    return {
      resumeFeatures: normalizeFeatures(resumeParsed, resumeText),
      jobFeatures: normalizeFeatures(jobParsed, jobText)
    };
  } catch (err) {
    console.error('Feature extraction error:', err.message);
    return { resumeFeatures: { ...EMPTY_FEATURES }, jobFeatures: { ...EMPTY_FEATURES } };
  }
}

module.exports = { extractStructuredFeatures, extractStructuredFeaturesPair };
