#!/bin/bash

# Rural School AI Translator - One Command Startup Script
# This script starts all three services in separate windows

echo "🚀 Starting Rural School AI Translator..."
echo "================================================"

# Function to check if port is available
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "❌ Port $1 is already in use"
        return 1
    fi
    return 0
}

# Check ports
echo "🔍 Checking ports..."
check_port 5001 || exit 1
check_port 5002 || exit 1
check_port 3000 || exit 1

echo "✅ All ports available"
echo ""

# Start AI Service (Python Flask)
echo "1️⃣  Starting AI Service (Port 5001)..."
cd ai-service
python3 app.py &
AI_PID=$!
sleep 2
echo "   ✅ AI Service started (PID: $AI_PID)"
echo ""

# Start Backend (Node.js Express)
echo "2️⃣  Starting Backend (Port 5002)..."
cd ../backend
npm start &
BACKEND_PID=$!
sleep 3
echo "   ✅ Backend started (PID: $BACKEND_PID)"
echo ""

# Start Frontend (React)
echo "3️⃣  Starting Frontend (Port 3000)..."
cd ../frontend
npm start &
FRONTEND_PID=$!
sleep 4
echo "   ✅ Frontend started (PID: $FRONTEND_PID)"
echo ""

echo "================================================"
echo "🎉 All services started successfully!"
echo ""
echo "📱 Open browser: http://localhost:3000"
echo ""
echo "Running Services:"
echo "  • Frontend:   http://localhost:3000"
echo "  • Backend:    http://localhost:5002"
echo "  • AI Service: http://localhost:5001"
echo ""
echo "To stop all services, press Ctrl+C or run:"
echo "  kill $AI_PID $BACKEND_PID $FRONTEND_PID"
echo ""
echo "================================================"

# Wait for user interrupt
wait
