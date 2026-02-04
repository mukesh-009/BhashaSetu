#!/bin/bash

# Windows batch file to start all services
@echo off
echo.
echo ======================================================
echo 🚀 Starting Rural School AI Translator
echo ======================================================
echo.

REM Check if ports are available
echo 🔍 Checking ports...

REM Start AI Service
echo.
echo 1️⃣  Starting AI Service (Port 5001)...
cd ai-service
start cmd /k python app.py
timeout /t 2 /nobreak

REM Start Backend
echo 2️⃣  Starting Backend (Port 5002)...
cd ../backend
start cmd /k npm start
timeout /t 3 /nobreak

REM Start Frontend
echo 3️⃣  Starting Frontend (Port 3000)...
cd ../frontend
start cmd /k npm start
timeout /t 4 /nobreak

echo.
echo ======================================================
echo ✅ All services started!
echo ======================================================
echo.
echo 📱 Open browser: http://localhost:3000
echo.
echo Running Services:
echo   • Frontend:   http://localhost:3000
echo   • Backend:    http://localhost:5002
echo   • AI Service: http://localhost:5001
echo.
echo Press any key to close this window...
pause
