#!/bin/bash

echo "🚀 Starting all services in Codespaces..."
echo "============================================================"

# Start AI Service in background
echo "Starting AI Service on port 5001..."
cd /workspaces/TP/ai-service
python3 app.py &
AI_PID=$!

# Wait a bit for AI service to start
sleep 3

# Start Backend in background
echo "Starting Backend on port 5002..."
cd /workspaces/TP/backend
npm start &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start Frontend (this will keep the terminal active)
echo "Starting Frontend on port 3000..."
cd /workspaces/TP/frontend
npm start

# If frontend exits, kill other services
kill $AI_PID $BACKEND_PID 2>/dev/null
