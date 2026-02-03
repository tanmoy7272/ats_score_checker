const { GoogleGenerativeAI } = require('@google/generative-ai');
const { OpenAI } = require('openai');

class AIClient {
  constructor() {
    this.provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
    
    if (this.provider === 'openai') {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('Missing OPENAI_API_KEY in environment when AI_PROVIDER=openai');
      }
      this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    } else if (this.provider === 'gemini') {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('Missing GEMINI_API_KEY in environment when AI_PROVIDER=gemini');
      }
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.client = genAI;
    } else {
      throw new Error(`Unsupported AI_PROVIDER: ${this.provider}. Use 'openai' or 'gemini'`);
    }
  }

  async generateContent(prompt) {
    if (this.provider === 'openai') {
      const response = await this.client.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      });
      return response.choices[0].message.content;
    } else if (this.provider === 'gemini') {
      const model = this.client.getGenerativeModel({ 
        model: process.env.GEMINI_MODEL || 'gemini-flash-latest' 
      });
      const result = await model.generateContent(prompt);
      return result.response.text();
    }
  }
}

module.exports = { AIClient };
