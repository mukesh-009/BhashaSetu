#!/bin/bash

echo "🚀 Setting up Rural School AI Translator in Codespaces..."
echo "============================================================"

# Install Backend dependencies (faster, do first)
echo "📦 Installing Backend dependencies..."
cd /workspaces/TP/backend
npm install --silent

# Install Frontend dependencies
echo "📦 Installing Frontend dependencies..."
cd /workspaces/TP/frontend
npm install --silent

# Install Python dependencies in background (slow - torch is ~2GB)
echo "📦 Installing Python dependencies (M2M100 transformers)..."
echo "⚠️  This may take 3-5 minutes (PyTorch ~2GB + transformers ~500MB)"
cd /workspaces/TP/ai-service
pip install --quiet -r requirements.txt

echo "============================================================"
echo "✅ Setup complete!"
echo ""
echo "🔧 Setting environment variables for Codespaces..."
# Set frontend environment to use Codespaces URLs
export REACT_APP_API_URL="http://localhost:5002/api"

echo ""
echo "To start the application, run:"
echo "  bash .devcontainer/start-services.sh"
echo ""
echo "Or start services individually in 3 terminals:"
echo "  Terminal 1: cd ai-service && python3 app.py"
echo "  Terminal 2: cd backend && npm start"
echo "  Terminal 3: cd frontend && npm start"
echo ""
echo "📝 Note: First AI service run downloads M2M100 model (~1.5GB)"
echo "   Total download: ~4GB (PyTorch + transformers + M2M100)"
echo "============================================================"
