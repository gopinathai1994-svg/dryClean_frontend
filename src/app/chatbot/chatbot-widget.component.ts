import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ApiService } from '../core/services/api.service';

type ChatAuthor = 'bot' | 'user';

type SpeechRecognitionConstructor = new () => SpeechRecognition;

interface SpeechRecognitionWindow extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface ChatMessage {
  id: number;
  author: ChatAuthor;
  text: string;
  meta?: string;
}

@Component({
  selector: 'app-chatbot-widget',
  standalone: false,
  templateUrl: './chatbot-widget.component.html',
  styleUrl: './chatbot-widget.component.scss',
})
export class ChatbotWidgetComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chatBody') private chatBody?: ElementRef<HTMLDivElement>;

  isOpen = false;
  isMuted = false;
  isListening = false;
  isLoading = false;
  isSpeechRecognitionSupported = false;
  question = '';
  voiceError = '';
  voiceStatus = '';
  readonly suggestions = ['Shirt steam ironing price', 'Pant wash & iron price', 'Silk saree dry clean?', 'Pickup available?'];
  messages: ChatMessage[] = [
    {
      id: 1,
      author: 'bot',
      text: 'Vanakkam! Gopi Laundry AI here. Steam iron, dry cleaning, pickup details kekkalam.',
    },
  ];

  private nextMessageId = 2;
  private recognition?: SpeechRecognition;
  private finalTranscript = '';
  private shouldSendVoiceResult = false;
  private voiceSendTimer?: ReturnType<typeof setTimeout>;
  private readonly voiceSendDelayMs = 7_000;
  private readonly handleVoicesChanged = () => this.selectPreferredVoice();

  constructor(
    private readonly api: ApiService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.setupSpeechRecognition();
    this.prepareSpeechVoice();
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.stopListening(false);
    this.cancelPendingVoiceSend();
    this.cancelSpeech();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.removeEventListener('voiceschanged', this.handleVoicesChanged);
    }
  }

  toggleOpen(): void {
    this.isOpen = !this.isOpen;
    this.scrollToBottom();
  }

  close(): void {
    this.stopListening(false);
    this.cancelPendingVoiceSend();
    this.isOpen = false;
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted;

    if (this.isMuted) {
      this.cancelSpeech();
    }
  }

  clearChat(): void {
    this.cancelPendingVoiceSend();
    this.messages = [
      {
        id: this.nextMessageId++,
        author: 'bot',
        text: 'Chat cleared. New question sollunga, naan help panren.',
      },
    ];
    this.scrollToBottom();
  }

  sendMessage(value = this.question): void {
    const cleanQuestion = value.trim();

    if (!cleanQuestion || this.isLoading) {
      return;
    }

    this.cancelPendingVoiceSend();
    this.stopListening(false);
    this.voiceError = '';
    this.voiceStatus = '';
    this.question = '';
    this.addMessage('user', cleanQuestion);
    this.isLoading = true;
    this.renderChatChanges();

    this.api.askChat(cleanQuestion).subscribe({
      next: (response) => {
        this.isLoading = false;
        const meta = response.source === 'uploaded-pdf' ? 'From uploaded pricing PDF' : undefined;
        this.addMessage('bot', response.answer, meta);
        this.speakAfterRender(response.speechText || response.answer);
      },
      error: () => {
        this.isLoading = false;
        const fallback = 'Sorry, answer currently varala. Shop admin contact pannunga. Please try again later.';
        this.voiceError = 'AI response failed. Please try again.';
        this.addMessage('bot', fallback);
        this.speakAfterRender(fallback);
      },
    });
  }

  useSuggestion(suggestion: string): void {
    this.sendMessage(suggestion);
  }

  toggleListening(): void {
    if (this.isListening) {
      this.stopListening(true);
      return;
    }

    this.startListening();
  }

  startListening(): void {
    if (this.isLoading) {
      return;
    }

    if (!this.recognition) {
      this.setupSpeechRecognition();
    }

    if (!this.recognition) {
      this.voiceError = 'Voice input is not supported in this browser.';
      this.renderChatChanges();
      return;
    }

    this.cancelSpeech();
    this.cancelPendingVoiceSend();
    this.finalTranscript = '';
    this.shouldSendVoiceResult = true;
    this.voiceError = '';
    this.voiceStatus = 'Listening...';

    try {
      this.recognition.start();
      this.isListening = true;
      this.renderChatChanges();
    } catch {
      this.voiceError = 'Microphone could not start. Please try again.';
      this.voiceStatus = '';
      this.isListening = false;
      this.renderChatChanges();
    }
  }

  stopListening(sendResult = true): void {
    this.shouldSendVoiceResult = sendResult;

    if (!this.recognition || !this.isListening) {
      return;
    }

    try {
      this.recognition.stop();
    } catch {
      this.resetListeningState();
    }
  }

  cancelPendingVoiceSend(): void {
    if (this.voiceSendTimer) {
      clearTimeout(this.voiceSendTimer);
      this.voiceSendTimer = undefined;
    }

    if (!this.isListening && this.voiceStatus.startsWith('Voice captured.')) {
      this.voiceStatus = '';
    }
  }

  private addMessage(author: ChatAuthor, text: string, meta?: string): void {
    this.messages = [
      ...this.messages,
      {
        id: this.nextMessageId++,
        author,
        text,
        meta,
      },
    ];
    this.renderChatChanges();
  }

  private renderChatChanges(): void {
    this.cdr.detectChanges();
    this.scrollToBottom();
  }

  private speak(answer: string): void {
    if (this.isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    this.cancelSpeech();
    this.selectPreferredVoice();

    const speechText = this.toSpeechText(answer);
    const voice = this.pickVoice(window.speechSynthesis.getVoices(), speechText);
    const speechLanguage = this.detectSpeechLanguage(speechText);

    if (!voice) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.voice = voice;
    utterance.lang = voice.lang || speechLanguage;
    utterance.rate = 0.88;
    utterance.pitch = 1.08;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  }

  private speakAfterRender(answer: string): void {
    window.setTimeout(() => this.speak(answer), 0);
  }

  private prepareSpeechVoice(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    this.selectPreferredVoice();
    window.speechSynthesis.addEventListener('voiceschanged', this.handleVoicesChanged);
  }

  private selectPreferredVoice(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    this.pickVoice(window.speechSynthesis.getVoices());
  }

  private pickVoice(voices: SpeechSynthesisVoice[], answer = ''): SpeechSynthesisVoice | undefined {
    const preferredLanguage = this.detectSpeechLanguage(answer);
    const allowedVoices = voices.filter((voice) => this.isTamilOrEnglishVoice(voice));

    return allowedVoices
      .map((voice) => ({
        voice,
        score: this.voiceScore(voice, preferredLanguage),
      }))
      .sort((a, b) => b.score - a.score)[0]?.voice;
  }

  private voiceScore(voice: SpeechSynthesisVoice, preferredLanguage: 'ta-IN' | 'en-IN'): number {
    const name = voice.name.toLowerCase();
    const lang = voice.lang.toLowerCase();
    let score = 0;

    if (preferredLanguage === 'ta-IN') {
      if (lang === 'ta-in') score += 140;
      if (lang.startsWith('ta')) score += 110;
      if (name.includes('tamil')) score += 45;
      if (lang === 'en-in') score += 55;
      if (lang.startsWith('en')) score += 35;
    } else {
      if (lang === 'en-in') score += 120;
      if (lang.startsWith('en')) score += 90;
      if (lang === 'ta-in') score += 40;
      if (lang.startsWith('ta')) score += 25;
    }

    if (name.includes('india') || name.includes('indian')) score += 20;
    if (name.includes('google')) score += 15;
    if (name.includes('microsoft')) score += 12;
    if (name.includes('female') || name.includes('heera') || name.includes('kalpana')) score += 10;
    if (voice.localService) score += 3;

    return score;
  }

  private isTamilOrEnglishVoice(voice: SpeechSynthesisVoice): boolean {
    const lang = voice.lang.toLowerCase();
    const name = voice.name.toLowerCase();

    return lang.startsWith('ta') || lang.startsWith('en') || name.includes('tamil') || name.includes('english');
  }

  private detectSpeechLanguage(text: string): 'ta-IN' | 'en-IN' {
    return /[\u0B80-\u0BFF]/.test(text) ? 'ta-IN' : 'en-IN';
  }

  private toSpeechText(answer: string): string {
    return answer
      .replace(/₹\s*(\d+)/g, '$1 rupees')
      .replace(/\n+/g, '. ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private cancelSpeech(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  private setupSpeechRecognition(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const speechWindow = window as SpeechRecognitionWindow;
    const SpeechRecognitionApi = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    this.isSpeechRecognitionSupported = Boolean(SpeechRecognitionApi);

    if (!SpeechRecognitionApi || this.recognition) {
      return;
    }

    const recognition = new SpeechRecognitionApi();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => this.handleSpeechResult(event);
    recognition.onerror = (event) => this.handleSpeechError(event);
    recognition.onend = () => this.handleSpeechEnd();
    this.recognition = recognition;
    this.cdr.detectChanges();
  }

  private handleSpeechResult(event: SpeechRecognitionEvent): void {
    let interimTranscript = '';

    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const result = event.results[index];
      const transcript = result[0]?.transcript.trim() || '';

      if (!transcript) {
        continue;
      }

      if (result.isFinal) {
        this.finalTranscript = `${this.finalTranscript} ${transcript}`.trim();
      } else {
        interimTranscript = `${interimTranscript} ${transcript}`.trim();
      }
    }

    this.question = this.finalTranscript || interimTranscript;
    this.voiceStatus = this.finalTranscript ? 'Voice captured' : 'Listening...';
    this.renderChatChanges();
  }

  private handleSpeechError(event: SpeechRecognitionErrorEvent): void {
    const messages: Record<string, string> = {
      'not-allowed': 'Microphone permission was blocked.',
      'no-speech': 'No speech detected. Please try again.',
      'audio-capture': 'No microphone was found.',
      network: 'Speech recognition network error.',
    };

    this.voiceError = messages[event.error] || event.message || 'Voice recognition failed.';
    this.shouldSendVoiceResult = false;
    this.resetListeningState();
    this.renderChatChanges();
  }

  private handleSpeechEnd(): void {
    const transcript = (this.finalTranscript || this.question).trim();
    const shouldSend = this.shouldSendVoiceResult && transcript && !this.isLoading;

    this.resetListeningState();

    if (shouldSend) {
      this.scheduleVoiceSend(transcript);
      return;
    }

    this.renderChatChanges();
  }

  private scheduleVoiceSend(transcript: string): void {
    this.cancelPendingVoiceSend();
    this.question = transcript;
    this.voiceStatus = 'Voice captured. Sending in 5 seconds...';
    this.renderChatChanges();

    this.voiceSendTimer = setTimeout(() => {
      this.voiceSendTimer = undefined;
      this.sendMessage(transcript);
    }, this.voiceSendDelayMs);
  }

  private resetListeningState(): void {
    this.isListening = false;
    this.voiceStatus = '';
    this.shouldSendVoiceResult = false;
  }

  private scrollToBottom(): void {
    requestAnimationFrame(() => {
      const body = this.chatBody?.nativeElement;
      if (body) {
        body.scrollTop = body.scrollHeight;
      }
    });
  }
}


