const { AIClient } = require('./aiClient');

const PROMPT = `You are an extractor. Given a resume or job description, return JSON only that matches this schema exactly:
{
  skills: string[],
  tools: string[],
  title: string,
  yearsExperience: number,
  location: { city: string, country: string },
  industries: string[],
  education: string[],
  certifications: string[],
  responsibilities: string[],
  keywords: string[]
}

Return valid JSON only. No scoring, no explanations, no additional fields. If a field is not present, return an empty array or empty string or 0 for numbers. Do not perform any math.`;

async function extractStructuredFeatures(text) {
  if (!text) {
    return {
      skills: [],
      tools: [],
      title: '',
      yearsExperience: 0,
      location: { city: '', country: '' },
      industries: [],
      education: [],
      certifications: [],
      responsibilities: [],
      keywords: []
    };
  }

  try {
    const aiClient = new AIClient();
    const prompt = `${PROMPT}\n\nText:\n${text}`;
    const txt = await aiClient.generateContent(prompt);
    const clean = txt.replace(/```json|```/g, '').trim();

    const parsed = JSON.parse(clean);
    return {
      skills: parsed.skills || [],
      tools: parsed.tools || [],
      title: parsed.title || '',
      yearsExperience: typeof parsed.yearsExperience === 'number' ? parsed.yearsExperience : 0,
      location: parsed.location || { city: '', country: '' },
      industries: parsed.industries || [],
      education: parsed.education || [],
      certifications: parsed.certifications || [],
      responsibilities: parsed.responsibilities || [],
      keywords: parsed.keywords || []
    };
  } catch (err) {
    console.error('Feature extraction error:', err.message);
    return {
      skills: [],
      tools: [],
      title: '',
      yearsExperience: 0,
      location: { city: '', country: '' },
      industries: [],
      education: [],
      certifications: [],
      responsibilities: [],
      keywords: []
    };
  }
}

module.exports = { extractStructuredFeatures };
