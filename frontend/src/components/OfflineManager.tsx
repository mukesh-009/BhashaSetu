import React, { useState, useEffect } from 'react';
import './OfflineManager.css';

interface LanguageModel {
  code: string;
  name: string;
  size: string;
  downloaded: boolean;
  downloading: boolean;
  progress: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const OfflineManager: React.FC<Props> = ({ isOpen, onClose }) => {
  const [models, setModels] = useState<LanguageModel[]>([]);
  const [loading, setLoading] = useState(true);

  const popularLanguages = [
    { code: 'en', name: 'English', size: '250 MB' },
    { code: 'hi', name: 'Hindi', size: '220 MB' },
    { code: 'bn', name: 'Bengali', size: '210 MB' },
    { code: 'ta', name: 'Tamil', size: '205 MB' },
    { code: 'te', name: 'Telugu', size: '208 MB' },
    { code: 'mr', name: 'Marathi', size: '198 MB' },
    { code: 'gu', name: 'Gujarati', size: '195 MB' },
    { code: 'kn', name: 'Kannada', size: '200 MB' },
    { code: 'ml', name: 'Malayalam', size: '202 MB' },
    { code: 'pa', name: 'Punjabi', size: '190 MB' },
    { code: 'es', name: 'Spanish', size: '240 MB' },
    { code: 'fr', name: 'French', size: '235 MB' },
    { code: 'zh-cn', name: 'Chinese', size: '280 MB' },
    { code: 'ar', name: 'Arabic', size: '230 MB' },
  ];

  useEffect(() => {
    if (isOpen) {
      loadModelStatus();
    }
  }, [isOpen]);

  const loadModelStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/models/status');
      const data = await response.json();
      
      const modelList = popularLanguages.map(lang => ({
        ...lang,
        downloaded: data.downloaded?.includes(lang.code) || false,
        downloading: false,
        progress: 0,
      }));
      
      setModels(modelList);
    } catch (error) {
      // If API not available, show all as not downloaded
      const modelList = popularLanguages.map(lang => ({
        ...lang,
        downloaded: false,
        downloading: false,
        progress: 0,
      }));
      setModels(modelList);
    }
    setLoading(false);
  };

  const downloadModel = async (code: string) => {
    setModels(prev => prev.map(m => 
      m.code === code ? { ...m, downloading: true, progress: 0 } : m
    ));

    try {
      // Start progress animation
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setModels(prev => prev.map(m => 
          m.code === code ? { ...m, progress: Math.min(progress, 95) } : m
        ));
      }, 2000);

      const response = await fetch('http://localhost:5001/models/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: code }),
      });

      clearInterval(interval);

      if (response.ok) {
        const result = await response.json();
        
        setModels(prev => prev.map(m => 
          m.code === code ? { ...m, downloading: false, downloaded: true, progress: 100 } : m
        ));
        
        setTimeout(() => {
          setModels(prev => prev.map(m => 
            m.code === code ? { ...m, progress: 0 } : m
          ));
        }, 2000);
        
        alert(`✅ ${models.find(m => m.code === code)?.name} model downloaded successfully! You can now use it offline.`);
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      console.error('Error downloading model:', error);
      setModels(prev => prev.map(m => 
        m.code === code ? { ...m, downloading: false, progress: 0 } : m
      ));
      alert(`❌ Failed to download model. This may take a few minutes and requires good internet. Error: ${error}`);
    }
  };

  const deleteModel = async (code: string) => {
    if (!window.confirm(`Delete offline model for ${models.find(m => m.code === code)?.name}?`)) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/models/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: code }),
      });

      if (response.ok) {
        setModels(prev => prev.map(m => 
          m.code === code ? { ...m, downloaded: false } : m
        ));
      }
    } catch (error) {
      console.error('Error deleting model:', error);
      alert('Failed to delete model. Please try again.');
    }
  };

  if (!isOpen) return null;

  const totalSize = models.filter(m => m.downloaded).reduce((acc, m) => {
    return acc + parseInt(m.size);
  }, 0);

  return (
    <div className="offline-manager-overlay" onClick={onClose}>
      <div className="offline-manager-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📦 Offline Language Models</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-info">
          <p className="info-text">Choose languages to download for offline translation. Nothing downloads automatically - click "⬇️ Download" button for languages you want. Each model is ~200-300MB.</p>
          <div className="storage-info">
            <span>💾 Storage Used: <strong>{totalSize} MB</strong></span>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading models...</div>
        ) : (
          <div className="models-list">
            {models.map(model => (
              <div key={model.code} className="model-item">
                <div className="model-info">
                  <div className="model-name">
                    {model.name}
                    {model.downloaded && <span className="badge">✓ Offline</span>}
                  </div>
                  <div className="model-size">{model.size}</div>
                </div>

                <div className="model-actions">
                  {model.downloading ? (
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${model.progress}%` }}
                        />
                      </div>
                      <span className="progress-text">{model.progress}%</span>
                    </div>
                  ) : model.downloaded ? (
                    <button 
                      className="delete-button"
                      onClick={() => deleteModel(model.code)}
                    >
                      🗑️ Delete
                    </button>
                  ) : (
                    <button 
                      className="download-button"
                      onClick={() => downloadModel(model.code)}
                    >
                      ⬇️ Download
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="modal-footer">
          <p className="footer-note">
            💡 <strong>Tip:</strong> Downloaded models work without internet. Online translation is used as fallback.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfflineManager;
