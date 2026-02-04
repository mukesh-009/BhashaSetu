import React, { useState, useEffect } from 'react';
import './App.css';
import TranslationService from './services/TranslationService';
import LanguageSelector from './components/LanguageSelector';
import TextInput from './components/TextInput';
import TranslationResult from './components/TranslationResult';
import Header from './components/Header';
import { Language, TranslationResponse } from './types';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';

// Language code to Speech Recognition locale mapping
const langToLocaleMap: { [key: string]: string } = {
  'en': 'en-US', 'hi': 'hi-IN', 'bn': 'bn-IN', 'te': 'te-IN',
  'mr': 'mr-IN', 'ta': 'ta-IN', 'gu': 'gu-IN', 'kn': 'kn-IN',
  'ml': 'ml-IN', 'pa': 'pa-IN', 'ur': 'ur-PK', 'es': 'es-ES',
  'fr': 'fr-FR', 'zh': 'zh-CN', 'ar': 'ar-SA'
};

const App: React.FC = () => {
  const [languages, setLanguages] = useState<{ [key: string]: string }>({});
  const [sourceLang, setSourceLang] = useState<string>('en');
  const [targetLang, setTargetLang] = useState<string>('hi');
  const [inputText, setInputText] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [recentLanguages, setRecentLanguages] = useState<string[]>([]);

  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening,
    isSupported: isSpeechSupported 
  } = useSpeechRecognition();

  useEffect(() => {
    loadLanguages();
    loadRecentLanguages();
  }, []);

  // Update input text when speech recognition provides transcript
  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  // Auto-translate on type (debounced)
  useEffect(() => {
    if (!inputText.trim() || inputText.length < 2) return;

    const timeoutId = setTimeout(() => {
      handleTranslate();
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [inputText, sourceLang, targetLang]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleTranslate();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSwapLanguages();
      }
      if (e.key === 'Escape') {
        setInputText('');
        setTranslatedText('');
        setError('');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [inputText, sourceLang, targetLang, translatedText]);

  const loadLanguages = async () => {
    try {
      const langs = await TranslationService.getLanguages();
      setLanguages(langs.all);
    } catch (err) {
      console.error('Failed to load languages:', err);
      setError('Failed to load languages');
    }
  };

  const loadRecentLanguages = () => {
    const recent = localStorage.getItem('recentLanguages');
    if (recent) {
      setRecentLanguages(JSON.parse(recent));
    }
  };

  const updateRecentLanguages = (lang: string) => {
    const updated = [lang, ...recentLanguages.filter(l => l !== lang)].slice(0, 5);
    setRecentLanguages(updated);
    localStorage.setItem('recentLanguages', JSON.stringify(updated));
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to translate');
      return;
    }

    setLoading(true);
    setError('');
    setTranslatedText('');

    try {
      const result: TranslationResponse = await TranslationService.translate(
        inputText,
        sourceLang,
        targetLang
      );
      setTranslatedText(result.data.translatedText);
      updateRecentLanguages(targetLang);
    } catch (err: any) {
      setError(err.message || 'Translation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStartRecording = () => {
    const locale = langToLocaleMap[sourceLang] || 'en-US';
    startListening(locale);
  };

  const handleStopRecording = () => {
    stopListening();
  };

  const handleSwapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const handleTextToSpeech = async (text: string, lang: string) => {
    try {
      await TranslationService.textToSpeech(text, lang);
    } catch (err) {
      console.error('TTS failed:', err);
    }
  };

  return (
    <div className="App">
      <Header />
      
      <div className="container">
        <div className="translation-container">
          <LanguageSelector
            languages={languages}
            sourceLang={sourceLang}
            targetLang={targetLang}
            onSourceChange={setSourceLang}
            onTargetChange={setTargetLang}
            onSwap={handleSwapLanguages}
            recentLanguages={recentLanguages}
          />

          <div className="translation-panels">
            <TextInput
              value={inputText}
              onChange={setInputText}
              onSpeak={() => handleTextToSpeech(inputText, sourceLang)}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              isRecording={isListening}
              isRecordingSupported={isSpeechSupported}
              language={languages[sourceLang] || 'Source'}
            />

            <TranslationResult
              text={translatedText}
              loading={loading}
              onSpeak={() => handleTextToSpeech(translatedText, targetLang)}
              language={languages[targetLang] || 'Target'}
            />
          </div>

          <button
            className="translate-button"
            onClick={handleTranslate}
            disabled={loading || !inputText.trim()}
            title="Translate (Ctrl+Enter)"
          >
            {loading ? 'Translating...' : 'Translate'}
          </button>

          <div className="keyboard-hints">
            <span>💡 <strong>Ctrl+Enter</strong> to translate</span>
            <span><strong>Ctrl+S</strong> to swap</span>
            <span><strong>Esc</strong> to clear</span>
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="features-section">
          <h2>Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🗣️</div>
              <h3>Voice Input & Output</h3>
              <p>Speak to translate and listen to results</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌏</div>
              <h3>27 Languages</h3>
              <p>22 Indian + 5 foreign languages supported</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎓</div>
              <h3>Rural Education</h3>
              <p>Designed for rural school accessibility</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast & Accurate</h3>
              <p>AI-powered instant translations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
