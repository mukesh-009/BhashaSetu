# Progress Report 4: AI Service Integration

**Date:** February 1 - 4, 2026  
**Duration:** Week 4-5  
**Status:** ✅ Completed  

---

## 🎯 Objective
Develop and integrate the Python-based AI service that powers the translation functionality using machine learning models.

## 📋 Tasks Completed

### 1. Python Flask Service Setup
- **What We Did:**
  - Created `/ai-service` directory
  - Set up Python virtual environment
  - Created Flask application (`app.py`)
  - Configured to run on port 5001

- **Initial Setup:**
  ```bash
  cd ai-service
  python -m venv venv
  source venv/bin/activate  # On Windows: venv\Scripts\activate
  pip install flask flask-cors
  ```

### 2. Translation Service (Phase 1: Google Translate API)

#### Initial Implementation
- **Why Google Translate First:**
  - Quick prototype to test architecture
  - Reliable baseline for comparison
  - Easy integration
  - Plan: Migrate to open-source model later

- **Implementation:**
  ```python
  from googletrans import Translator

  translator = Translator()

  @app.route('/api/translate', methods=['POST'])
  def translate():
      data = request.json
      result = translator.translate(
          data['text'],
          src=data['sourceLang'],
          dest=data['targetLang']
      )
      return jsonify({
          'translatedText': result.text,
          'confidence': result.confidence
      })
  ```

### 3. Dependencies Installation

#### requirements.txt (Initial)
```
Flask==3.0.0
flask-cors==4.0.0
googletrans==4.0.0rc1
gTTS==2.5.0
SpeechRecognition==3.10.0
```

#### Why Each Dependency:
- **Flask:** Web framework for AI service API
- **flask-cors:** Handle CORS for backend communication
- **googletrans:** Initial translation service
- **gTTS:** Text-to-speech conversion
- **SpeechRecognition:** Speech-to-text conversion

### 4. API Endpoints Created

#### `/api/translate` (POST)
- **Purpose:** Main translation endpoint
- **Request:**
  ```json
  {
    "text": "Hello world",
    "sourceLang": "en",
    "targetLang": "hi"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "translatedText": "नमस्कार दुनिया",
    "confidence": 0.98,
    "model": "google-translate"
  }
  ```

#### `/api/languages` (GET)
- **Purpose:** Return supported languages
- **Returns:** List of 18 languages with codes and names

#### `/api/health` (GET)
- **Purpose:** Service health check
- **Returns:** Status and model information

#### `/api/tts` (POST)
- **Purpose:** Convert text to speech
- **Implementation:**
  ```python
  from gtts import gTTS
  import io

  @app.route('/api/tts', methods=['POST'])
  def text_to_speech():
      data = request.json
      tts = gTTS(text=data['text'], lang=data['lang'])
      audio_buffer = io.BytesIO()
      tts.write_to_fp(audio_buffer)
      audio_buffer.seek(0)
      return send_file(audio_buffer, mimetype='audio/mp3')
  ```

### 5. Language Support Configuration

#### 18 Languages Defined
```python
SUPPORTED_LANGUAGES = {
    # Indian Languages (13)
    'hi': 'Hindi',
    'bn': 'Bengali',
    'te': 'Telugu',
    'mr': 'Marathi',
    'ta': 'Tamil',
    'gu': 'Gujarati',
    'kn': 'Kannada',
    'ml': 'Malayalam',
    'pa': 'Punjabi',
    'or': 'Odia',
    'as': 'Assamese',
    'ne': 'Nepali',
    'ur': 'Urdu',
    
    # Foreign Languages (5)
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'zh': 'Chinese',
    'ar': 'Arabic'
}
```

### 6. Error Handling and Validation

#### Input Validation
```python
def validate_translation_request(data):
    required_fields = ['text', 'sourceLang', 'targetLang']
    
    # Check required fields
    for field in required_fields:
        if field not in data:
            return False, f"Missing field: {field}"
    
    # Validate text length
    if len(data['text']) > 5000:
        return False, "Text exceeds maximum length of 5000 characters"
    
    # Validate language codes
    if data['sourceLang'] not in SUPPORTED_LANGUAGES:
        return False, f"Unsupported source language: {data['sourceLang']}"
    if data['targetLang'] not in SUPPORTED_LANGUAGES:
        return False, f"Unsupported target language: {data['targetLang']}"
    
    return True, None
```

#### Error Response Format
```python
try:
    # Translation logic
except Exception as e:
    return jsonify({
        'success': False,
        'error': str(e),
        'message': 'Translation failed. Please try again.'
    }), 500
```

### 7. CORS Configuration
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://localhost:5002"],
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})
```

### 8. Environment Configuration

#### .env.example Created
```
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5001
MODEL_CACHE_DIR=./models
MAX_TEXT_LENGTH=5000
```

## 🛠️ Technologies Used

| Technology | Version | Purpose | Where Used |
|-----------|---------|---------|------------|
| Python | 3.10 | Runtime | AI service |
| Flask | 3.0.0 | Web framework | API endpoints |
| googletrans | 4.0.0rc1 | Translation (Phase 1) | Initial translation |
| gTTS | 2.5.0 | Text-to-speech | Audio generation |
| flask-cors | 4.0.0 | CORS handling | Cross-origin requests |
| SpeechRecognition | 3.10.0 | Speech-to-text | Voice input (prepared) |

## 🎯 Where We Used What

1. **Flask** - Used for:
   - Creating REST API endpoints
   - Request/response handling
   - Running AI service on port 5001
   - Routing translation requests

2. **googletrans (Initial)** - Used for:
   - Quick prototype translation
   - Baseline accuracy comparison
   - Testing full-stack integration
   - Temporary solution before M2M100

3. **gTTS** - Used for:
   - Converting translated text to speech
   - Generating audio files
   - Supporting 18 languages
   - Providing pronunciation help

4. **flask-cors** - Used for:
   - Enabling backend (5002) to call AI service (5001)
   - Handling preflight OPTIONS requests
   - Setting allowed origins and methods

## 💡 Challenges Faced

### Challenge 1: Port Configuration Issues
- **Problem:** Initial confusion about which port to use
- **Solution:** Standardized on port 5001 for AI service
- **Implementation:**
  ```python
  if __name__ == '__main__':
      app.run(host='0.0.0.0', port=5001, debug=True)
  ```
- **Lesson Learned:** Document port allocation early in project

### Challenge 2: CORS Errors with Multiple Services
- **Problem:** CORS blocking requests from backend (5002) and frontend (3000)
- **Solution:** Configured CORS to allow both origins
- **Code:**
  ```python
  CORS(app, resources={
      r"/api/*": {
          "origins": ["http://localhost:3000", "http://localhost:5002"]
      }
  })
  ```
- **Lesson Learned:** Microservices need careful CORS configuration

### Challenge 3: Google Translate API Limitations
- **Problem:** 
  - Rate limiting issues
  - Dependency on external service
  - Occasional service downtime
  - Not suitable for production
- **Solution:** Planned migration to M2M100 transformer model
- **Timeline:** Migrated on February 4, 2026 (see Progress Report 6)
- **Lesson Learned:** Open-source models provide better control and reliability

### Challenge 4: Large Text Translation Timeout
- **Problem:** Translating texts > 2000 characters caused timeouts
- **Solution:** 
  - Implemented text chunking for large inputs
  - Increased timeout to 30 seconds
  - Added progress indicators
- **Implementation:**
  ```python
  def translate_large_text(text, source, target):
      chunks = split_text_into_chunks(text, max_length=1000)
      translations = []
      for chunk in chunks:
          result = translator.translate(chunk, src=source, dest=target)
          translations.append(result.text)
      return ' '.join(translations)
  ```
- **Lesson Learned:** Chunking is essential for processing large texts

### Challenge 5: Audio File Size Management
- **Problem:** TTS generated large audio files
- **Solution:** 
  - Implemented audio compression
  - Used MP3 format instead of WAV
  - Added caching for repeated requests
- **Code:**
  ```python
  tts = gTTS(text=text, lang=lang, slow=False)
  # Saves as MP3 by default (smaller than WAV)
  ```
- **Lesson Learned:** Optimize media files for web delivery

### Challenge 6: Virtual Environment Activation Issues
- **Problem:** Team members had different OS (Windows/Mac/Linux)
- **Solution:** Created OS-specific setup scripts
- **Files Created:**
  - `start.sh` (Linux/Mac)
  - `start.bat` (Windows)
- **Lesson Learned:** Provide platform-specific instructions

## 📊 Deliverables

✅ Flask AI service running on port 5001  
✅ Translation endpoint functional  
✅ TTS endpoint working  
✅ 18 languages supported  
✅ Input validation implemented  
✅ Error handling with proper responses  
✅ CORS configured for multi-service architecture  
✅ Virtual environment setup documented  
✅ requirements.txt created  
✅ .env.example provided  
✅ Health check endpoint active  

## 🧪 Testing Performed

### API Testing with curl
```bash
# Test health endpoint
curl http://localhost:5001/api/health

# Test translation
curl -X POST http://localhost:5001/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello world",
    "sourceLang": "en",
    "targetLang": "hi"
  }'

# Test TTS
curl -X POST http://localhost:5001/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello", "lang": "en"}' \
  --output test.mp3
```

### Integration Testing
- ✅ Backend → AI Service communication
- ✅ Frontend → Backend → AI Service flow
- ✅ Error propagation through layers
- ✅ Timeout handling

## 📈 Progress Metrics

- **Time Spent:** 6 days (including migration planning)
- **Files Created:**
  - `app.py` (main AI service)
  - `requirements.txt`
  - `.env.example`
  - `start.sh` / `start.bat`
- **Lines of Code:** ~250 lines (Phase 1)
- **API Endpoints:** 4
- **Languages Supported:** 18
- **Dependencies:** 5 packages

## 🔄 Next Steps

- [ ] Migrate from Google Translate to M2M100 model
- [ ] Implement model caching for faster inference
- [ ] Add batch translation support
- [ ] Optimize model loading time
- [ ] Implement speech-to-text feature

---

**Key Takeaway:** Starting with a simple, reliable solution (Google Translate) allowed us to validate the architecture and user flow before investing in complex ML model integration. The microservices approach made it easy to swap out the translation engine later (see Progress Report 6 for M2M100 migration).
