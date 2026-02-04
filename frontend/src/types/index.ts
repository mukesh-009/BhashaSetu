export interface Language {
  code: string;
  name: string;
}

export interface TranslationRequest {
  text: string;
  sourceLang: string;
  targetLang: string;
}

export interface TranslationResponse {
  success: boolean;
  data: {
    originalText: string;
    translatedText: string;
    sourceLang: string;
    targetLang: string;
    confidence: number | null;
    detectedLang: string | null;
  };
  offlineMode?: boolean;
}

export interface LanguagesResponse {
  success: boolean;
  data: {
    indian: { [key: string]: string };
    foreign: { [key: string]: string };
    all: { [key: string]: string };
  };
}

export interface TTSRequest {
  text: string;
  lang: string;
}
