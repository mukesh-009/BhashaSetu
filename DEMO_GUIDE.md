# 🚀 Quick Start Guide for College Demo

## One-Command Startup (Recommended for Teacher Demo)

### On Mac/Linux:
```bash
./start-all.sh
```

### On Windows:
```bash
start-all.bat
```

This will:
1. ✅ Start AI Service (Port 5001)
2. ✅ Start Backend (Port 5002)  
3. ✅ Start Frontend (Port 3000)
4. ✅ Open browser automatically

**Then visit:** `http://localhost:3000`

---

## Manual Startup (If One-Command Fails)

Open **3 separate terminals** and run these commands:

**Terminal 1 - AI Service:**
```bash
cd ai-service
python3 app.py
```

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

Then open: `http://localhost:3000`

---

## Prerequisites Check

Before running, ensure you have:
- ✅ Node.js 18+ installed
- ✅ Python 3.8+ installed
- ✅ Dependencies installed:

```bash
# In ai-service/
pip3 install Flask flask-cors deep-translator gTTS

# In backend/
npm install

# In frontend/
npm install
```

---

## What to Show Your Teacher

1. **Open http://localhost:3000** in browser
2. **Test Translation:**
   - Type "Hello" in English
   - Select Hindi as target
   - See "नमस्ते" in output
3. **Test Voice Input:**
   - Click microphone icon
   - Say something
   - See auto-translation
4. **Test Features:**
   - Click speaker to hear translation
   - Use Ctrl+S to swap languages
   - Copy button works
   - Character counter shows
   - Recent languages appear

---

## Keyboard Shortcuts to Demo

- `Ctrl+Enter` - Translate
- `Ctrl+S` - Swap languages
- `Esc` - Clear text

---

## Troubleshooting

### "Port already in use"
Kill existing processes:
```bash
# Mac/Linux
lsof -i :3000 -i :5001 -i :5002

# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5001
netstat -ano | findstr :5002
```

### "Module not found" error
Reinstall dependencies:
```bash
cd ai-service && pip3 install -r requirements.txt
cd ../backend && npm install
cd ../frontend && npm install
```

### Translation not working
Check all services are running:
- Open http://localhost:5002/api/health (should show "ok")
- Open http://localhost:5001/health (should show JSON)

---

## Demo Script for Teacher

1. Show the code on GitHub
2. Open the browser at http://localhost:3000
3. Type: "AI makes learning fun"
4. Select Target Language: Hindi
5. Watch auto-translation appear
6. Click speaker icon to hear it
7. Click copy button
8. Show recent languages dropdown
9. Swap languages with Ctrl+S
10. Demonstrate voice input (Chrome only)

---

**Ready for presentation!** 🎓
