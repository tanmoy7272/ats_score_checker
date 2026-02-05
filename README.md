# ATS Resume Scorer

AI-powered resume evaluation system using 30 parameters with dual AI support (Gemini + OpenAI).

## Features

- **30-Parameter Scoring** - Comprehensive evaluation across skills, experience, education, and more
- **Dual AI Providers** - Gemini (primary) + OpenAI (automatic failover)
- **Intelligent Matching** - Fuzzy text matching, synonym recognition, skill overlap analysis
- **PDF & DOCX Support** - Automated text extraction and parsing
- **Transparent Scoring** - See exactly which parameters match and why

## 30 Parameters (Weighted Scoring)

**Tier 1 (65%)** - Core Skills, Tools, Experience (relevant & total), Responsibilities, Job Title, Industry, Projects, Skill Coverage & Recency

**Tier 2 (25%)** - Secondary Skills, Tool Proficiency, Employment Stability, Career Progression, Leadership, Education, Certifications, Portfolio

**Tier 3 (10%)** - Location, Remote Preference, Notice Period, Employment Type, Keywords, Soft Skills, Achievements, Resume Quality

## Quick Start

### 1. Get API Key (Choose One or Both)

**Gemini (Free)** - [Get key](https://aistudio.google.com/apikey) - 20 requests/day  
**OpenAI (Recommended)** - [Get key](https://platform.openai.com/api-keys) - Pay-per-use (~$0.001/resume)

### 2. Setup Environment

Create `server/.env`:

```env
AI_PROVIDER=openai                     # 'gemini' or 'openai'
GEMINI_API_KEY=your_gemini_key_here
OPENAI_API_KEY=your_openai_key_here
PORT=5000
```

### 3. Install & Run

```bash
npm install              # Installs all dependencies
npm run dev              # Starts both servers
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## How It Works

1. **Upload resume** (PDF/DOCX) → AI extracts 30 parameters
2. **Paste job description** → AI extracts requirements
3. **Get score** (0-100%) with detailed breakdown and suggestions

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/resume/upload` | POST | Upload & extract resume |
| `/api/job/analyze` | POST | Analyze job description |
| `/api/score/v2` | POST | Calculate score (30 params) |

## Score Interpretation

- **80-100%** - Excellent match, apply with confidence
- **60-79%** - Good match, minor tweaks recommended
- **40-59%** - Moderate match, review missing parameters
- **0-39%** - Weak match, significant updates needed

## Troubleshooting

**Check if servers are running:**
```bash
ps aux | grep -E "node.*server|vite" | grep -v grep
curl http://localhost:5000/health
```

**Gemini quota exceeded (429):**
- Wait 24 hours OR switch to OpenAI: `AI_PROVIDER=openai`

**Parameters showing "Not detected":**
- Check API keys in `server/.env`
- Check server logs for error messages

**Port already in use:**
```bash
pkill -f "node.*server.js" && pkill -f "vite"
npm run dev
```

## Tech Stack

- **Frontend:** React 19, Vite 6, Tailwind CSS, TypeScript
- **Backend:** Node.js, Express 4, Multer, pdf-parse, mammoth
- **AI:** Gemini 1.5 Pro, GPT-4o-mini
- **Scoring:** Custom deterministic engine with fuzzy matching

## License

MIT
