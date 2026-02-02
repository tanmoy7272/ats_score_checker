
const { GoogleGenAI, Type } = require('@google/genai');

/**
 * Uses Gemini AI to compare resume features against job requirements.
 * Optimized for Gemini 3 Flash.
 */
async function getAIScore(resumeFeatures, jobFeatures) {
  if (!process.env.API_KEY) {
    throw new Error('Gemini API key is not configured on the server.');
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Act as an expert ATS. Compare this resume to the JD.
Resume: ${JSON.stringify(resumeFeatures)}
JD: ${JSON.stringify(jobFeatures)}
Return JSON analysis.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a professional hiring manager. Provide honest, critical, and constructive feedback. Only output valid JSON.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            matchedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            reasons: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['score', 'matchedSkills', 'missingSkills', 'reasons', 'improvements']
        }
      }
    });

    if (!response || !response.text) {
      throw new Error('Received empty response from Gemini AI.');
    }

    const result = JSON.parse(response.text);
    return result;
  } catch (error) {
    console.error('Gemini Scorer Error:', error.message);
    
    // Provide user-friendly messages for common API errors
    if (error.message.includes('API key')) {
      throw new Error('Invalid or expired API Key. Please check your .env file.');
    }
    
    throw new Error('AI analysis failed. Please ensure your API key is correct and try again.');
  }
}

module.exports = {
  getAIScore
};
