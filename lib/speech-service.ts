// Free Speech Service for AI Interview Experience
// Uses browser APIs - no external services needed!

export class SpeechService {
  private speechSynthesis: SpeechSynthesis;
  private speechRecognition: any;
  private isListening: boolean = false;
  private onSpeechResult?: (text: string) => void;

  constructor() {
    this.speechSynthesis = window.speechSynthesis;
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition() {
    // Use Web Speech API (free, built into browsers)
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.speechRecognition = new SpeechRecognition();
      
      this.speechRecognition.continuous = false;
      this.speechRecognition.interimResults = false;
      this.speechRecognition.lang = 'en-US';

      this.speechRecognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (this.onSpeechResult) {
          this.onSpeechResult(transcript);
        }
      };

      this.speechRecognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        this.isListening = false;
      };

      this.speechRecognition.onend = () => {
        this.isListening = false;
      };
    }
  }

  // Make the AI speak the question
  speakQuestion(question: string, onComplete?: () => void) {
    if (this.speechSynthesis) {
      // Stop any current speech
      this.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(question);
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Use a more natural voice if available
      const voices = this.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Natural') || 
        voice.name.includes('Premium')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        if (onComplete) onComplete();
      };

      this.speechSynthesis.speak(utterance);
    }
  }

  // Start listening for user's answer
  startListening(onResult: (text: string) => void) {
    if (this.speechRecognition && !this.isListening) {
      this.onSpeechResult = onResult;
      this.isListening = true;
      this.speechRecognition.start();
    }
  }

  // Stop listening
  stopListening() {
    if (this.speechRecognition && this.isListening) {
      this.speechRecognition.stop();
      this.isListening = false;
    }
  }

  // Stop speaking
  stopSpeaking() {
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
    }
  }

  // Public method to start listening
  public startListeningForUser(onResult: (text: string) => void) {
    this.startListening(onResult);
  }

  // Public method to stop listening
  public stopListeningForUser() {
    this.stopListening();
  }

  // Check if speech recognition is available
  isSpeechRecognitionAvailable(): boolean {
    return !!(this.speechRecognition);
  }

  // Check if speech synthesis is available
  isSpeechSynthesisAvailable(): boolean {
    return !!(this.speechSynthesis);
  }

  // Get available voices
  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.speechSynthesis.getVoices();
  }
}

// Interview Avatar Component Helper
export class InterviewAvatar {
  private speechService: SpeechService;
  private currentQuestionIndex: number = 0;
  private questions: string[] = [];
  private onAnswerReceived?: (answer: string) => void;

  // Public methods for speech control
  public startListening(onResult: (text: string) => void) {
    this.speechService.startListeningForUser(onResult);
  }

  public stopListening() {
    this.speechService.stopListeningForUser();
  }

  constructor() {
    this.speechService = new SpeechService();
  }

  // Start the interview with questions
  startInterview(questions: string[], onAnswer: (answer: string) => void) {
    this.questions = questions;
    this.currentQuestionIndex = 0;
    this.onAnswerReceived = onAnswer;
    
    if (this.questions.length > 0) {
      this.askNextQuestion();
    }
  }

  // Ask the current question
  private askNextQuestion() {
    if (this.currentQuestionIndex < this.questions.length) {
      const question = this.questions[this.currentQuestionIndex];
      
      // Speak the question
      this.speechService.speakQuestion(question, () => {
        // Start listening for answer after question is spoken
        setTimeout(() => {
          this.startListeningForAnswer();
        }, 500);
      });
    }
  }

  // Listen for user's answer
  private startListeningForAnswer() {
    this.speechService.startListening((answer) => {
      if (this.onAnswerReceived) {
        this.onAnswerReceived(answer);
      }
      
      // Move to next question
      this.currentQuestionIndex++;
      if (this.currentQuestionIndex < this.questions.length) {
        // Wait a bit before asking next question
        setTimeout(() => {
          this.askNextQuestion();
        }, 1000);
      }
    });
  }

  // Stop the interview
  stopInterview() {
    this.speechService.stopListening();
    this.speechService.stopSpeaking();
  }

  // Get current question index
  getCurrentQuestionIndex(): number {
    return this.currentQuestionIndex;
  }

  // Get total questions
  getTotalQuestions(): number {
    return this.questions.length;
  }
}
