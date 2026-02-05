#!/bin/bash

echo "🚀 Setting up Rural School AI Translator in Codespaces..."
echo "============================================================"

# Install Python dependencies
echo "📦 Installing Python dependencies (M2M100 transformers)..."
cd /workspaces/TP/ai-service
pip install -r requirements.txt

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
echo "🔧 Setting environment variables for Codespaces..."
# Set frontend environment to use Codespaces URLs
export REACT_APP_API_URL="http://localhost:5002/api"

echo ""
echo "To start the application, run:"
echo "  ./start-all.sh"
echo ""
echo "Or start services individually:"
echo "  Terminal 1: cd ai-service && python3 app.py"
echo "  Terminal 2: cd backend && npm start"
echo "  Terminal 3: cd frontend && npm start"
echo ""
echo "📝 Note: After starting services, Codespaces will auto-forward ports."
echo "   Open the forwarded port 3000 to access the app."
echo "============================================================"
