import React from 'react';
import './TextInput.css';

interface TextInputProps {
  value: string;
  onChange: (text: string) => void;
  onSpeak: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  isRecording: boolean;
  isRecordingSupported: boolean;
  language: string;
}

const TextInput: React.FC<TextInputProps> = ({ 
  value, 
  onChange, 
  onSpeak, 
  onStartRecording,
  onStopRecording,
  isRecording,
  isRecordingSupported,
  language 
}) => {
  return (
    <div className="text-panel">
      <div className="panel-header">
        <h3>{language}</h3>
        <div className="button-group">
          {isRecordingSupported && (
            <button 
              className={`mic-button ${isRecording ? 'recording' : ''}`}
              onClick={isRecording ? onStopRecording : onStartRecording}
              title={isRecording ? 'Stop recording' : 'Start voice input'}
            >
              {isRecording ? '⏹️' : '🎤'}
            </button>
          )}
          <button className="speak-button" onClick={onSpeak} disabled={!value}>
            🔊
          </button>
        </div>
      </div>
      {isRecording && (
        <div className="recording-indicator">
          🎤 Listening... Speak now
        </div>
      )}
      <textarea
        className="text-area"
        placeholder="Enter text to translate or click the microphone to speak..."
        value={value}
        onChange={(e) => {
          if (e.target.value.length <= 5000) {
            onChange(e.target.value);
          }
        }}
        rows={8}
        maxLength={5000}
      />
      <div className={`char-count ${value.length > 4500 ? 'char-limit-warning' : ''}`}>
        {value.length} / 5000 characters
      </div>
    </div>
  );
};

export default TextInput;
