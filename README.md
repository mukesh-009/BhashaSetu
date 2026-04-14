# BhashaSetu

BhashaSetu is a multilingual translation platform built to support communication and learning in rural and multilingual classrooms. It provides text translation, voice output, and batch translation using a three-service architecture.

## Overview

- Translation model: `facebook/m2m100_418M` (Hugging Face Transformers)
- Supported language set in current implementation: 18 (13 Indian + 5 foreign)
- Frontend: React + TypeScript
- Backend: Node.js + Express
- AI service: Python + Flask + PyTorch + Transformers

## Key Features

- Multilingual text translation across supported language pairs
- Text-to-speech playback for translated output
- Batch translation API for multiple inputs in one request
- Responsive web UI for classroom and demo usage
- Docker Compose setup for one-command deployment

## System Architecture

```text
Browser (Frontend, :3000)
        |
        v
Node.js API Gateway (Backend, :5002 host -> :5000 container)
        |
        v
Python AI Service (Flask, :5001)
```

Request flow:
1. Frontend sends translation request to backend `/api/translate`.
2. Backend validates payload and forwards to AI service `/translate`.
3. AI service runs M2M100 inference and returns translated text.
4. Backend formats response and returns it to frontend.

## Repository Structure

```text
BhashaSetu/
├── ai-service/              # Flask + Transformers translation service
├── backend/                 # Express API gateway
├── frontend/                # React TypeScript web client
├── reports/                 # Project reports and progress artifacts
├── docker-compose.yml       # Multi-service orchestration
├── start-all.sh             # Local script (non-Docker)
└── README.md
```

## Prerequisites

For Docker run (recommended):
- Docker Desktop (or Docker Engine + Compose)
- Git

For local non-Docker run:
- Node.js 18+
- Python 3.11 recommended
- npm and pip

## Quick Start (Recommended: Docker)

```bash
git clone https://github.com/mukesh-009/BhashaSetu.git
cd BhashaSetu
docker compose up -d --build
```

Open:
- Frontend: http://localhost:3000
- Backend health: http://localhost:5002/api/health
- AI health: http://localhost:5001/health

Stop:

```bash
docker compose down
```

## Local Development (Without Docker)

Run each service in a separate terminal.

1. AI service

```bash
cd ai-service
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

2. Backend

```bash
cd backend
npm install
npm start
```

3. Frontend

```bash
cd frontend
npm install
npm start
```

## API Reference

Base URL: `http://localhost:5002/api`

| Endpoint | Method | Description |
|---|---|---|
| `/health` | GET | Backend service health |
| `/languages` | GET | Returns supported language map |
| `/translate` | POST | Single text translation |
| `/translate/batch` | POST | Batch translation |
| `/tts` | POST | Text-to-speech audio response |

Example request:

```bash
curl -X POST http://localhost:5002/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello students",
    "sourceLang": "en",
    "targetLang": "hi"
  }'
```

## Supported Languages (Current)

Indian:
- Hindi (`hi`)
- Bengali (`bn`)
- Telugu (`te`)
- Marathi (`mr`)
- Tamil (`ta`)
- Gujarati (`gu`)
- Kannada (`kn`)
- Malayalam (`ml`)
- Punjabi (`pa`)
- Odia (`or`)
- Assamese (`as`)
- Nepali (`ne`)
- Urdu (`ur`)

Foreign:
- English (`en`)
- Spanish (`es`)
- French (`fr`)
- Chinese (`zh`)
- Arabic (`ar`)

## Configuration

Common backend environment variables:
- `PORT` (default: `5002` for local host usage)
- `PYTHON_SERVICE_URL` (default: `http://localhost:5001`)

Frontend:
- `REACT_APP_API_URL` (optional override for API base URL)

## Troubleshooting

### Frontend not loading on localhost

- Ensure Docker is running.
- Use `http://localhost:3000` (not `https://localhost:3000`).
- Check containers:

```bash
docker compose ps
```

### Services are up but translation is not working

- Check backend and AI service health endpoints.
- Inspect logs:

```bash
docker compose logs -f ai-service backend frontend
```

### First start is slow

On first run, the AI service downloads and initializes M2M100 model files. This may take several minutes depending on network speed.

## Development Scripts

Backend:
- `npm start` - start API server
- `npm run dev` - start with nodemon
- `npm test` - run tests

Frontend:
- `npm start` - start dev server
- `npm run build` - production build
- `npm test` - run tests

## Roadmap

- Improve language auto-detection
- Add model fallback and resilience strategy
- Add user feedback loop for translation quality
- Extend monitoring and test coverage

## Contribution

Contributions are welcome. Please open an issue for major changes before submitting a pull request.

## Project Status

Active academic/project development with deployable Docker workflow.
