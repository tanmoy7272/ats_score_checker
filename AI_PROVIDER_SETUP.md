# AI Provider Configuration Guide

The ATS Scorer now supports **both OpenAI and Google Gemini APIs**. You can easily switch between them using environment variables.

## Setup Instructions

### 1. Using OpenAI API (ChatGPT)

**Step 1:** Add your OpenAI API key to `server/.env`:
```env
AI_PROVIDER=openai
OPENAI_API_KEY=your-api-key-here
OPENAI_MODEL=gpt-4o-mini
```

**Step 2:** Get your API key:
- Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
- Create a new API key
- Copy it and paste in `.env`

**Supported Models:**
- `gpt-4o-mini` (recommended) - Fast and affordable
- `gpt-4o` - More powerful, higher cost
- `gpt-3.5-turbo` - Cheaper alternative

---

### 2. Using Google Gemini API

**Step 1:** Add your Gemini API key to `server/.env`:
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your-api-key-here
GEMINI_MODEL=gemini-flash-latest
```

**Step 2:** Get your API key:
- Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
- Create a new API key (free tier available)
- Copy it and paste in `.env`

**Supported Models:**
- `gemini-flash-latest` (recommended) - Free tier available
- `gemini-pro` - More capable

---

## Switching Between Providers

Simply change the `AI_PROVIDER` value in `.env`:

```env
# Use OpenAI
AI_PROVIDER=openai

# OR use Gemini
AI_PROVIDER=gemini
```

Then restart the server. No code changes needed!

---

## Free Tier Limits

### OpenAI
- **Free Trial:** $5 free credits (expires 3 months after account creation)
- **Pay-as-you-go:** GPT-4o mini costs ~$0.00015 per 1K input tokens

### Gemini
- **Completely Free:** 60 requests per minute
- **No billing required** for free tier

---

## Example .env File

```dotenv
# AI Provider Configuration
AI_PROVIDER=openai

# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your-actual-key-here
OPENAI_MODEL=gpt-4o-mini

# Gemini Configuration (backup)
GEMINI_API_KEY=AIzaSyDsXn3q0IkH8UsInDrFpbnJJYwHNV_1oUQ
GEMINI_MODEL=gemini-flash-latest

# Server Configuration
PORT=5000
NODE_ENV=development
```

---

## Troubleshooting

### "Missing OPENAI_API_KEY" Error
- Make sure `AI_PROVIDER=openai` is set
- Check that `OPENAI_API_KEY` is filled in `.env`
- Verify the key starts with `sk-`

### "Missing GEMINI_API_KEY" Error
- Make sure `AI_PROVIDER=gemini` is set
- Check that `GEMINI_API_KEY` is filled in `.env`

### "Quota Exceeded" Error
- **Gemini free tier:** Wait until tomorrow for daily quota reset
- **OpenAI:** Check billing at https://platform.openai.com/account/billing/overview

---

## Performance Comparison

| Aspect | OpenAI (GPT-4o mini) | Gemini (Flash) |
|--------|----------------------|-----------------|
| **Speed** | Fast | Very Fast |
| **Cost** | ~$0.00015/1K tokens | Free (up to 60 req/min) |
| **Accuracy** | Excellent | Excellent |
| **Free Trial** | $5 credit | ∞ Requests |

---

For more info:
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Gemini API Docs](https://ai.google.dev/gemini-api)
