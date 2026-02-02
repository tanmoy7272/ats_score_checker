
require('dotenv').config();
const app = require('./app');

// Validate Environment Variables
if (!process.env.API_KEY) {
  console.error('FATAL ERROR: Missing API_KEY in server/.env file.');
  console.error('Please obtain a key from https://aistudio.google.com/ and add it to your environment.');
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API key detected. AI features enabled.`);
});
