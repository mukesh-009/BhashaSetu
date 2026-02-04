const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Supported Languages Configuration
const SUPPORTED_LANGUAGES = {
  indian: {
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
    'ks': 'Kashmiri',
    'sd': 'Sindhi',
    'ne': 'Nepali',
    'sa': 'Sanskrit',
    'ur': 'Urdu',
    'kok': 'Konkani',
    'mai': 'Maithili',
    'sat': 'Santali',
    'doi': 'Dogri',
    'mni': 'Manipuri',
    'brx': 'Bodo'
  },
  foreign: {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'zh': 'Chinese',
    'ar': 'Arabic'
  }
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Rural School Translation API is running' });
});

// Get all supported languages
app.get('/api/languages', (req, res) => {
  res.json({
    success: true,
    data: {
      indian: SUPPORTED_LANGUAGES.indian,
      foreign: SUPPORTED_LANGUAGES.foreign,
      all: { ...SUPPORTED_LANGUAGES.indian, ...SUPPORTED_LANGUAGES.foreign }
    }
  });
});

// Translate text
app.post('/api/translate', async (req, res) => {
  try {
    const { text, sourceLang, targetLang } = req.body;

    // Validation
    if (!text || !sourceLang || !targetLang) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: text, sourceLang, targetLang'
      });
    }

    if (text.length > 5000) {
      return res.status(400).json({
        success: false,
        error: 'Text length exceeds maximum limit of 5000 characters'
      });
    }

    // Call Python AI service
    const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:5001';
    const response = await axios.post(`${pythonServiceUrl}/translate`, {
      text,
      source_lang: sourceLang,
      target_lang: targetLang
    }, {
      timeout: 30000 // 30 seconds timeout
    });

    res.json({
      success: true,
      data: {
        originalText: text,
        translatedText: response.data.translated_text,
        sourceLang,
        targetLang,
        confidence: response.data.confidence || null,
        detectedLang: response.data.detected_lang || null
      }
    });

  } catch (error) {
    console.error('Translation error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Translation service error',
      message: error.response?.data?.error || error.message
    });
  }
});

// Text-to-Speech
app.post('/api/tts', async (req, res) => {
  try {
    const { text, lang } = req.body;

    if (!text || !lang) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: text, lang'
      });
    }

    const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:5001';
    const response = await axios.post(`${pythonServiceUrl}/tts`, {
      text,
      lang
    }, {
      timeout: 30000,
      responseType: 'arraybuffer'
    });

    res.set('Content-Type', 'audio/mpeg');
    res.send(response.data);

  } catch (error) {
    console.error('TTS error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Text-to-speech service error'
    });
  }
});

// Batch translation
app.post('/api/translate/batch', async (req, res) => {
  try {
    const { texts, sourceLang, targetLang } = req.body;

    if (!texts || !Array.isArray(texts) || !sourceLang || !targetLang) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request format'
      });
    }

    if (texts.length > 50) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 50 texts allowed per batch'
      });
    }

    const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:5001';
    const response = await axios.post(`${pythonServiceUrl}/translate/batch`, {
      texts,
      source_lang: sourceLang,
      target_lang: targetLang
    }, {
      timeout: 60000
    });

    res.json({
      success: true,
      data: response.data.translations
    });

  } catch (error) {
    console.error('Batch translation error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Batch translation service error'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/health`);
});

module.exports = app;
