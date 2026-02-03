const { GoogleGenerativeAI } = require('@google/generative-ai');

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

  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Missing GEMINI_API_KEY in environment');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-flash-latest' });

  const prompt = `${PROMPT}\n\nText:\n${text}`;

  const result = await model.generateContent(prompt);
  const txt = result.response.text();
  const clean = txt.replace(/```json|```/g, '').trim();

  try {
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
