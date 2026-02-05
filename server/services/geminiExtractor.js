const { AIClient } = require('./aiClient');

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
    const aiClient = new AIClient();
    const prompt = `${PROMPT}\n\nText:\n${text}`;
    const txt = await aiClient.generateContent(prompt);
    const clean = txt.replace(/```json|```/g, '').trim();

    const parsed = JSON.parse(clean);
    return {
      coreSkills: parsed.coreSkills || [],
      secondarySkills: parsed.secondarySkills || [],
      tools: parsed.tools || [],
      title: parsed.title || '',
      relevantExperience: typeof parsed.relevantExperience === 'number' ? parsed.relevantExperience : 0,
      totalExperience: typeof parsed.totalExperience === 'number' ? parsed.totalExperience : 0,
      responsibilities: parsed.responsibilities || [],
      industry: parsed.industry || '',
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
      city: parsed.city || '',
      country: parsed.country || '',
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
