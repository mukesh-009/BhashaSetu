import React from 'react';
import './LanguageSelector.css';

interface LanguageSelectorProps {
  languages: { [key: string]: string };
  sourceLang: string;
  targetLang: string;
  onSourceChange: (lang: string) => void;
  onTargetChange: (lang: string) => void;
  onSwap: () => void;
  recentLanguages?: string[];
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  languages,
  sourceLang,
  targetLang,
  onSourceChange,
  onTargetChange,
  onSwap,
  recentLanguages = [],
}) => {
  const renderOptions = (currentLang: string) => {
    const allOptions = Object.entries(languages);
    const recentOptions = recentLanguages
      .filter(code => languages[code])
      .map(code => [code, languages[code]]);
    const otherOptions = allOptions.filter(
      ([code]) => !recentLanguages.includes(code)
    );

    return (
      <>
        {recentOptions.length > 0 && (
          <>
            <optgroup label="⭐ Recent">
              {recentOptions.map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </optgroup>
            <optgroup label="All Languages">
              {otherOptions.map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </optgroup>
          </>
        )}
        {recentOptions.length === 0 &&
          allOptions.map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))
        }
      </>
    );
  };

  return (
    <div className="language-selector">
      <div className="selector-group">
        <label>From</label>
        <select
          value={sourceLang}
          onChange={(e) => onSourceChange(e.target.value)}
          className="language-dropdown"
        >
          {renderOptions(sourceLang)}
        </select>
      </div>

      <button className="swap-button" onClick={onSwap} title="Swap languages (Ctrl+S)">
        ⇄
      </button>

      <div className="selector-group">
        <label>To</label>
        <select
          value={targetLang}
          onChange={(e) => onTargetChange(e.target.value)}
          className="language-dropdown"
        >
          {renderOptions(targetLang)}
        </select>
      </div>
    </div>
  );
};

export default LanguageSelector;
