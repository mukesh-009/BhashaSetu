import React, { useState } from 'react';
import './TranslationResult.css';

interface TranslationResultProps {
  text: string;
  loading: boolean;
  onSpeak: () => void;
  language: string;
}

const TranslationResult: React.FC<TranslationResultProps> = ({
  text,
  loading,
  onSpeak,
  language,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="text-panel result-panel">
      <div className="panel-header">
        <h3>{language}</h3>
        <div className="button-group">
          <button 
            className="copy-button" 
            onClick={handleCopy} 
            disabled={!text || loading}
            title="Copy to clipboard"
          >
            {copied ? '✓' : '📋'}
          </button>
          <button className="speak-button" onClick={onSpeak} disabled={!text || loading}>
            🔊
          </button>
        </div>
      </div>
      <div className="result-area">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Translating...</p>
          </div>
        ) : text ? (
          <p className="result-text">{text}</p>
        ) : (
          <p className="placeholder-text">Translation will appear here...</p>
        )}
      </div>
      {copied && <div className="copy-toast">✓ Copied to clipboard!</div>}
    </div>
  );
};

export default TranslationResult;
