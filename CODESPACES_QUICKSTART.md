# Codespaces Quick Start Guide

## 🚀 Starting the Application in Codespaces

After your Codespace opens:

### Option 1: One Command Start (Recommended)
```bash
bash .devcontainer/start-services.sh
```

This starts all three services automatically.

### Option 2: Manual Start (3 Terminals)

**Terminal 1 - AI Service:**
```bash
cd ai-service
python3 app.py
```
*Note: First run downloads M2M100 model (~1.5GB, takes 2-5 minutes)*

**Terminal 2 - Backend:**
```bash
cd backend
npm start
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm start
```

## 🌐 Accessing the App

1. After services start, GitHub Codespaces will show "Port forwarding" notifications
2. Click on port **3000** or go to the **PORTS** tab
3. Click the globe icon next to port 3000 to open the app in your browser

## 🔧 Port Reference
- **3000** - React Frontend (Open this in browser)
- **5002** - Node.js Backend API
- **5001** - Python AI Service (M2M100)

## ⚠️ Common Issues

### Pink Screen / Error Screen
- **Cause**: Services not started or ports not forwarded
- **Fix**: 
  1. Check all 3 services are running (green dots in terminal)
  2. Wait 30 seconds for model download on first run
  3. Make sure you're opening port 3000 (not 5001 or 5002)
  4. Refresh the browser

### "Failed to fetch languages"
- **Cause**: Backend can't reach AI service
- **Fix**: Check AI service terminal for errors, restart if needed

### Model Download Taking Too Long
- **Expected**: First run takes 2-5 minutes to download M2M100 model
- **Watch**: AI service terminal will show download progress

## 🎯 Testing Translation

Once the app loads:
1. Select source language (e.g., English)
2. Select target language (e.g., Hindi)
3. Type or paste text
4. Translation appears automatically after 0.8s
5. Check browser console - should show `"method": "transformers-m2m100"`

## 📊 Supported Languages
18 languages: Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Nepali, Urdu, English, Spanish, French, Chinese, Arabic
