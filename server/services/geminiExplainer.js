const { AIClient } = require('./aiClient');

const PROMPT = `You are an explainer. Given a deterministic score, the breakdown, resume features and job features, produce JSON only with:
{
  reasons: string[],
  improvements: string[]
}

Do not compute the score or change numbers. Provide concise human-readable reasons and actionable improvements.`;

async function explain({ score, breakdown, resumeFeatures, jobFeatures }) {
  try {
    const aiClient = new AIClient();
    const prompt = `${PROMPT}\n\nInput:\n${JSON.stringify({ score, breakdown, resumeFeatures, jobFeatures })}`;

    const txt = await aiClient.generateContent(prompt);
    const clean = txt.replace(/```json|```/g, '').trim();

    const parsed = JSON.parse(clean);
    return {
      reasons: Array.isArray(parsed.reasons) ? parsed.reasons : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : []
    };
  } catch (err) {
    console.error('Explanation generation error:', err.message);
    return { reasons: [], improvements: [] };
  }
}

module.exports = { explain };
