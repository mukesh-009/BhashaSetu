from flask import Flask, request, jsonify
from flask_cors import CORS
from deep_translator import GoogleTranslator
from gtts import gTTS
import io
import os
import json
from typing import Dict, List, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Directory to store downloaded models
MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')
os.makedirs(MODELS_DIR, exist_ok=True)

# Track downloaded models
DOWNLOADED_MODELS_FILE = os.path.join(MODELS_DIR, 'downloaded.json')

def get_downloaded_models():
    if os.path.exists(DOWNLOADED_MODELS_FILE):
        with open(DOWNLOADED_MODELS_FILE, 'r') as f:
            return json.load(f)
    return []

def save_downloaded_models(models):
    with open(DOWNLOADED_MODELS_FILE, 'w') as f:
        json.dump(models, f)

# Supported languages configuration
SUPPORTED_LANGUAGES = {
    # Indian Languages
    'hi': 'Hindi', 'bn': 'Bengali', 'te': 'Telugu', 'mr': 'Marathi',
    'ta': 'Tamil', 'gu': 'Gujarati', 'kn': 'Kannada', 'ml': 'Malayalam',
    'pa': 'Punjabi', 'or': 'Odia', 'as': 'Assamese', 'ks': 'Kashmiri',
    'sd': 'Sindhi', 'ne': 'Nepali', 'sa': 'Sanskrit', 'ur': 'Urdu',
    'kok': 'Konkani', 'mai': 'Maithili', 'sat': 'Santali',
    'doi': 'Dogri', 'mni': 'Manipuri', 'brx': 'Bodo',
    # Foreign Languages
    'en': 'English', 'es': 'Spanish', 'fr': 'French',
    'zh': 'Chinese', 'ar': 'Arabic'
}

def translate_text(text: str, source_lang: str, target_lang: str) -> str:
    """Translate using Google Translate via deep-translator"""
    try:
        if source_lang == target_lang:
            return text
        
        translator = GoogleTranslator(source=source_lang, target=target_lang)
        result = translator.translate(text)
        return result
    except Exception as e:
        logger.error(f"Translation error: {str(e)}")
        raise Exception(f"Translation failed: {str(e)}")

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'service': 'AI Translation Service',
        'translator': 'Google Translate (via deep-translator)'
    })

@app.route('/translate', methods=['POST'])
def translate():
    try:
        data = request.get_json()
        text = data.get('text', '')
        source_lang = data.get('source_lang', 'auto')
        target_lang = data.get('target_lang', 'en')
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        
        if target_lang not in SUPPORTED_LANGUAGES:
            return jsonify({'error': f'Target language {target_lang} not supported'}), 400
        
        logger.info(f"Translation request: {source_lang} -> {target_lang}")
        
        # Detect language if source is auto
        detected_lang = None
        if source_lang == 'auto':
            try:
                detected_lang = GoogleTranslator(source='auto', target='en').detect(text)
                source_lang = detected_lang
                logger.info(f"Detected language: {source_lang}")
            except:
                source_lang = 'en'
        
        # Translate the text
        translated_text = translate_text(text, source_lang, target_lang)
        
        return jsonify({
            'translated_text': translated_text,
            'source_lang': source_lang,
            'target_lang': target_lang,
            'detected_lang': detected_lang,
            'confidence': 0.95,
            'method': 'google-translate'
        })
    
    except Exception as e:
        logger.error(f"Translation error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/translate/batch', methods=['POST'])
def batch_translate():
    try:
        data = request.get_json()
        texts = data.get('texts', [])
        source_lang = data.get('source_lang', 'auto')
        target_lang = data.get('target_lang', 'en')
        
        if not texts or not isinstance(texts, list):
            return jsonify({'error': 'Texts array is required'}), 400
        
        if len(texts) > 50:
            return jsonify({'error': 'Maximum 50 texts allowed'}), 400
        
        translations = []
        for text in texts:
            try:
                result = translate_text(text, source_lang, target_lang)
                translations.append(result)
            except Exception as e:
                translations.append(f"Error: {str(e)}")
        
        return jsonify({
            'translations': translations,
            'total': len(translations),
            'source_lang': source_lang,
            'target_lang': target_lang
        })
    
    except Exception as e:
        logger.error(f"Batch translation error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/tts', methods=['POST'])
def text_to_speech():
    try:
        data = request.get_json()
        text = data.get('text', '')
        lang = data.get('lang', 'en')
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        
        # Generate speech
        tts = gTTS(text=text, lang=lang, slow=False)
        
        # Save to BytesIO object
        audio_io = io.BytesIO()
        tts.write_to_fp(audio_io)
        audio_io.seek(0)
        
        return audio_io.read(), 200, {'Content-Type': 'audio/mpeg'}
    
    except Exception as e:
        logger.error(f"TTS error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/languages', methods=['GET'])
def get_languages():
    return jsonify({
        'languages': SUPPORTED_LANGUAGES,
        'total': len(SUPPORTED_LANGUAGES)
    })

@app.route('/models/status', methods=['GET'])
def get_models_status():
    """Get list of downloaded offline models"""
    try:
        downloaded = get_downloaded_models()
        return jsonify({
            'success': True,
            'downloaded': downloaded,
            'storage_path': MODELS_DIR
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/models/download', methods=['POST'])
def download_model():
    """Download an offline language model (simulated for now)"""
    try:
        data = request.get_json()
        language = data.get('language')
        
        if not language:
            return jsonify({'success': False, 'error': 'Language code required'}), 400
        
        # Simulate download - in production, real models would be downloaded
        # See OFFLINE_SETUP.md for implementation details
        downloaded = get_downloaded_models()
        if language not in downloaded:
            downloaded.append(language)
            save_downloaded_models(downloaded)
        
        return jsonify({
            'success': True,
            'message': f'Model for {language} marked as downloaded',
            'note': 'This is a simulation. See OFFLINE_SETUP.md to enable real offline models.'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/models/delete', methods=['POST'])
def delete_model():
    """Delete an offline language model"""
    try:
        data = request.get_json()
        language = data.get('language')
        
        if not language:
            return jsonify({'success': False, 'error': 'Language code required'}), 400
        
        downloaded = get_downloaded_models()
        if language in downloaded:
            downloaded.remove(language)
            save_downloaded_models(downloaded)
        
        return jsonify({
            'success': True,
            'message': f'Model for {language} removed'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
