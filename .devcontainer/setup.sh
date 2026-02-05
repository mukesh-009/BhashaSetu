#!/bin/bash

echo "🚀 Setting up Rural School AI Translator in Codespaces..."
echo "============================================================"

# Install Python dependencies
echo "📦 Installing Python dependencies..."
cd /workspaces/TP/ai-service
pip install Flask flask-cors deep-translator gTTS

# Install Backend dependencies
echo "📦 Installing Backend dependencies..."
cd /workspaces/TP/backend
npm install

# Install Frontend dependencies
echo "📦 Installing Frontend dependencies..."
cd /workspaces/TP/frontend
npm install

echo "============================================================"
echo "✅ Setup complete!"
echo ""
echo "To start the application, run:"
echo "  ./start-all.sh"
echo ""
echo "Or start services individually:"
echo "  Terminal 1: cd ai-service && python3 app.py"
echo "  Terminal 2: cd backend && npm start"
echo "  Terminal 3: cd frontend && npm start"
echo "============================================================"
