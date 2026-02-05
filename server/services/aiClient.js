const { GoogleGenerativeAI } = require('@google/generative-ai');
const { OpenAI } = require('openai');

class AIClient {
  constructor() {
    this.primaryProvider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
    this.hasGemini = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'sk-your-openai-key-here';
    this.hasOpenAI = !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your-openai-key-here';
    
    if (!this.hasGemini && !this.hasOpenAI) {
      throw new Error('No valid API keys found. Please provide GEMINI_API_KEY or OPENAI_API_KEY in .env file');
    }
    
    // Initialize both clients if keys are available
    this.clients = {};
    
    if (this.hasGemini) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.clients.gemini = genAI;
    }
    
    if (this.hasOpenAI) {
      this.clients.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    
    console.log(`🔑 AI Providers available: ${Object.keys(this.clients).join(', ')}`);
    console.log(`🎯 Primary provider: ${this.primaryProvider}`);
  }

  async generateContent(prompt, retryWithFallback = true) {
    const providers = [this.primaryProvider];
    
    // Add fallback provider if available
    if (retryWithFallback) {
      if (this.primaryProvider === 'gemini' && this.hasOpenAI) {
        providers.push('openai');
      } else if (this.primaryProvider === 'openai' && this.hasGemini) {
        providers.push('gemini');
      }
    }
    
    let lastError = null;
    
    for (const provider of providers) {
      try {
        console.log(`🤖 Attempting with provider: ${provider}`);
        
        if (provider === 'openai' && this.clients.openai) {
          const response = await this.clients.openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.1
          });
          console.log(`✅ Success with OpenAI`);
          return response.choices[0].message.content;
          
        } else if (provider === 'gemini' && this.clients.gemini) {
          const model = this.clients.gemini.getGenerativeModel({
            model: process.env.GEMINI_MODEL || 'gemini-2.5-flash'
          });
          const result = await model.generateContent(prompt);
          console.log(`✅ Success with Gemini`);
          return result.response.text();
        }
        
      } catch (error) {
        lastError = error;
        console.warn(`⚠️  ${provider} failed: ${error.message}`);
        
        // If we have more providers to try, continue to fallback
        if (providers.length > 1 && providers.indexOf(provider) < providers.length - 1) {
          console.log(`🔄 ${provider} failed, trying fallback...`);
          continue; // Try next provider
        } else {
          throw error; // Re-throw if this was the last provider
        }
      }
    }
    
    // If we get here, all providers failed
    throw lastError || new Error('All AI providers failed');
  }
}

module.exports = { AIClient };
