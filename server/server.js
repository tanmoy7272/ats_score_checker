
require('dotenv').config();
const app = require('./app');

// Validate Environment Variables - check for at least one API key
const hasGemini = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'sk-your-openai-key-here';
const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your-openai-key-here';

if (!hasGemini && !hasOpenAI) {
  console.error('FATAL ERROR: No valid API keys found.');
  console.error('Please provide at least one of:');
  console.error('  - GEMINI_API_KEY (get from https://aistudio.google.com/)');
  console.error('  - OPENAI_API_KEY (get from https://platform.openai.com/)');
  process.exit(1);
}

if (hasGemini && hasOpenAI) {
  console.log('✨ Dual AI mode: Both Gemini and OpenAI keys detected (automatic fallback enabled)');
} else if (hasGemini) {
  console.log('🔑 Using Gemini API only');
} else {
  console.log('🔑 Using OpenAI API only');
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API key detected. AI features enabled.`);
});
