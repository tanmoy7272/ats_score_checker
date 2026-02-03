const { GoogleGenerativeAI } = require('@google/generative-ai');

const PROMPT = `You are an explainer. Given a deterministic score, the breakdown, resume features and job features, produce JSON only with:
{
  reasons: string[],
  improvements: string[]
}

Do not compute the score or change numbers. Provide concise human-readable reasons and actionable improvements.`;

async function explain({ score, breakdown, resumeFeatures, jobFeatures }) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Missing GEMINI_API_KEY in environment');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-flash-latest' });

  const prompt = `${PROMPT}\n\nInput:\n${JSON.stringify({ score, breakdown, resumeFeatures, jobFeatures })}`;

  const result = await model.generateContent(prompt);
  const txt = result.response.text();
  const clean = txt.replace(/```json|```/g, '').trim();

  try {
    const parsed = JSON.parse(clean);
    return {
      reasons: Array.isArray(parsed.reasons) ? parsed.reasons : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : []
    };
  } catch (err) {
    return { reasons: [], improvements: [] };
  }
}

module.exports = { explain };
