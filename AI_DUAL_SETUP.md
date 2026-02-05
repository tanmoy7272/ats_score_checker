# Dual AI Provider Setup (Gemini + OpenAI)

The ATS Scorer now supports **automatic fallback** between Gemini and OpenAI APIs.

## How It Works

1. **Primary Provider**: Set in `.env` as `AI_PROVIDER` (default: `gemini`)
2. **Automatic Fallback**: If primary provider fails (quota exceeded, rate limit), automatically switches to backup
3. **Smart Detection**: System detects quota/rate limit errors and retries with alternate provider

## Configuration

### Option 1: Both Keys (Recommended for Production)

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXX
OPENAI_API_KEY=sk-XXXXXXXXXXXXXXXXXX
OPENAI_MODEL=gpt-4o-mini
```

**Benefits:**
- ✅ No downtime if one provider hits quota
- ✅ Automatic failover
- ✅ Cost optimization (use cheaper provider first)

### Option 2: Gemini Only

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXX
```

**Limits:**
- Free tier: 20 requests/day
- No fallback if quota exceeded

### Option 3: OpenAI Only

```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-XXXXXXXXXXXXXXXXXX
OPENAI_MODEL=gpt-4o-mini
```

**Benefits:**
- Higher quota limits
- More predictable performance

## Get API Keys

### Gemini (Free)
1. Visit: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy and paste in `.env`

**Free Tier:**
- 20 requests/day
- Good for testing

### OpenAI (Paid)
1. Visit: https://platform.openai.com/api-keys
2. Create new API key
3. Add credits to account
4. Copy and paste in `.env`

**Pricing:**
- gpt-4o-mini: ~$0.001 per analysis
- 1000 requests ≈ $1

## Recommended Strategy

**For Development:**
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-key
OPENAI_API_KEY=your-openai-key  # fallback
```

**For Production:**
```env
AI_PROVIDER=openai  # more reliable
GEMINI_API_KEY=your-gemini-key  # fallback
OPENAI_API_KEY=your-openai-key
```

## How Fallback Works

```
User uploads resume
      ↓
Try Gemini (primary)
      ↓
   Success? → Return result
      ↓ No (quota exceeded)
Try OpenAI (fallback)
      ↓
   Success? → Return result
      ↓ No
   Error → Show user error
```

## Console Logs

You'll see:
```
🔑 AI Providers available: gemini, openai
🎯 Primary provider: gemini
🤖 Attempting with provider: gemini
⚠️  gemini failed: quota exceeded
🔄 Quota exceeded on gemini, trying fallback...
🤖 Attempting with provider: openai
✅ Success with OpenAI
```

## Cost Comparison

| Provider | Free Tier | Paid | Best For |
|----------|-----------|------|----------|
| Gemini | 20/day | 1000+/day | Development, testing |
| OpenAI | None | Pay-per-use | Production, reliability |

## Troubleshooting

**Problem:** "No valid API keys found"
- Check `.env` file exists in `server/` folder
- Verify keys don't contain `sk-your-openai-key-here` (placeholder)

**Problem:** Both providers failing
- Gemini: Quota exceeded (wait 24h or upgrade)
- OpenAI: No credits (add payment method)

**Problem:** Slow responses
- Gemini: Usually faster, but less reliable
- OpenAI: Slightly slower, more consistent
