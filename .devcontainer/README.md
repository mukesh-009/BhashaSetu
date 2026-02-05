# Codespaces Setup Information

## Why Setup Takes Time

The initial Codespace setup takes **5-10 minutes** because it installs:

1. **PyTorch** (~2GB) - Deep learning framework
2. **Transformers** (~500MB) - Hugging Face library for M2M100
3. **Node.js packages** (~200MB) - Frontend + Backend dependencies
4. **Total during setup**: ~2.7GB

**Then on first run**, the M2M100 model downloads (~1.5GB more).

## Optimization Tips

### Option 1: Use Lighter Translation (Faster Setup)
If you need quick demos, you can temporarily switch back to Google Translate:

```bash
# In ai-service/requirements.txt, replace with:
Flask==3.0.0
flask-cors==4.0.0
deep-translator==1.11.4
gTTS==2.5.0
```

Then restore `app_backup.py` → `app.py`. **Setup time**: ~1 minute

### Option 2: Pre-built Container (Advanced)
Build a Docker image with pre-installed dependencies and reference it in devcontainer.json.

### Option 3: Accept the Wait ⏰
Transformers are worth it! Setup is one-time. Once created:
- Codespace persists (no re-setup needed)
- Model stays cached (~1.5GB saved on restarts)
- Subsequent starts take ~30 seconds

## What Happens During Setup

```
[0-2 min]  Installing npm packages (backend + frontend)
[2-7 min]  Installing PyTorch (2GB download + compilation)
[7-9 min]  Installing transformers + dependencies
[9-10 min] Final configuration
```

## After Setup

**First Run Only:**
```bash
cd ai-service && python3 app.py
# Downloads M2M100 model (~1.5GB, 2-5 minutes)
```

**All Future Runs:**
```bash
bash .devcontainer/start-services.sh
# Starts in ~30 seconds (model cached)
```

## Recommendation

☕ **Grab coffee during setup!** It's a one-time cost for production-quality ML translation with:
- 18 languages
- Offline capability
- No API costs
- Better accuracy than basic translation APIs
