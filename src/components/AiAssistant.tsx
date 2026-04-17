import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export function AiAssistant({ subjectName, subjectContext = '' }: { subjectName: string, subjectContext?: string }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: `مرحباً! أنا مساعدك الذكي لمادة ${subjectName}. كيف يمكنني مساعدتك اليوم؟ يمكنك سؤالي عن أي مفهوم في المحاضرة.` }
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
      // Use the provided API Key as fallback if environment is missing
      const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || '';
      
      if (!apiKey) {
        throw new Error('لم يتم العثور على مفتاح API. أضفه في إعدادات التطبيق أو ملف .env باسم VITE_GEMINI_API_KEY');
      }

      const ai = new GoogleGenAI({ apiKey });
      
      // Formatting context for the prompt
      const contextPrompt = subjectContext ? `\n\n### المحتوى الأكاديمي المتاح للمقرر (يجب أن تبني إجاباتك بناءً عليه حصراً):\n${subjectContext}` : '';

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...messages.slice(1).map(m => ({ role: m.role, parts: [{ text: m.content }] })),
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
          systemInstruction: `أنت مساعد ذكي متخصص وأكاديمي لمادة ${subjectName}.
التعليمات الصارمة:
1- الإجابات يجب أن تكون منسقة بشكل أكاديمي واضح ومنظم (استخدم العناوين والنقاط).
2- لا تخرج أبداً عن السياق والمعلومات الموجودة في ملفات المحاضرة المرفقة. إذا سأل الطالب عن شيء خارج المحاضرة الخاصة به فاعتذر واطلب منه الالتزام بالمقرر.
3- اشرح المفاهيم المعقدة بأسلوب بسيط جداً واستخدم "التشبيهات" (Analogies) من الحياة اليومية لتبسيط الفهم قدر الإمكان.
4- الإجابات يجب أن تكون نصوصاً فقط، لا تقم بطباعة أي أكواد برمجية ولا تستخدم الصور.${contextPrompt}`
        }
      });

      if (response.text) {
        setMessages(prev => [...prev, { role: 'model', content: response.text || '' }]);
      }
    } catch (error: any) {
      console.error('Error generating content:', error);
      setMessages(prev => [...prev, { role: 'model', content: `حدث خطأ: ${error?.message || JSON.stringify(error)}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full glass-panel rounded-[2rem] border border-[var(--color-pharma-primary)]/20 overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.1)]">
      <div className="p-5 border-b border-[var(--color-pharma-primary)]/10 flex items-center gap-4 bg-[var(--color-pharma-primary)]/5">
        <div className="w-12 h-12 rounded-2xl bg-[var(--color-pharma-primary)]/20 flex items-center justify-center border border-[var(--color-pharma-primary)]/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          <Bot className="w-7 h-7 text-[var(--color-pharma-primary)]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-wide">المساعد الذكي (Gemini)</h3>
          <p className="text-xs text-[var(--color-pharma-primary)] font-medium">مخصص لـ {subjectName}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 hide-scrollbar flex flex-col">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={cn(
              "flex gap-3 max-w-[90%]",
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
              "p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap flex flex-col gap-2",
              msg.role === 'user' 
                ? "bg-white/10 text-white rounded-tr-sm border border-white/5" 
                : "bg-[var(--color-pharma-primary)]/10 border border-[var(--color-pharma-primary)]/20 text-gray-200 rounded-tl-sm shadow-[0_5px_15px_rgba(0,0,0,0.2)]"
            )}>
              {msg.role === 'model' ? (
                <div className="markdown-body text-sm">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 max-w-[85%] mr-auto">
            <div className="w-8 h-8 rounded-full bg-[var(--color-pharma-primary)]/20 flex items-center justify-center shrink-0 mt-1">
              <Bot className="w-4 h-4 text-[var(--color-pharma-primary)]" />
            </div>
            <div className="p-4 rounded-2xl bg-[var(--color-pharma-primary)]/10 border border-[var(--color-pharma-primary)]/20 rounded-tl-sm flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-[var(--color-pharma-primary)] animate-spin" />
              <span className="text-sm font-medium text-[var(--color-pharma-primary)]">يحلل المحاضرات ويفكر بعمق...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-[var(--color-pharma-primary)]/10 bg-[#0a0f1a]">
        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-full border border-white/10 focus-within:border-[var(--color-pharma-primary)]/50 focus-within:bg-white/10 transition-all">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اسأل مبنياً على المحتوى الأكاديمي..."
            className="flex-1 bg-transparent px-4 py-2 text-sm text-white focus:outline-none placeholder-gray-500"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-full bg-[var(--color-pharma-primary)] flex items-center justify-center text-black disabled:opacity-50 disabled:bg-white/10 disabled:text-white transition-all shrink-0 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(0,240,255,0.3)] disabled:shadow-none pr-1"
          >
            <Send className="w-5 h-5 -ml-1 rtl:ml-0 rtl:mr-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
