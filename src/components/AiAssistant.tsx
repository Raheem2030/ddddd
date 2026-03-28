import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export function AiAssistant({ subjectName }: { subjectName: string }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: `مرحباً! أنا مساعدك الذكي لمادة ${subjectName}. كيف يمكنني مساعدتك اليوم؟` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: [
          { role: 'user', parts: [{ text: `أنا طالب صيدلة أدرس مادة ${subjectName}. ${userMessage}` }] }
        ],
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
          systemInstruction: 'أنت مساعد ذكي متخصص في الصيدلة. أجب على أسئلة الطالب بدقة واختصار، واستخدم اللغة العربية.'
        }
      });

      if (response.text) {
        setMessages(prev => [...prev, { role: 'model', content: response.text || '' }]);
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setMessages(prev => [...prev, { role: 'model', content: 'عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full glass-panel rounded-3xl border border-white/10 overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
        <div className="w-10 h-10 rounded-full bg-[var(--color-pharma-primary)]/20 flex items-center justify-center">
          <Bot className="w-6 h-6 text-[var(--color-pharma-primary)]" />
        </div>
        <div>
          <h3 className="font-bold text-white">المساعد الذكي</h3>
          <p className="text-xs text-[var(--color-pharma-primary)]">مدعوم بـ Gemini 3.1 Pro</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={cn(
              "flex gap-3 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
              msg.role === 'user' ? "bg-white/10" : "bg-[var(--color-pharma-primary)]/20"
            )}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-[var(--color-pharma-primary)]" />}
            </div>
            <div className={cn(
              "p-3 rounded-2xl text-sm leading-relaxed",
              msg.role === 'user' 
                ? "bg-white/10 text-white rounded-tr-sm" 
                : "bg-[var(--color-pharma-primary)]/10 border border-[var(--color-pharma-primary)]/20 text-gray-200 rounded-tl-sm"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 max-w-[85%] mr-auto">
            <div className="w-8 h-8 rounded-full bg-[var(--color-pharma-primary)]/20 flex items-center justify-center shrink-0 mt-1">
              <Bot className="w-4 h-4 text-[var(--color-pharma-primary)]" />
            </div>
            <div className="p-4 rounded-2xl bg-[var(--color-pharma-primary)]/10 border border-[var(--color-pharma-primary)]/20 rounded-tl-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-[var(--color-pharma-primary)] animate-spin" />
              <span className="text-xs text-[var(--color-pharma-primary)]">يفكر بعمق...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اسأل عن أي مفهوم..."
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--color-pharma-primary)]/50 transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 rounded-full bg-[var(--color-pharma-primary)] flex items-center justify-center text-black disabled:opacity-50 disabled:bg-white/20 disabled:text-white transition-colors shrink-0"
          >
            <Send className="w-5 h-5 -ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
