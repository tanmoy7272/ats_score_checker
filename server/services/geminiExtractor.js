const { AIClient } = require('./aiClient');

const INVALID_TOOL_KEYWORDS = ['api', 'weather', 'map', 'locationiq', 'openmeteo', 'usgs', 'service'];

const CITY_COUNTRY_MAP = {
  'mumbai': 'India', 'delhi': 'India', 'bangalore': 'India', 'bengaluru': 'India',
  'pune': 'India', 'hyderabad': 'India', 'chennai': 'India', 'kolkata': 'India',
  'ahmedabad': 'India', 'jaipur': 'India', 'indore': 'India', 'noida': 'India',
  'gurgaon': 'India', 'gurugram': 'India', 'new york': 'USA', 'los angeles': 'USA',
  'chicago': 'USA', 'san francisco': 'USA', 'london': 'UK', 'manchester': 'UK',
  'toronto': 'Canada', 'sydney': 'Australia', 'singapore': 'Singapore'
};

const PROMPT = `Extract structured JSON from resume or job description.
Return ONLY valid JSON matching this exact schema:
{
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
}

LIMITS:
- coreSkills: max 30
- secondarySkills: max 30
- tools: max 20
- responsibilities: max 10
- projects: max 10
- keywords: max 30
- softSkills: max 15
- achievements: max 10
- leadership: max 10
- certifications: max 10
- toolProficiency: max 20

RULES:
- Extract ONLY what exists
- Normalize equivalents: "B.Tech"/"BE" → "Bachelor", "React"/"ReactJS" → "React"
- Experience in months: convert to years (6 months = 0.5)
- If missing/unsure: [] or "" or 0
- NO explanations, NO analysis, ONLY JSON`;

function preprocessJD(text) {
  if (!text) return text;
  return text
    .replace(/^[\s\S]*?job\s+(description|summary|overview|role)?[:\s]*/i, '')
    .replace(/benefits?[\s]*[\s\S]{0,500}$/i, '')
    .replace(/legal.*?disclaimers?[\s\S]{0,300}$/i, '')
    .slice(0, 8000);
}

async function extractStructuredFeatures(text, isJD = false) {
  if (!text) {
    return {
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
  }

  try {
    const cleanText = isJD ? preprocessJD(text).slice(0, 6000) : text.slice(0, 10000);
    
    const aiClient = new AIClient();
    const prompt = `${PROMPT}\n\nText:\n${cleanText}`;
    const txt = await aiClient.generateContent(prompt);
    const clean = txt.replace(/```json|```/g, '').trim();

    const parsed = JSON.parse(clean);
    
    const tools = (parsed.tools || []).filter(tool => {
      const lower = tool.toLowerCase();
      return !INVALID_TOOL_KEYWORDS.some(invalid => lower.includes(invalid));
    }).slice(0, 20);
    
    let relevantExp = typeof parsed.relevantExperience === 'number' ? parsed.relevantExperience : 0;
    let totalExp = typeof parsed.totalExperience === 'number' ? parsed.totalExperience : 0;
    if (totalExp < relevantExp) {
      totalExp = relevantExp;
    }
    
    let industry = parsed.industry || '';
    if (!industry) {
      const lower = text.toLowerCase();
      const techKeywords = ['software', 'web', 'dev', 'app', 'code', 'programming', 'engineer', 'tech', 'it'];
      if (techKeywords.some(kw => lower.includes(kw))) {
        industry = 'Technology';
      }
    }
    
    let city = parsed.city || '';
    let country = parsed.country || '';
    if (city && !country) {
      const cityLower = city.toLowerCase().trim();
      country = CITY_COUNTRY_MAP[cityLower] || '';
    }
    
    return {
      coreSkills: (parsed.coreSkills || []).slice(0, 30),
      secondarySkills: (parsed.secondarySkills || []).slice(0, 30),
      tools,
      title: parsed.title || '',
      relevantExperience: relevantExp,
      totalExperience: totalExp,
      responsibilities: (parsed.responsibilities || []).slice(0, 10),
      industry,
      projects: (parsed.projects || []).slice(0, 10),
      skillRecency: parsed.skillRecency || '',
      toolProficiency: (parsed.toolProficiency || []).slice(0, 20),
      employmentStability: parsed.employmentStability || '',
      careerProgression: parsed.careerProgression || '',
      responsibilityComplexity: parsed.responsibilityComplexity || '',
      leadership: (parsed.leadership || []).slice(0, 10),
      educationLevel: parsed.educationLevel || '',
      educationField: parsed.educationField || '',
      certifications: (parsed.certifications || []).slice(0, 10),
      portfolio: parsed.portfolio || '',
      city,
      country,
      remotePreference: parsed.remotePreference || '',
      noticePeriod: parsed.noticePeriod || '',
      employmentType: parsed.employmentType || '',
      keywords: (parsed.keywords || []).slice(0, 30),
      softSkills: (parsed.softSkills || []).slice(0, 15),
      achievements: (parsed.achievements || []).slice(0, 10),
      resumeStructure: parsed.resumeStructure || '',
      languageQuality: parsed.languageQuality || ''
    };
  } catch (err) {
    console.error('Feature extraction error:', err.message);
    return {
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
  }
}

module.exports = { extractStructuredFeatures };
