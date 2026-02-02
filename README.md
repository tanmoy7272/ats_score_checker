
# ATS Resume Scorer - Production Starter

An intelligent, AI-powered Applicant Tracking System (ATS) that evaluates resumes against job descriptions using Google Gemini.

## Project Structure
- **Frontend (Root)**: React + Vite + Tailwind CSS
- **Backend (server/)**: Node.js + Express + Multer + PDF/Docx Extraction + Gemini AI

## Features
- ✅ Multi-format support (PDF, DOCX)
- ✅ Intelligent text extraction and cleaning
- ✅ Skill/Experience/Degree feature detection
- ✅ AI-powered scoring and gap analysis
- ✅ Centralized error handling and rate limiting
- ✅ Responsive modern UI

## Getting Gemini API Key
To use the AI scoring features, you need a Google Gemini API Key:
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Click on **"Get API key"** in the sidebar.
3. Create a new API key in a new or existing project.
4. Copy the key and paste it into your `server/.env` file (see below).

## Setup & Running

### 1. Environment Variables
Create a `.env` file in the `server/` directory:
```env
API_KEY=your_gemini_api_key_here
PORT=5000
```

### 2. Install Dependencies
```bash
# Root (Frontend)
npm install

# Backend
cd server
npm install
```

### 3. Run Development
```bash
# Terminal 1: Frontend (Root)
npm run dev

# Terminal 2: Backend
cd server
npm run dev
```

## API Endpoints
- `GET /health`: Server health check
- `POST /api/resume/upload`: Process resume file
- `POST /api/job/analyze`: Process JD text
- `POST /api/score`: Final AI comparison
