#!/bin/bash

echo "🚀 Setting up Rural School AI Translator in Codespaces..."
echo "============================================================"

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# Go up one level to get the workspace root
WORKSPACE_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

echo "Working directory: $WORKSPACE_ROOT"

# Install Python dependencies
echo "📦 Installing Python dependencies..."
cd "$WORKSPACE_ROOT/ai-service"
pip install -r requirements.txt

# Install Backend dependencies
echo "📦 Installing Backend dependencies..."
cd "$WORKSPACE_ROOT/backend"
npm install

# Install Frontend dependencies
echo "📦 Installing Frontend dependencies..."
cd "$WORKSPACE_ROOT/frontend"
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
