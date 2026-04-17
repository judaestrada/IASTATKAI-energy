import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Loader2, X } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';

// Ensure you have process.env.GEMINI_API_KEY injected by vite.config.ts
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// Create a singleton chat session so it persists across renders
let chatSession: any = null;

export default function ExpertWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', content: string}[]>([
    { role: 'model', content: "Hello! I am the IASTATKAI Energy Expert Agent. How can I help you today with sustainable energy practices?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize the chat session
  useEffect(() => {
    if (!chatSession && process.env.GEMINI_API_KEY) {
      chatSession = ai.chats.create({
        model: 'gemini-3.1-pro-preview', // Or gemini-1.5-flash
        config: {
          systemInstruction: "You are the AI assistant for IASTATKAI energy, a company of renewable energy experts. Provide accurate, professional, and insightful information strictly related to solar, wind, hydro, grid management, and sustainable energy practices. IMPORTANT: Always keep your responses very short, concise, and straight to the point. When providing recommendations, solutions, or options, always limit your response to exactly the best 2 answers.",
        }
      });
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;

    if (!chatSession) {
      setMessages(prev => [...prev, { role: 'model', content: "Error: Could not initialize AI (Missing API Key)." }]);
      return;
    }

    const currentMsg = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: currentMsg }]);
    setIsLoading(true);

    try {
      const response = await chatSession.sendMessage({ message: currentMsg });
      setMessages(prev => [...prev, { role: 'model', content: response.text || "No response generated." }]);
    } catch (error: any) {
      console.error("AI Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[calc(100vw-2rem)] sm:w-[380px] md:w-[450px] lg:w-[500px] h-[calc(100dvh-7rem)] sm:h-[500px] md:h-[600px] lg:h-[700px] max-h-[85dvh] sm:max-h-[80vh] md:max-h-[85vh] bg-white rounded-[20px] sm:rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden origin-bottom-right overscroll-contain"
          >
            {/* Header */}
            <header className="bg-ink-900 text-white px-4 py-3 md:py-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-500/10 flex items-center justify-center p-1 md:p-1.5 overflow-hidden border border-brand-500/20">
                  <img src="/agent-icon.png" alt="Expert AI" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h3 className="font-bold text-sm md:text-base tracking-tight">Expert AI</h3>
                  <p className="text-xs md:text-sm text-brand-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </header>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 bg-slate-50/50">
              {messages.map((msg, index) => (
                <div key={index} className={`flex gap-3 max-w-[90%] md:max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full shrink-0 flex items-center justify-center overflow-hidden border ${
                    msg.role === 'user' ? 'bg-ink-900 border-ink-900 text-white' : 'bg-brand-50/50 border-brand-500/20 p-1'
                  }`}>
                    {msg.role === 'user' ? (
                      <User className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    ) : (
                      <img src="/agent-icon.png" alt="AI" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    )}
                  </div>
                  <div className={`rounded-xl md:rounded-2xl px-3 py-2 md:px-4 md:py-3 ${
                    msg.role === 'user' 
                      ? 'bg-ink-900 text-white rounded-tr-none' 
                      : 'bg-white border border-slate-200 text-ink-900 rounded-tl-none shadow-sm'
                  }`}>
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap text-[14px] md:text-[15px] leading-relaxed">{msg.content}</p>
                    ) : (
                      <div className="prose prose-sm md:prose-base prose-slate max-w-none prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:text-slate-50">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full shrink-0 flex items-center justify-center overflow-hidden border bg-brand-50/50 border-brand-500/20 p-1">
                    <img src="/agent-icon.png" alt="AI" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <div className="rounded-2xl rounded-tl-none px-4 py-3 bg-white border border-slate-200 flex items-center gap-2 shadow-sm text-brand-600">
                    <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                    <span className="text-sm md:text-base font-medium">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-3 md:p-4 bg-white border-t border-slate-100 shrink-0">
              <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder="Ask about sustainable energy..."
                  className="w-full bg-slate-100/80 rounded-xl px-4 py-2 md:py-3 pb-2 md:pb-3 pr-[3.25rem] md:pr-14 focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[40px] md:min-h-[48px] max-h-32 md:max-h-40 resize-none text-[14px] md:text-[15px] text-ink-900 leading-relaxed"
                  rows={1}
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-brand-500 hover:bg-brand-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white p-2 md:p-2.5 rounded-lg md:rounded-xl transition-colors absolute right-1.5 md:right-2 bottom-1.5 md:bottom-2"
                >
                  <Send className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group relative w-12 h-12 md:w-16 md:h-16 rounded-full outline-none overflow-visible shadow-2xl flex items-center justify-center transform transition-transform md:hover:scale-105"
      >
        {/* Outer animated glow ring */}
        <div className={`absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 blur-sm opacity-70 group-hover:opacity-100 transition duration-500 ${!isOpen ? 'animate-pulse' : ''}`} />
        
        {/* The actual button circle */}
        <div className="relative w-full h-full rounded-full bg-[#0a0a1a] flex items-center justify-center overflow-hidden border border-white/10 z-10 transition-transform hover:scale-105 active:scale-95 duration-200">
          
          {/* particle effects / inner noise via gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.2)_0%,transparent_70%)]" />
          
          {/* Animated dashed/dotted ring inside */}
          <div className="absolute inset-1 rounded-full border border-dashed border-cyan-400/50 animate-[spin_10s_linear_infinite]" />
          
          {isOpen ? (
            <X className="w-5 h-5 md:w-7 md:h-7 text-white relative z-20" />
          ) : (
            <div className="relative z-20 w-7 h-7 md:w-10 md:h-10">
              <img src="/agent-icon.png" alt="Expert AI" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
          )}
        </div>
      </button>
    </div>
  );
}
