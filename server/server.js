require('dotenv').config();
const app = require('./app');

// Validate Environment Variables - check for at least one API key
const hasGemini = process.env.GEMINI_API_KEY && 
                  process.env.GEMINI_API_KEY !== 'sk-your-openai-key-here' &&
                  process.env.GEMINI_API_KEY.trim() !== '';

const hasOpenAI = process.env.OPENAI_API_KEY && 
                  process.env.OPENAI_API_KEY !== 'sk-your-openai-key-here' &&
                  process.env.OPENAI_API_KEY.trim() !== '';

if (!hasGemini && !hasOpenAI) {
  console.error('FATAL ERROR: No valid API keys found.');
  console.error('Please provide at least one of:');
  console.error('  - GEMINI_API_KEY (get from https://aistudio.google.com/)');
  console.error('  - OPENAI_API_KEY (get from https://platform.openai.com/)');
  console.error('\nCurrent environment variables:');
  console.error('  GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Set (hidden)' : 'Not set');
  console.error('  OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Set (hidden)' : 'Not set');
  process.exit(1);
}

if (hasGemini && hasOpenAI) {
  console.log('✨ Dual AI mode: Both Gemini and OpenAI keys detected (automatic fallback enabled)');
} else if (hasGemini) {
  console.log('🔑 Using Gemini API only');
} else {
  console.log('🔑 Using OpenAI API only');
}

// Railway uses PORT environment variable
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 AI features enabled`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});