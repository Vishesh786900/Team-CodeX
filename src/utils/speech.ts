import { Language } from '../types';

export class SpeechAssistant {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;
  private static currentAudio: HTMLAudioElement | null = null;
  private static cachedVoices: SpeechSynthesisVoice[] = [];
  private static isAudioPlaying = false;

  static {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const loadVoices = () => {
        try {
          this.cachedVoices = window.speechSynthesis.getVoices() || [];
        } catch {
          this.cachedVoices = [];
        }
      };
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }

  public static isSpeechSynthesisSupported(): boolean {
    return typeof window !== 'undefined' && ('speechSynthesis' in window || 'Audio' in window);
  }

  public static isSpeechRecognitionSupported(): boolean {
    return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  }

  public static getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    if (!this.cachedVoices.length) {
      this.cachedVoices = this.synth.getVoices() || [];
    }
    return this.cachedVoices;
  }

  /**
   * Find the most natural voice for Marathi, Hindi, or English
   */
  public static getBestVoiceForLanguage(language: Language, text?: string): SpeechSynthesisVoice | null {
    const voices = this.getAvailableVoices();
    if (!voices || voices.length === 0) return null;

    // Check if text is predominantly Devanagari script
    const hasDevanagari = text && /[\u0900-\u097F]/.test(text);
    const targetLang = (language === 'en' && hasDevanagari) ? 'hi' : language;

    if (targetLang === 'mr') {
      const mrVoice = voices.find(v => 
        v.lang.toLowerCase().includes('mr') || 
        v.name.toLowerCase().includes('marathi') ||
        v.name.includes('मराठी')
      );
      if (mrVoice) return mrVoice;

      const hiVoice = voices.find(v => 
        v.lang.toLowerCase().includes('hi') || 
        v.name.toLowerCase().includes('hindi') || 
        v.name.includes('हिन्दी') ||
        v.name.toLowerCase().includes('lekha') ||
        v.name.toLowerCase().includes('swara') ||
        v.name.toLowerCase().includes('madhur')
      );
      if (hiVoice) return hiVoice;
    }

    if (targetLang === 'hi') {
      const hiVoice = voices.find(v => 
        v.lang.toLowerCase().includes('hi') || 
        v.name.toLowerCase().includes('hindi') || 
        v.name.includes('हिन्दी') ||
        v.name.toLowerCase().includes('lekha') ||
        v.name.toLowerCase().includes('swara') ||
        v.name.toLowerCase().includes('madhur')
      );
      if (hiVoice) return hiVoice;
    }

    const inVoice = voices.find(v => v.lang.toLowerCase().includes('en-in') || v.lang.toLowerCase().includes('en_in'));
    if (inVoice) return inVoice;

    const enVoice = voices.find(v => v.lang.toLowerCase().startsWith('en'));
    return enVoice || voices[0] || null;
  }

  /**
   * Cleans text to make it sound natural and fluent in Marathi / Hindi / English TTS
   */
  public static cleanTextForSpeech(text: string): string {
    return text
      // Remove URLs
      .replace(/https?:\/\/\S+/gi, '')
      // Remove markdown bold/italics/code/headings/links
      .replace(/[*_#`~>]/g, ' ')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove emojis and UI icon symbols
      .replace(/[\u{1F300}-\u{1FAD6}\u{1F600}-\u{1F64F}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}]/gu, '')
      // Remove specific common agri symbols
      .replace(/[🌱💡✅🛡️⚠️🌾🍅🧅🐛🩺🌦️🌧️☀️🔴🟠🟢]/g, '')
      // Clean redundant punctuation and brackets
      .replace(/[\(\)\[\]\{\}]/g, ', ')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Speaks using server-side high quality Marathi / Hindi / English audio stream,
   * falling back automatically to browser SpeechSynthesis if needed.
   */
  public static speak(
    text: string,
    language: Language,
    onEnd?: () => void,
    onError?: (err?: any) => void
  ) {
    this.stop();

    const cleanText = this.cleanTextForSpeech(text);
    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    // Determine language parameter
    const hasDevanagari = /[\u0900-\u097F]/.test(cleanText);
    const effectiveLang = (language === 'en' && hasDevanagari) ? 'mr' : language;

    // 1. Try High-Fidelity Server Audio TTS first
    try {
      const audioUrl = `/api/speech/tts?lang=${encodeURIComponent(effectiveLang)}&text=${encodeURIComponent(cleanText.slice(0, 500))}`;
      const audio = new Audio();
      audio.src = audioUrl;
      this.currentAudio = audio;
      this.isAudioPlaying = true;

      audio.onended = () => {
        this.isAudioPlaying = false;
        this.currentAudio = null;
        if (onEnd) onEnd();
      };

      audio.onerror = () => {
        console.warn('Server TTS stream failed or was aborted, trying fallback SpeechSynthesis...');
        this.isAudioPlaying = false;
        this.currentAudio = null;
        this.fallbackBrowserSpeech(cleanText, effectiveLang, onEnd, onError);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio play autoplay policy blocked or aborted, falling back:', err);
          this.isAudioPlaying = false;
          this.currentAudio = null;
          this.fallbackBrowserSpeech(cleanText, effectiveLang, onEnd, onError);
        });
      }
    } catch (e) {
      this.fallbackBrowserSpeech(cleanText, effectiveLang, onEnd, onError);
    }
  }

  private static fallbackBrowserSpeech(
    cleanText: string,
    language: Language,
    onEnd?: () => void,
    onError?: (err?: any) => void
  ) {
    if (!this.synth) {
      if (onError) onError('Speech synthesis not available');
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      if (language === 'mr') {
        utterance.lang = 'mr-IN';
      } else if (language === 'hi') {
        utterance.lang = 'hi-IN';
      } else {
        utterance.lang = 'en-IN';
      }

      const bestVoice = this.getBestVoiceForLanguage(language, cleanText);
      if (bestVoice) {
        utterance.voice = bestVoice;
        utterance.lang = bestVoice.lang;
      }

      utterance.rate = language === 'mr' || language === 'hi' ? 0.90 : 0.95;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        this.currentUtterance = null;
        if (onError) onError(e);
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    } catch (err) {
      console.warn('Browser speech synthesis error:', err);
      if (onError) onError(err);
    }
  }

  public static pause() {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause();
      this.isAudioPlaying = false;
    }
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  public static resume() {
    if (this.currentAudio && this.currentAudio.paused) {
      this.currentAudio.play().catch(() => {});
      this.isAudioPlaying = true;
    }
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public static stop() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.removeAttribute('src');
        this.currentAudio.load();
      } catch {
        // ignore
      }
      this.currentAudio = null;
      this.isAudioPlaying = false;
    }
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {
        // ignore
      }
      this.currentUtterance = null;
    }
  }

  public static isSpeaking(): boolean {
    return Boolean(
      this.isAudioPlaying ||
      (this.currentAudio && !this.currentAudio.paused) ||
      (this.synth && (this.synth.speaking || this.currentUtterance !== null))
    );
  }

  public static createRecognition(
    language: Language,
    onResult: (transcript: string) => void,
    onError: (err: any) => void,
    onEnd: () => void
  ): any {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    if (language === 'mr') {
      recognition.lang = 'mr-IN';
    } else if (language === 'hi') {
      recognition.lang = 'hi-IN';
    } else {
      recognition.lang = 'en-IN';
    }

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        onResult(finalTranscript);
      } else if (event.results[0] && event.results[0][0]) {
        onResult(event.results[0][0].transcript);
      }
    };

    recognition.onerror = (event: any) => {
      onError(event.error);
    };

    recognition.onend = () => {
      onEnd();
    };

    return recognition;
  }
}
