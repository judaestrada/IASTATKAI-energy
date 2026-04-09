import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Send, Loader2, Zap } from 'lucide-react';
import { askGemini } from '../../services/aiservice';

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
}

interface ExpertAgentProps {
  isOpen: boolean;
  onClose: () => void;
  currentContext: string;
}

export default function ExpertAgent({ isOpen, onClose, currentContext }: ExpertAgentProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'agent',
      content: 'Hello! I am your IASTATKAI Renewable Energy Expert. How can I help you with your energy solutions today?'
    }
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
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // We pass the current context (active tab) to the AI
      const responseText = await askGemini(
        { userQuery: userMessage.content }, 
        `User is currently viewing the ${currentContext} section. Act as a Renewable Energy Expert.`
      );
      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: responseText
      };
      
      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error("Agent error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: 'Sorry, I encountered an error while processing your request. Please try again later.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink-900/20 backdrop-blur-sm z-50 md:hidden"
          />
          
          {/* Slide-over panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl border-l border-slate-200 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-brand-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white shadow-sm">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-ink-900 leading-tight">IASTATKAI Expert</h3>
                  <p className="text-xs text-brand-600 font-medium flex items-center gap-1">
                    <Zap size={10} /> Renewable Energy AI
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-ink-900 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-brand-500 text-white rounded-tr-sm' 
                        : 'bg-white border border-slate-200 text-ink-900 rounded-tl-sm shadow-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-brand-500" />
                    <span className="text-xs text-slate-500 font-medium">Analyzing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about solar, tariffs, CO2..."
                  className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:hover:bg-brand-500 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="text-center mt-2">
                <span className="text-[10px] text-slate-400">Context: {currentContext}</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
