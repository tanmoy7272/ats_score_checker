const { AIClient } = require('./aiClient');

// FIX 2: Valid dev tools only
const INVALID_TOOL_KEYWORDS = ['api', 'weather', 'map', 'locationiq', 'openmeteo', 'usgs', 'service'];

// FIX 6: City to country mapping
const CITY_COUNTRY_MAP = {
  'mumbai': 'India', 'delhi': 'India', 'bangalore': 'India', 'bengaluru': 'India',
  'pune': 'India', 'hyderabad': 'India', 'chennai': 'India', 'kolkata': 'India',
  'ahmedabad': 'India', 'jaipur': 'India', 'indore': 'India', 'noida': 'India',
  'gurgaon': 'India', 'gurugram': 'India', 'new york': 'USA', 'los angeles': 'USA',
  'chicago': 'USA', 'san francisco': 'USA', 'london': 'UK', 'manchester': 'UK',
  'toronto': 'Canada', 'sydney': 'Australia', 'singapore': 'Singapore'
};

const PROMPT = `You are an extractor. Given a resume or job description, return JSON only that matches this schema exactly:
{
  coreSkills: string[],
  secondarySkills: string[],
  tools: string[],
  title: string,
  relevantExperience: number,
  totalExperience: number,
  responsibilities: string[],
  industry: string,
  projects: string[],
  skillRecency: string,
  toolProficiency: string[],
  employmentStability: string,
  careerProgression: string,
  responsibilityComplexity: string,
  leadership: string[],
  educationLevel: string,
  educationField: string,
  certifications: string[],
  portfolio: string,
  city: string,
  country: string,
  remotePreference: string,
  noticePeriod: string,
  employmentType: string,
  keywords: string[],
  softSkills: string[],
  achievements: string[],
  resumeStructure: string,
  languageQuality: string
}

EXTRACTION RULES:
- Extract ONLY what exists in the text
- Normalize similar concepts (e.g., "B.Tech", "BE", "Bachelor of Engineering" → "Bachelor")
- Group equivalent terms (e.g., "Software Developer", "Web Developer" → use most common form)
- Extract tools/technologies from ANYWHERE in text (not just headers): Node.js, React, AWS, Docker, etc.
- Never hallucinate or infer
- If unsure or not present → return [] or "" or 0
- For experience: Parse "X months" as X/12 years (6 months = 0.5, 12 months = 1.0)
- For experience: relevantExperience = years in similar role, totalExperience = total career years
- For skillRecency: "Current", "Recent", "Outdated", or ""
- For employmentStability: "Stable", "Frequent Changes", "Unknown", or ""
- For careerProgression: "Growing", "Lateral", "Declining", "Unknown", or ""
- For responsibilityComplexity: "High", "Medium", "Low", or ""
- For educationLevel: "Bachelor", "Master", "PhD", or ""
- For remotePreference: "Remote", "Hybrid", "Onsite", or ""
- For employmentType: "Full-time", "Contract", "Part-time", or ""
- For resumeStructure: "Well-structured", "Basic", "Poor", or ""
- For languageQuality: "Excellent", "Good", "Fair", or ""

Return valid JSON only. No scoring, no explanations, no additional fields.`;

async function extractStructuredFeatures(text) {
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
    // FIX 1: Truncate text to 12000 chars
    const truncatedText = text.slice(0, 12000);
    
    const aiClient = new AIClient();
    const prompt = `${PROMPT}\n\nText:\n${truncatedText}`;
    const txt = await aiClient.generateContent(prompt);
    const clean = txt.replace(/```json|```/g, '').trim();

    const parsed = JSON.parse(clean);
    
    // FIX 2: Filter out invalid tools
    let tools = (parsed.tools || []).filter(tool => {
      const lower = tool.toLowerCase();
      return !INVALID_TOOL_KEYWORDS.some(invalid => lower.includes(invalid));
    });
    
    // FIX 3: Ensure totalExperience >= relevantExperience
    let relevantExp = typeof parsed.relevantExperience === 'number' ? parsed.relevantExperience : 0;
    let totalExp = typeof parsed.totalExperience === 'number' ? parsed.totalExperience : 0;
    if (totalExp < relevantExp) {
      totalExp = relevantExp;
    }
    
    // FIX 5: Industry fallback
    let industry = parsed.industry || '';
    if (!industry) {
      const lower = text.toLowerCase();
      const techKeywords = ['software', 'web', 'dev', 'app', 'code', 'programming', 'engineer', 'tech', 'it'];
      if (techKeywords.some(kw => lower.includes(kw))) {
        industry = 'Technology';
      }
    }
    
    // FIX 6: Auto-fill country from city
    let city = parsed.city || '';
    let country = parsed.country || '';
    if (city && !country) {
      const cityLower = city.toLowerCase().trim();
      country = CITY_COUNTRY_MAP[cityLower] || '';
    }
    
    return {
      coreSkills: parsed.coreSkills || [],
      secondarySkills: parsed.secondarySkills || [],
      tools: tools,
      title: parsed.title || '',
      relevantExperience: relevantExp,
      totalExperience: totalExp,
      responsibilities: parsed.responsibilities || [],
      industry: industry,
      projects: parsed.projects || [],
      skillRecency: parsed.skillRecency || '',
      toolProficiency: parsed.toolProficiency || [],
      employmentStability: parsed.employmentStability || '',
      careerProgression: parsed.careerProgression || '',
      responsibilityComplexity: parsed.responsibilityComplexity || '',
      leadership: parsed.leadership || [],
      educationLevel: parsed.educationLevel || '',
      educationField: parsed.educationField || '',
      certifications: parsed.certifications || [],
      portfolio: parsed.portfolio || '',
      city: city,
      country: country,
      remotePreference: parsed.remotePreference || '',
      noticePeriod: parsed.noticePeriod || '',
      employmentType: parsed.employmentType || '',
      keywords: parsed.keywords || [],
      softSkills: parsed.softSkills || [],
      achievements: parsed.achievements || [],
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
