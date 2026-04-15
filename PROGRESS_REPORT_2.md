# Progress Report 2: Backend API Development

**Date:** January 25 - February 1, 2026  
**Duration:** Week 2-3  
**Status:** ✅ Completed  

---

## 🎯 Objective
Develop a robust Node.js backend API that serves as a gateway between the React frontend and Python AI service.

## 📋 Tasks Completed

### 1. Backend Setup
- **What We Did:**
  - Created `/backend` directory
  - Initialized Node.js project with `npm init`
  - Created `package.json` with dependencies
  - Set up Express server on port 5002

- **Dependencies Installed:**
  ```json
  {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "axios": "^1.6.0",
    "dotenv": "^16.0.3",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0"
  }
  ```

### 2. API Endpoints Created

#### `/api/health` (GET)
- **Purpose:** Health check endpoint
- **Response:** Server status and uptime
- **Implementation:**
  ```javascript
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  ```

#### `/api/languages` (GET)
- **Purpose:** Get list of supported languages
- **Returns:** Array of 18 language objects with code, name, and native name
- **Example Response:**
  ```json
  {
    "success": true,
    "languages": [
      { "code": "hi", "name": "Hindi", "nativeName": "हिन्दी" },
      { "code": "en", "name": "English", "nativeName": "English" }
    ]
  }
  ```

#### `/api/translate` (POST)
- **Purpose:** Translate text between languages
- **Request Body:**
  ```json
  {
    "text": "Hello, how are you?",
    "sourceLang": "en",
    "targetLang": "hi"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "originalText": "Hello, how are you?",
      "translatedText": "नमस्ते, आप कैसे हैं?",
      "sourceLang": "en",
      "targetLang": "hi"
    }
  }
  ```

#### `/api/translate/batch` (POST)
- **Purpose:** Translate multiple texts at once
- **Functionality:** Batch processing for efficiency

#### `/api/tts` (POST)
- **Purpose:** Convert text to speech
- **Returns:** Audio file or audio URL

### 3. Middleware Configuration

- **CORS Setup:**
  - Enabled cross-origin requests from frontend (port 3000)
  - Configured allowed origins, methods, and headers
  ```javascript
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
  ```

- **Helmet.js Security:**
  - Added security headers
  - Protection against common vulnerabilities
  - XSS protection enabled

- **Request Logging:**
  - Morgan middleware for HTTP request logging
  - Helpful for debugging and monitoring

- **JSON Parsing:**
  - Express JSON middleware for request body parsing
  - Size limits configured (10MB max)

### 4. Integration with AI Service

- **Axios HTTP Client:**
  - Used axios to communicate with Python AI service (port 5001)
  - Configured timeout (30 seconds)
  - Error handling and retry logic

- **Connection Flow:**
  ```
  Frontend (3000) → Backend (5002) → AI Service (5001)
  ```

### 5. Error Handling

- **Global Error Handler:**
  ```javascript
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  });
  ```

- **Validation:**
  - Input validation for language codes
  - Text length validation (max 5000 characters)
  - Required field validation

## 🛠️ Technologies Used

| Technology | Version | Purpose | Where Used |
|-----------|---------|---------|------------|
| Node.js | v20 | Runtime environment | Backend server |
| Express.js | ^4.18.2 | Web framework | API routing |
| CORS | ^2.8.5 | Cross-origin requests | Middleware |
| Axios | ^1.6.0 | HTTP client | AI service communication |
| Helmet | ^7.1.0 | Security headers | Security middleware |
| Morgan | ^1.10.0 | Request logging | Debugging |
| dotenv | ^16.0.3 | Environment variables | Configuration |

## 🎯 Where We Used What

1. **Express.js** - Used for:
   - Routing API endpoints
   - Middleware management
   - HTTP server creation
   - Request/response handling

2. **Axios** - Used for:
   - Calling Python AI service
   - Forwarding translation requests
   - Handling AI service responses
   - Timeout management

3. **CORS** - Used for:
   - Allowing frontend (port 3000) to call backend (port 5002)
   - Handling preflight requests
   - Setting allowed headers

4. **dotenv** - Used for:
   - Loading environment variables
   - Storing AI service URL
   - Configuration management

## 💡 Challenges Faced

### Challenge 1: Port Conflict with Existing Services
- **Problem:** Port 5000 already in use by macOS AirPlay
- **Solution:** Changed backend port to 5002
- **Code Change:**
  ```javascript
  const PORT = process.env.PORT || 5002;
  ```
- **Lesson Learned:** Always use configurable ports via environment variables

### Challenge 2: CORS Errors in Development
- **Problem:** Frontend couldn't call backend due to CORS policy
- **Solution:** Properly configured CORS middleware
- **Implementation:**
  ```javascript
  app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
  }));
  ```
- **Lesson Learned:** CORS configuration is critical for frontend-backend communication

### Challenge 3: Handling AI Service Timeouts
- **Problem:** Slow translation causing frontend timeout
- **Solution:** Implemented proper timeout handling and loading states
- **Code:**
  ```javascript
  const aiService = axios.create({
    baseURL: 'http://localhost:5001',
    timeout: 30000 // 30 seconds
  });
  ```
- **Lesson Learned:** Always set reasonable timeouts for external services

### Challenge 4: Language Code Validation
- **Problem:** Users could send invalid language codes
- **Solution:** Created validation middleware
- **Implementation:**
  ```javascript
  const validLanguages = ['en', 'hi', 'bn', 'te', /* ... */];
  
  function validateLanguage(req, res, next) {
    const { sourceLang, targetLang } = req.body;
    if (!validLanguages.includes(sourceLang) || 
        !validLanguages.includes(targetLang)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid language code'
      });
    }
    next();
  }
  ```
- **Lesson Learned:** Input validation prevents unnecessary calls to AI service

### Challenge 5: Error Response Consistency
- **Problem:** Different error formats from various parts of application
- **Solution:** Standardized error response format
- **Format:**
  ```json
  {
    "success": false,
    "error": "Error message here",
    "details": "Optional detailed information"
  }
  ```
- **Lesson Learned:** Consistent API responses make frontend error handling easier

## 📊 Deliverables

✅ Backend server running on port 5002  
✅ 5 RESTful API endpoints implemented  
✅ CORS configured for frontend integration  
✅ Security middleware (Helmet) enabled  
✅ Request logging with Morgan  
✅ Error handling implemented  
✅ Language validation working  
✅ Integration with AI service (port 5001) tested  

## 🧪 Testing Performed

### Manual Testing with cURL
```bash
# Health check
curl http://localhost:5002/api/health

# Get languages
curl http://localhost:5002/api/languages

# Translate text
curl -X POST http://localhost:5002/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello",
    "sourceLang": "en",
    "targetLang": "hi"
  }'
```

### Postman Testing
- Created Postman collection with all endpoints
- Tested happy paths and error cases
- Verified response formats

## 📈 Progress Metrics

- **Time Spent:** 7 days
- **Files Created:** 
  - `server.js` (main backend file)
  - `package.json`
  - `.env.example`
  - `Dockerfile`
- **Lines of Code:** ~300 lines
- **API Endpoints:** 5
- **Dependencies:** 7 packages

## 🔄 Next Steps

- [ ] Develop React frontend UI
- [ ] Integrate frontend with backend APIs
- [ ] Create language selector component
- [ ] Implement translation form

---

**Key Takeaway:** A well-designed API gateway simplifies frontend development and provides a clean separation between UI and AI logic. Proper error handling and validation at the backend level prevents many issues downstream.
