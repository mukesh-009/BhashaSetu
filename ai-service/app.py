from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import M2M100ForConditionalGeneration, M2M100Tokenizer
import torch
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

# Initialize M2M100 model and tokenizer
MODEL_NAME = "facebook/m2m100_418M"
logger.info(f"Loading M2M100 model: {MODEL_NAME}")

try:
    tokenizer = M2M100Tokenizer.from_pretrained(MODEL_NAME)
    model = M2M100ForConditionalGeneration.from_pretrained(MODEL_NAME)
    
    # Use GPU if available, otherwise CPU
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = model.to(device)
    logger.info(f"Model loaded successfully on {device}")
except Exception as e:
    logger.error(f"Failed to load model: {str(e)}")
    model = None
    tokenizer = None

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

# Supported languages by M2M100 model
SUPPORTED_LANGUAGES = {
    # Indian Languages (13 supported by M2M100)
    'hi': 'Hindi', 'bn': 'Bengali', 'te': 'Telugu', 'mr': 'Marathi',
    'ta': 'Tamil', 'gu': 'Gujarati', 'kn': 'Kannada', 'ml': 'Malayalam',
    'pa': 'Punjabi', 'or': 'Odia', 'as': 'Assamese', 'ne': 'Nepali',
    'ur': 'Urdu',
    # Foreign Languages (5)
    'en': 'English', 'es': 'Spanish', 'fr': 'French',
    'zh': 'Chinese', 'ar': 'Arabic'
}

def translate_text(text: str, source_lang: str, target_lang: str) -> str:
    """Translate using M2M100 transformer model"""
    try:
        if model is None or tokenizer is None:
            raise Exception("Model not loaded")
        
        if source_lang == target_lang:
            return text
        
        # Set source language
        tokenizer.src_lang = source_lang
        
        # Tokenize input
        encoded = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
        
        # Move to device
        device = next(model.parameters()).device
        encoded = {k: v.to(device) for k, v in encoded.items()}
        
        # Generate translation
        forced_bos_token_id = tokenizer.get_lang_id(target_lang)
        generated_tokens = model.generate(
            **encoded,
            forced_bos_token_id=forced_bos_token_id,
            max_length=512,
            num_beams=5,
            early_stopping=True
        )
        
        # Decode output
        translated_text = tokenizer.batch_decode(generated_tokens, skip_special_tokens=True)[0]
        
        return translated_text
        
    except Exception as e:
        logger.error(f"Translation error: {str(e)}")
        raise Exception(f"Translation failed: {str(e)}")

@app.route('/health', methods=['GET'])
def health_check():
    model_status = "loaded" if model is not None else "not loaded"
    device = "cuda" if torch.cuda.is_available() else "cpu"
    
    return jsonify({
        'status': 'ok',
        'service': 'AI Translation Service (M2M100 Transformers)',
        'model': MODEL_NAME,
        'model_status': model_status,
        'device': device,
        'supported_languages': len(SUPPORTED_LANGUAGES)
    })

@app.route('/translate', methods=['POST'])
def translate():
    try:
        data = request.get_json()
        text = data.get('text', '')
        sousource_lang not in SUPPORTED_LANGUAGES:
            return jsonify({'error': f'Source language {source_lang} not supported'}), 400
            
        if target_lang not in SUPPORTED_LANGUAGES:
            return jsonify({'error': f'Target language {target_lang} not supported'}), 400
        
        logger.info(f"Translation request: {source_lang} -> {target_lang}")
        
        # Translate the text using M2M100
        translated_text = translate_text(text, source_lang, target_lang)
        
        return jsonify({
            'translated_text': translated_text,
            'source_lang': source_lang,
            'target_lang': target_lang,
            'confidence': 0.95,
            'method': 'transformers-m2m100
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
