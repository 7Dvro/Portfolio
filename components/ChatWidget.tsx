
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, Paperclip, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SYSTEM_PROMPT } from '../constants';
import { ChatMessage } from '../types';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init', role: 'model', text: "Hi! I'm Mohamed's AI assistant. Ask me about his skills, or upload a Resume/Project description for me to analyze!" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<{data: string, mimeType: string, name: string} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        if(selectedFile.size > 2 * 1024 * 1024) {
            alert("File too large. Please select a file under 2MB.");
            return;
        }
        
        const reader = new FileReader();
        reader.onloadend = () => {
             // Remove data URL prefix (e.g., "data:application/pdf;base64,")
             const base64String = (reader.result as string).split(',')[1];
             setFile({
                 data: base64String,
                 mimeType: selectedFile.type,
                 name: selectedFile.name
             });
        };
        reader.readAsDataURL(selectedFile);
    }
  };

  const handleSend = async () => {
    if ((!inputValue.trim() && !file) || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: file ? `${inputValue} [Attached: ${file.name}]` : inputValue,
      hasAttachment: !!file
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    const currentFile = file; // capture current file
    setFile(null); // clear file input
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const contentsParts: any[] = [];
      
      if (currentFile) {
          contentsParts.push({
              inlineData: {
                  mimeType: currentFile.mimeType,
                  data: currentFile.data
              }
          });
          contentsParts.push({ text: inputValue || "Analyze this document." });
      } else {
          contentsParts.push({ text: inputValue });
      }

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            { role: 'user', parts: contentsParts }
        ],
        config: {
            systemInstruction: SYSTEM_PROMPT + (currentFile ? "\n\nThe user has uploaded a file (CV or Document). Analyze it carefully in context of Mohamed's portfolio." : ""),
        }
      });

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || "I processed the document but couldn't generate a text response."
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Gemini Error:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Sorry, I encountered an error connecting to the AI service. Please ensure the file type is supported (PDF, Image, Text) and try again.",
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[60] bg-cyber-600 hover:bg-cyber-500 text-white p-4 rounded-full shadow-lg shadow-cyber-900/50 transition-colors flex items-center justify-center group"
          >
            <MessageCircle className="w-6 h-6 group-hover:animate-bounce" />
            <span className="absolute right-full mr-3 bg-white text-slate-900 text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Ask AI about me
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[60] w-full max-w-sm md:w-96 bg-dark-card border border-cyber-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[600px] h-[80vh]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyber-900 to-cyber-700 p-4 flex items-center justify-between border-b border-cyber-700">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <h3 className="text-white font-semibold">AI Assistant</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-cyber-100 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-indigo-600' : 'bg-cyber-600'
                  }`}>
                    {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                  </div>
                  <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-100' 
                      : msg.isError 
                        ? 'bg-red-900/20 border border-red-500/30 text-red-200'
                        : 'bg-cyber-900/30 border border-cyber-700/30 text-slate-200'
                  }`}>
                    {msg.hasAttachment && (
                        <div className="flex items-center gap-1 mb-2 text-xs text-indigo-300 bg-indigo-900/50 p-1 rounded">
                            <Paperclip size={12} /> Attachment sent
                        </div>
                    )}
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                   <div className="w-8 h-8 rounded-full bg-cyber-600 flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                   </div>
                   <div className="bg-cyber-900/30 border border-cyber-700/30 p-3 rounded-lg flex items-center">
                     <Loader2 className="w-4 h-4 animate-spin text-cyber-400" />
                   </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-dark-card border-t border-cyber-800">
               {file && (
                   <div className="flex items-center justify-between bg-slate-800 p-2 rounded mb-2 text-xs text-slate-300">
                       <span className="flex items-center gap-1 truncate max-w-[200px]"><FileText size={14}/> {file.name}</span>
                       <button onClick={() => setFile(null)} className="text-red-400 hover:text-red-300"><X size={14}/></button>
                   </div>
               )}
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <div className="relative flex-1">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={file ? "Ask about the file..." : "Ask me anything..."}
                      className="w-full bg-slate-950 border border-cyber-900 rounded-lg pl-4 pr-10 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyber-500 focus:ring-1 focus:ring-cyber-500 placeholder-slate-500"
                    />
                    <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyber-400 transition-colors"
                        title="Upload PDF/Image"
                    >
                        <Paperclip size={18} />
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={handleFileSelect}
                        accept="application/pdf,image/*,text/plain,.docx"
                    />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || (!inputValue.trim() && !file)}
                  className="bg-cyber-600 hover:bg-cyber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
