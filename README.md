# 🎓 Rural School AI Translator

An AI-powered translation system designed specifically for rural schools, supporting **22 Indian languages** and **5 major foreign languages**. This project aims to break language barriers in education and empower students and teachers with multilingual capabilities.

## 🌟 Features

- ✅ **27 Languages Supported**
  - 22 Indian Languages: Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Kashmiri, Sindhi, Nepali, Sanskrit, Urdu, Konkani, Maithili, Santali, Dogri, Manipuri, Bodo
  - 5 Foreign Languages: English, Spanish, French, Chinese, Arabic

- 🗣️ **Text-to-Speech (TTS)**: Listen to translations in native pronunciation
- 🔄 **Batch Translation**: Translate multiple texts at once
- ⚡ **Fast & Accurate**: AI-powered with hybrid translation approach (MarianMT + Google Translate)
- 🎨 **Modern UI**: Beautiful, responsive React interface
- 🐳 **Docker Ready**: Easy deployment with Docker Compose
- 🔒 **Secure**: Built with security best practices

## 🏗️ Architecture

```
┌─────────────────┐
│   React Frontend │ (TypeScript, Modern UI)
│   Port: 3000     │
└────────┬─────────┘
         │
         ↓
┌─────────────────┐
│  Node.js Backend │ (Express API)
│   Port: 5000     │
└────────┬─────────┘
         │
         ↓
┌─────────────────┐
│  Python AI Service│ (Flask + Transformers)
│   Port: 5001     │ (MarianMT + Google Translate)
└──────────────────┘
```

## 📋 Prerequisites

- **Node.js**: v16 or higher
- **Python**: v3.8 or higher
- **npm** or **yarn**
- **pip**
- **Docker** (optional, for containerized deployment)

## 🚀 Quick Start

### Option 1: Local Development

#### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd TP
```

#### 2. Setup Backend (Node.js)
```bash
cd backend
npm install
cp .env.example .env
npm start
# Backend will run on http://localhost:5000
```

#### 3. Setup AI Service (Python)
```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python app.py
# AI Service will run on http://localhost:5001
```

#### 4. Setup Frontend (React)
```bash
cd frontend
npm install
npm start
# Frontend will run on http://localhost:3000
```

### Option 2: Docker Deployment

```bash
# Build and run all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# AI Service: http://localhost:5001
```

## 📁 Project Structure

```
TP/
├── backend/                 # Node.js Express API
│   ├── server.js           # Main server file
│   ├── package.json        # Dependencies
│   ├── Dockerfile          # Docker configuration
│   └── .env.example        # Environment variables template
│
├── ai-service/             # Python Flask AI Service
│   ├── app.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile          # Docker configuration
│   └── .env.example        # Environment variables template
│
├── frontend/               # React TypeScript Frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx         # Main App component
│   │   └── index.tsx       # Entry point
│   ├── public/             # Static files
│   ├── package.json        # Dependencies
│   ├── Dockerfile          # Docker configuration
│   └── nginx.conf          # Nginx configuration
│
├── docker-compose.yml      # Docker Compose configuration
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🔧 API Endpoints

### Backend API (Port 5000)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/languages` | GET | Get all supported languages |
| `/api/translate` | POST | Translate text |
| `/api/translate/batch` | POST | Batch translate multiple texts |
| `/api/tts` | POST | Text-to-speech conversion |

### Example API Usage

#### Translate Text
```bash
curl -X POST http://localhost:5000/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, how are you?",
    "sourceLang": "en",
    "targetLang": "hi"
  }'
```

#### Response
```json
{
  "success": true,
  "data": {
    "originalText": "Hello, how are you?",
    "translatedText": "नमस्ते, आप कैसे हैं?",
    "sourceLang": "en",
    "targetLang": "hi",
    "confidence": 0.95,
    "detectedLang": null
  }
}
```

## 🌐 Supported Languages

### Indian Languages (22)
- Hindi (hi)
- Bengali (bn)
- Telugu (te)
- Marathi (mr)
- Tamil (ta)
- Gujarati (gu)
- Kannada (kn)
- Malayalam (ml)
- Punjabi (pa)
- Odia (or)
- Assamese (as)
- Kashmiri (ks)
- Sindhi (sd)
- Nepali (ne)
- Sanskrit (sa)
- Urdu (ur)
- Konkani (kok)
- Maithili (mai)
- Santali (sat)
- Dogri (doi)
- Manipuri (mni)
- Bodo (brx)

### Foreign Languages (5)
- English (en)
- Spanish (es)
- French (fr)
- Chinese (zh)
- Arabic (ar)

## 🎨 Frontend Features

- **Modern UI**: Beautiful gradient design with smooth animations
- **Responsive**: Works on desktop, tablet, and mobile
- **Language Swap**: Quick swap between source and target languages
- **Text-to-Speech**: Listen to both input and output text
- **Character Counter**: Real-time character count (max 5000)
- **Loading States**: Clear feedback during translation
- **Error Handling**: User-friendly error messages

## 🔐 Security Features

- Helmet.js for security headers
- CORS configuration
- Input validation
- Rate limiting ready
- Environment variables for sensitive data

## 📊 Performance

- **Translation Speed**: < 2 seconds for most language pairs
- **Concurrent Users**: Supports multiple simultaneous translations
- **Caching**: Model caching for faster repeated translations
- **Scalable**: Microservices architecture for easy scaling

## 🛠️ Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Building for Production
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process on port 5000 (macOS/Linux)
   lsof -ti:5000 | xargs kill -9
   
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

2. **Python Dependencies Not Installing**
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt --no-cache-dir
   ```

3. **Frontend Not Connecting to Backend**
   - Check `.env` file in frontend has correct `REACT_APP_API_URL`
   - Ensure backend is running on port 5000
   - Check CORS settings in backend

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Hugging Face Transformers for MarianMT models
- Google Translate API for fallback translation
- React and TypeScript community
- All contributors and supporters

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

## 🗺️ Roadmap

- [ ] Add speech-to-text (voice input)
- [ ] Implement user authentication
- [ ] Add translation history
- [ ] Support document translation
- [ ] Add offline mode
- [ ] Mobile app development
- [ ] Add more regional Indian languages

---

**Made with ❤️ for Rural Education**
