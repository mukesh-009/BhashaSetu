# 🚀 Running on GitHub Codespaces

## Why Use Codespaces?

✅ **No Local Setup** - Everything runs in the cloud  
✅ **Show Anywhere** - Access from any browser  
✅ **Pre-configured** - All dependencies auto-installed  
✅ **Fast Demo** - Perfect for teacher presentations  
✅ **Free** - 60 hours/month free for students  

---

## 📋 Quick Start (3 Steps)

### Step 1: Open in Codespaces

1. Go to your GitHub repo: https://github.com/mukesh-009/TP
2. Click the green **"Code"** button
3. Click **"Codespaces"** tab
4. Click **"Create codespace on main"**

Wait 2-3 minutes for setup to complete automatically.

### Step 2: Start the Application

Once Codespaces opens, run:

```bash
./start-all.sh
```

Or manually in 3 terminals:

**Terminal 1:**
```bash
cd ai-service
python3 app.py
```

**Terminal 2:**
```bash
cd backend
npm start
```

**Terminal 3:**
```bash
cd frontend
npm start
```

### Step 3: Open the App

- Codespaces will automatically forward ports
- Click the popup notification that says **"Open in Browser"**
- Or go to **"PORTS"** tab and click the globe icon next to port 3000

Your app is now running! 🎉

---

## 🎓 For Teacher Demo

### Before the Presentation:

1. **Create Codespace** 24 hours before (it stays active)
2. **Test it once** to ensure everything works
3. **Keep the tab open** during presentation

### During the Presentation:

1. Open the Codespaces URL (it's public and shareable)
2. Show the running application
3. Demonstrate all features:
   - Type "Hello" → Select Hindi → See translation
   - Voice input (if Chrome)
   - Copy button
   - Keyboard shortcuts
   - Recent languages

### Sharing with Teacher:

- Click **"Ports"** tab → Right-click port 3000 → **"Port Visibility"** → **"Public"**
- Share the URL with your teacher
- They can access it directly without login!

---

## 🔧 Troubleshooting

### Ports not showing?

```bash
# Check if services are running
lsof -i :3000 -i :5001 -i :5002
```

### Need to restart?

```bash
# Stop all (Ctrl+C in each terminal)
# Then run again
./start-all.sh
```

### Codespace sleeping?

- Free tier sleeps after 30 min idle
- Just click on Codespace again to wake it up
- Everything restarts automatically

---

## 💰 Cost (Free for Students!)

- **60 hours/month FREE** for personal accounts
- Each session counts only when active
- Perfect for college projects!
- Sign up for **GitHub Student Developer Pack** for more free hours

---

## 🌐 Making it Public for Teacher

### Option 1: Public Port (Recommended)

1. Go to **"PORTS"** tab in Codespaces
2. Right-click port **3000** (Frontend)
3. Select **"Port Visibility"** → **"Public"**
4. Copy the URL and share with teacher

### Option 2: Share Codespace

1. Click **"Share"** button in Codespaces
2. Generate shareable link
3. Send to teacher
4. They can view and interact with your code

---

## ⚡ Pro Tips

1. **Keep it running**: Don't close browser during demo
2. **Test before**: Run once 24 hours before presentation
3. **Backup plan**: Have localhost version ready too
4. **Internet required**: Both you and teacher need internet
5. **Browser matters**: Chrome works best for voice features

---

## 📊 What Your Teacher Will See

✅ Professional cloud-based deployment  
✅ No "works on my machine" issues  
✅ Real production-like environment  
✅ Easy to access and test  
✅ Shows you understand modern dev practices  

---

## 🎯 Commands Cheat Sheet

```bash
# Start everything
./start-all.sh

# Check what's running
ps aux | grep -E "python|node|npm"

# Kill all processes
pkill -f "python3 app.py"
pkill -f "npm start"

# Reinstall dependencies
cd ai-service && pip install -r requirements.txt
cd ../backend && npm install
cd ../frontend && npm install

# Check ports
lsof -i :3000 -i :5001 -i :5002
```

---

**You're now ready to demo from anywhere! 🌍**
