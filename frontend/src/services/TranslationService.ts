import axios from 'axios';
import { TranslationResponse, LanguagesResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

class TranslationService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  async getLanguages(): Promise<LanguagesResponse['data']> {
    try {
      const response = await this.api.get<LanguagesResponse>('/languages');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch languages');
    }
  }

  async translate(
    text: string,
    sourceLang: string,
    targetLang: string
  ): Promise<TranslationResponse> {
    try {
      const response = await this.api.post<TranslationResponse>('/translate', {
        text,
        sourceLang,
        targetLang,
      });
      
      // Show offline mode indicator if available
      if (response.data.offlineMode) {
        console.log('🔌 Translation completed using offline mode');
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Translation failed');
    }
  }

  async textToSpeech(text: string, lang: string): Promise<void> {
    try {
      const response = await this.api.post(
        '/tts',
        { text, lang },
        { responseType: 'blob' }
      );
      
      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      await audio.play();
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Text-to-speech failed');
    }
  }

  async batchTranslate(
    texts: string[],
    sourceLang: string,
    targetLang: string
  ): Promise<any> {
    try {
      const response = await this.api.post('/translate/batch', {
        texts,
        sourceLang,
        targetLang,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Batch translation failed');
    }
  }
}

export default new TranslationService();
