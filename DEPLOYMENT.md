# Deployment Guide

## Deploy Backend to Railway

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Login & Initialize
```bash
railway login
cd /workspaces/ats_score_checker
railway init
```

### Step 3: Set Environment Variables
```bash
railway variables set GEMINI_API_KEY=AIzaSyBf9gHw_rA3t-sWyGqMGrwPCJ4LexNV4D4
railway variables set GEMINI_MODEL=gemini-2.5-flash
railway variables set NODE_ENV=production
railway variables set PORT=5000
```

### Step 4: Deploy
```bash
railway up
```

### Step 5: Get Backend URL
```bash
railway domain
# Copy the URL (e.g., https://your-app.up.railway.app)
```

---

## Deploy Frontend to Vercel

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Update .env.production
Replace `your-backend.up.railway.app` with your actual Railway URL from Step 5 above.

### Step 3: Login & Deploy
```bash
vercel login
vercel --prod
```

### Step 4: Set Environment Variable
In Vercel dashboard or CLI:
```bash
vercel env add VITE_API_URL
# Enter: https://your-backend.up.railway.app
```

### Step 5: Redeploy
```bash
vercel --prod
```

---

## Quick Deploy Commands

```bash
# Backend (Railway)
railway login
railway init
railway variables set GEMINI_API_KEY=AIzaSyBf9gHw_rA3t-sWyGqMGrwPCJ4LexNV4D4
railway variables set GEMINI_MODEL=gemini-2.5-flash
railway variables set NODE_ENV=production
railway up

# Get Railway URL
railway domain

# Frontend (Vercel)
# Update .env.production with Railway URL first!
vercel login
vercel --prod
```

---

## Environment Variables

### Railway (Backend)
- `GEMINI_API_KEY` - Your Gemini API key
- `GEMINI_MODEL` - gemini-2.5-flash
- `NODE_ENV` - production
- `PORT` - 5000 (or Railway's PORT)

### Vercel (Frontend)
- `VITE_API_URL` - Your Railway backend URL

---

## Verify Deployment

1. **Backend**: Open `https://your-backend.up.railway.app/health`
   - Should return: `{"status":"ok"}`

2. **Frontend**: Open your Vercel URL
   - Upload a resume and test scoring

---

## Troubleshooting

### Railway Issues
```bash
railway logs
railway status
```

### Vercel Issues
```bash
vercel logs
vercel ls
```

### CORS Errors
Update `server/app.js` corsOptions with your Vercel domain.

---

## Cost

- **Railway**: $5/month credit (free tier)
- **Vercel**: Free for hobby projects
