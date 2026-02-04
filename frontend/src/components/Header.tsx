import React, { useState } from 'react';
import './Header.css';
import OfflineManager from './OfflineManager';

const Header: React.FC = () => {
  const [showOfflineManager, setShowOfflineManager] = useState(false);

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="header-main">
            <div className="logo">
              <span className="logo-text hindi">हिन्दी</span>
              <span className="logo-arrow">⇄</span>
              <span className="logo-text japanese">日本語</span>
            </div>
            <div className="header-text">
              <h1 className="header-title">Rural School AI Translator</h1>
              <p className="header-subtitle">
                Supporting 22 Indian Languages + 5 Major Foreign Languages
              </p>
            </div>
            <button 
              className="offline-button"
              onClick={() => setShowOfflineManager(true)}
              title="Manage offline language models"
            >
              📦 Offline Mode
            </button>
          </div>
        </div>
      </header>
      
      <OfflineManager 
        isOpen={showOfflineManager}
        onClose={() => setShowOfflineManager(false)}
      />
    </>
  );
};

export default Header;
