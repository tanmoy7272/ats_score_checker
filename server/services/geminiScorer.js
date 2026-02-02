const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Uses Gemini AI to compare resume features against job requirements
 * Works with official @google/generative-ai SDK
 */
async function getAIScore(resumeFeatures, jobFeatures) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in .env");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest" // latest flash model
  });

  const prompt = `
You are an expert ATS recruiter.

Compare this resume and job description.

Return ONLY valid JSON in this exact format:

{
  "score": number (0-100),
  "matchedSkills": [],
  "missingSkills": [],
  "reasons": [],
  "improvements": []
}

Resume:
${JSON.stringify(resumeFeatures)}

Job:
${JSON.stringify(jobFeatures)}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // safer JSON parsing
    const clean = text.replace(/```json|```/g, "").trim();

    return JSON.parse(clean);

  } catch (error) {
    console.error("Gemini Scorer Error:", error.message);
    console.error("Full error:", error);
    throw new Error(
      "AI scoring failed. Check API key or Gemini quota."
    );
  }
}

module.exports = { getAIScore };
