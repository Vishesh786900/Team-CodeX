import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Image as ImageIcon,
  Plus,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Bot,
  User as UserIcon,
  Copy,
  Check,
  AlertCircle,
  CornerDownRight,
  ShieldCheck,
  MessageSquare,
  ChevronDown,
} from 'lucide-react';
import { Language, ChatMessage, Conversation, UserProfile, WeatherData } from '../types';
import { translations } from '../i18n/translations';
import { SpeechAssistant } from '../utils/speech';

interface AiChatViewProps {
  language: Language;
  user: UserProfile;
  weather: WeatherData | null;
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onSendMessage: (text: string, image?: string) => Promise<void>;
  isLoading: boolean;
  autoVoice: boolean;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const AiChatView: React.FC<AiChatViewProps> = ({
  language,
  user,
  weather,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onSendMessage,
  isLoading,
  autoVoice,
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const t = translations[language];
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<Record<string, 'up' | 'down'>>({});
  const [historyDropdownOpen, setHistoryDropdownOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const currentConversation =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages, isLoading]);

  useEffect(() => {
    if (initialPrompt) {
      setInputText(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  // Handle auto voice for new assistant messages
  const lastMessageCountRef = useRef(currentConversation?.messages.length || 0);
  useEffect(() => {
    const msgs = currentConversation?.messages || [];
    if (autoVoice && msgs.length > lastMessageCountRef.current) {
      const lastMsg = msgs[msgs.length - 1];
      if (lastMsg && lastMsg.role === 'assistant') {
        handleSpeakMessage(lastMsg.id, lastMsg.content);
      }
    }
    lastMessageCountRef.current = msgs.length;
  }, [currentConversation?.messages, autoVoice]);

  // Handle Voice Input with Speech Recognition
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    if (!SpeechAssistant.isSpeechRecognitionSupported()) {
      alert(
        language === 'mr'
          ? 'तुमच्या ब्राऊझरमध्ये व्हॉइस इनपुट समर्थित नाही.'
          : language === 'hi'
          ? 'आपके ब्राउज़र में वॉइस इनपुट समर्थित नहीं है।'
          : 'Speech recognition is not supported in this browser.'
      );
      return;
    }

    try {
      setIsListening(true);
      setSpeechTranscript('');

      const recognition = SpeechAssistant.createRecognition(
        language,
        (transcript: string) => {
          setSpeechTranscript(transcript);
          setInputText(transcript);
        },
        (error: any) => {
          console.warn('Speech error:', error);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputText.trim() && !selectedImage) || isLoading) return;

    const messageToSend = inputText;
    const imageToSend = selectedImage || undefined;

    setInputText('');
    setSelectedImage(null);
    setSpeechTranscript('');

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    await onSendMessage(messageToSend, imageToSend);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSpeakMessage = (msgId: string, text: string) => {
    if (speakingMessageId === msgId) {
      SpeechAssistant.stop();
      setSpeakingMessageId(null);
    } else {
      setSpeakingMessageId(msgId);
      SpeechAssistant.speak(
        text,
        language,
        () => setSpeakingMessageId(null),
        () => setSpeakingMessageId(null)
      );
    }
  };

  const handleCopyText = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = (msgId: string, type: 'up' | 'down') => {
    setFeedbackState((prev) => ({ ...prev, [msgId]: type }));
  };

  const quickPromptsList = [
    t.aiChat.quickPrompts.yellowLeaves,
    t.aiChat.quickPrompts.rainAdvice,
    t.aiChat.quickPrompts.onionPest,
    t.aiChat.quickPrompts.fertilizerTiming,
    t.aiChat.quickPrompts.dripIrrigation,
    t.aiChat.quickPrompts.governmentScheme,
  ];

  const currentMessages = currentConversation?.messages || [];

  return (
    <div id="ai-chat-container" className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white rounded-[32px] border border-[#E4E4E7] shadow-sm overflow-hidden font-sans">
      
      {/* 1. Header with Persona & Conversation Switcher - Bento Header */}
      <div className="bg-white text-[#18181B] px-6 py-4 flex items-center justify-between border-b border-[#E4E4E7] shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#F4F4F7] border border-[#E4E4E7] flex items-center justify-center text-[#18181B] shadow-xs">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base sm:text-lg text-[#18181B]">{t.assistantName}</h2>
              <span className="text-[10px] font-bold bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {language === 'mr' ? 'मराठी सहाय्यक' : language === 'hi' ? 'हिंदी सहायक' : 'Active AI'}
              </span>
            </div>
            <p className="text-xs text-[#71717A] font-medium mt-0.5">
              {language === 'mr' ? 'पिके, खते, रोग, कीड व योजना सल्लागार' : language === 'hi' ? 'फसल, खाद, रोग व योजना सलाहकार' : 'Crop, Pest, Disease & Scheme Advisor'}
            </p>
          </div>
        </div>

        {/* History / New Conversation Buttons */}
        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => setHistoryDropdownOpen(!historyDropdownOpen)}
            className="px-3.5 py-2 rounded-full bg-[#F4F4F7] hover:bg-white text-[#18181B] text-xs font-bold flex items-center gap-1.5 border border-[#E4E4E7] transition-colors shadow-2xs"
            title="Switch Conversation"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#71717A]" />
            <span className="hidden sm:inline truncate max-w-[110px]">
              {currentConversation?.title || t.aiChat.chatHistory}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#71717A]" />
          </button>

          <button
            onClick={onNewConversation}
            className="p-2 sm:px-4 sm:py-2 rounded-full bg-[#18181B] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            title="Start New Chat"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t.aiChat.newChat}</span>
          </button>

          {/* History Dropdown Menu */}
          {historyDropdownOpen && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-[24px] shadow-xl border border-[#E4E4E7] py-2.5 z-50 text-[#18181B] divide-y divide-[#E4E4E7]">
              <div className="px-4 py-1.5 text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider">
                {t.aiChat.chatHistory}
              </div>
              <div className="max-h-60 overflow-y-auto">
                {(conversations || []).filter(Boolean).map((c) => (
                  <div
                    key={c.id}
                    className={`px-4 py-2.5 text-xs flex items-center justify-between hover:bg-[#F4F4F7] cursor-pointer transition-colors ${
                      c.id === activeConversationId ? 'bg-[#F4F4F7] font-bold text-[#18181B]' : 'text-[#71717A]'
                    }`}
                  >
                    <span
                      onClick={() => {
                        onSelectConversation(c.id);
                        setHistoryDropdownOpen(false);
                      }}
                      className="truncate flex-1 pr-2"
                    >
                      {c?.title || 'Conversation'}
                    </span>
                    {(conversations || []).length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConversation(c.id);
                        }}
                        className="text-[#A1A1AA] hover:text-rose-600 p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#F4F4F7]/40">
        
        {/* Welcome message if empty */}
        {(!currentConversation || currentMessages.length === 0) && (
          <div className="text-center py-6 sm:py-10 max-w-lg mx-auto space-y-5">
            <div className="w-16 h-16 rounded-[24px] bg-white border border-[#E4E4E7] mx-auto flex items-center justify-center text-[#18181B] shadow-xs">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-[#18181B] text-lg sm:text-xl tracking-tight">
                {language === 'mr' ? 'रामराम! मी तुमचा कृषी मित्र' : language === 'hi' ? 'नमस्ते! मैं आपका कृषि मित्र हूँ' : 'Namaskar! I am Krishi Mitra'}
              </h3>
              <p className="text-xs sm:text-sm text-[#71717A] mt-1.5 leading-relaxed font-medium">
                {t.aiChat.welcomeMsg}
              </p>
            </div>

            {/* Quick Prompt Suggestions Bento Chips */}
            <div className="pt-3">
              <div className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider mb-3">
                {t.aiChat.quickPromptsTitle}
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {(quickPromptsList || []).map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputText(prompt);
                      onSendMessage(prompt);
                    }}
                    className="text-left text-xs font-medium bg-white hover:bg-[#18181B] hover:text-white border border-[#E4E4E7] text-[#71717A] px-3.5 py-2 rounded-full transition-all shadow-xs leading-snug"
                  >
                    🌱 {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Render chat history */}
        {currentMessages.map((msg) => {
          const isAssistant = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 items-start ${isAssistant ? 'justify-start' : 'justify-end'}`}
            >
              {isAssistant && (
                <div className="w-9 h-9 rounded-2xl bg-white border border-[#E4E4E7] text-[#18181B] flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-[24px] p-5 shadow-xs leading-relaxed text-xs sm:text-sm ${
                  isAssistant
                    ? 'bg-white border border-[#E4E4E7] text-[#18181B]'
                    : 'bg-[#18181B] text-white'
                }`}
              >
                {/* Attached user image preview */}
                {msg.imageUrl && (
                  <div className="mb-3 rounded-2xl overflow-hidden border border-white/20 max-w-xs">
                    <img src={msg.imageUrl} alt="Uploaded crop" className="w-full h-auto object-cover" />
                  </div>
                )}

                {/* Formatted Content */}
                <div className="whitespace-pre-line break-words font-medium">{msg.content}</div>

                {/* Assistant Tools: Voice Playback, Copy, Feedback */}
                {isAssistant && (
                  <div className="mt-4 pt-3 border-t border-[#E4E4E7] flex items-center justify-between text-[#71717A] text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSpeakMessage(msg.id, msg.content)}
                        className={`px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 text-[11px] font-bold cursor-pointer ${
                          speakingMessageId === msg.id
                            ? 'bg-[#EEF2FF] border-[#C7D2FE] text-[#4338CA] animate-pulse shadow-xs'
                            : 'bg-[#F4F4F7] hover:bg-white border-[#E4E4E7] text-[#18181B]'
                        }`}
                        title="Listen to Voice Readout"
                      >
                        {speakingMessageId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-[#4338CA]" />
                            <span>{language === 'mr' ? 'थांबवा' : language === 'hi' ? 'रोकें' : 'Stop'}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-[#4338CA]" />
                            <span>
                              {language === 'mr'
                                ? 'मराठीत ऐका'
                                : language === 'hi'
                                ? 'हिंदी में सुनें'
                                : 'Listen'}
                            </span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleCopyText(msg.id, msg.content)}
                        className="p-1.5 rounded-full bg-[#F4F4F7] hover:bg-white border border-[#E4E4E7] text-[#71717A]"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Feedback Thumbs */}
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-[#A1A1AA] hidden sm:inline mr-1">{t.aiChat.feedbackHelpful}</span>
                      <button
                        onClick={() => handleFeedback(msg.id, 'up')}
                        className={`p-1.5 rounded-full transition-colors ${
                          feedbackState[msg.id] === 'up'
                            ? 'text-[#15803D] bg-[#F0FDF4]'
                            : 'text-[#A1A1AA] hover:text-[#18181B]'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleFeedback(msg.id, 'down')}
                        className={`p-1.5 rounded-full transition-colors ${
                          feedbackState[msg.id] === 'down'
                            ? 'text-rose-700 bg-rose-100'
                            : 'text-[#A1A1AA] hover:text-[#18181B]'
                        }`}
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {!isAssistant && (
                <div className="w-9 h-9 rounded-2xl bg-[#18181B] text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 items-center text-[#71717A] text-xs py-2">
            <div className="w-9 h-9 rounded-2xl bg-white border border-[#E4E4E7] text-[#18181B] flex items-center justify-center animate-spin shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-white border border-[#E4E4E7] rounded-full px-4 py-2.5 shadow-xs flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#18181B] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#18181B] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#18181B] animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="font-bold text-[#18181B] text-xs">{t.aiChat.aiThinking}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Voice Listening Status Banner */}
      {isListening && (
        <div className="bg-[#F0FDF4] border-t border-[#DCFCE7] px-6 py-2.5 flex items-center justify-between text-xs text-[#15803D] animate-pulse">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold">{t.aiChat.listeningAlert}</span>
            {speechTranscript && (
              <span className="italic text-[#18181B] font-medium">"{speechTranscript}"</span>
            )}
          </div>
          <button
            onClick={toggleListening}
            className="px-3 py-1 bg-[#18181B] text-white font-bold rounded-full text-[11px]"
          >
            {t.common.stop}
          </button>
        </div>
      )}

      {/* 4. Selected Image Preview Chip */}
      {selectedImage && (
        <div className="bg-[#F4F4F7] border-t border-[#E4E4E7] px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={selectedImage} alt="Preview" className="w-10 h-10 object-cover rounded-xl border border-[#E4E4E7]" />
            <span className="text-xs font-semibold text-[#18181B]">Plant image attached for AI analysis</span>
          </div>
          <button
            onClick={() => setSelectedImage(null)}
            className="text-xs font-bold text-rose-600 hover:underline"
          >
            Remove
          </button>
        </div>
      )}

      {/* 5. Bottom Input Form Bento Input Bar */}
      <form
        onSubmit={handleSend}
        className="p-4 bg-white border-t border-[#E4E4E7] flex items-center gap-2.5 shrink-0"
      >
        {/* Hidden File input for crop photo */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />

        {/* Camera / Photo Attachment Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-3 rounded-full bg-[#F4F4F7] hover:bg-white text-[#18181B] border border-[#E4E4E7] transition-colors shrink-0 shadow-xs"
          title={t.aiChat.uploadLeafPhoto}
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        {/* Microphone Voice Button */}
        <button
          type="button"
          onClick={toggleListening}
          className={`p-3 rounded-full transition-all shrink-0 border border-[#E4E4E7] ${
            isListening
              ? 'bg-rose-500 text-white shadow-md animate-pulse ring-4 ring-rose-200'
              : 'bg-[#F0FDF4] hover:bg-emerald-100 text-[#15803D] border-[#DCFCE7]'
          }`}
          title={t.aiChat.holdToSpeak}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Text Input Field */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t.aiChat.inputPlaceholder}
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-[#F4F4F7] focus:bg-white border border-[#E4E4E7] focus:border-[#18181B] rounded-full focus:outline-none text-[#18181B] placeholder:text-[#A1A1AA] transition-all"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={isLoading || (!inputText.trim() && !selectedImage)}
          className="p-3 bg-[#18181B] hover:bg-black disabled:opacity-40 text-white rounded-full font-bold transition-colors shadow-xs shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Safety & Legal Disclaimer */}
      <div className="bg-[#F4F4F7] px-4 py-2 border-t border-[#E4E4E7] text-[10px] text-[#71717A] text-center font-medium">
        {t.aiChat.disclaimer}
      </div>

    </div>
  );
};
