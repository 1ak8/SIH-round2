import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  ShieldCheck,
  RefreshCw,
  BookOpen,
  MessageSquare,
  ChevronDown,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { aiAPI } from '../../services/api';

export const AICopilotModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: `Namaste! I am **AICTE Pravah Sahayak** (एआईसीटीई प्रवाह सहायक), your official AI Statutory Copilot grounded strictly in the **AICTE Approval Process Handbook (APH 2024-27)**.\n\nAsk me anything regarding:\n* 🏛️ **Land & Contiguity Norms** (Urban vs Rural)\n* 🔥 **Fire NOC & Structural Stability** validity\n* 👨‍🏫 **1:20 Cadre Ratio & Ghost Faculty** mandates\n* 📍 **EVC 200m Geofencing & Inspection** rules\n\nHow can I assist your institution or scrutiny desk today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [engineMode, setEngineMode] = useState('APH Regulatory Engine');
  const chatBottomRef = useRef(null);

  const quickPrompts = [
    '🏛️ Land area norms for Urban vs Rural?',
    '👨‍🏫 Faculty Cadre ratio (1:20) & Ghost rules?',
    '🔥 Fire NOC validity & 60-day renewal window?',
    '📍 EVC physical inspection & 200m geofence?',
  ];

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (queryToSend) => {
    const text = (queryToSend || inputQuery).trim();
    if (!text || loading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await aiAPI.ask(text, historyPayload);
      if (res.data?.success) {
        if (res.data.mode === 'LIVE_GEMINI') {
          setEngineMode('Google Gemini 1.5-Flash');
        } else {
          setEngineMode('APH 2024-27 Regulatory Engine');
        }

        const botMsg = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          text: res.data.answer,
          note: res.data.note,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (err) {
      const errorMsg = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: `⚠️ **System Notice:** Could not reach the compliance reasoning server. Please verify your internet or try asking again.\n\n*Error details:* ${err.message || 'Network Timeout'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        text: 'Chat history reset. How may I assist your statutory AICTE compliance check today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Circular Chatbot Launcher */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 z-40 flex items-center justify-center w-16 h-16 rounded-full bg-slate-900 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-slate-700/80 group"
          title="Open AICTE Pravah Sahayak"
          aria-label="Open AICTE Pravah Sahayak"
        >
          {/* Pulsing ring indicator */}
          <span className="absolute -inset-1 rounded-full bg-blue-500/30 group-hover:bg-blue-500/50 blur-sm -z-10 transition duration-300 animate-pulse" />
          
          <div className="relative flex items-center justify-center">
            {/* Round Modern Chat Icon with Bot Spark */}
            <div className="relative">
              <MessageSquare className="w-7 h-7 text-white transition-transform group-hover:scale-110" />
              <Sparkles className="w-4 h-4 text-cyan-400 absolute -top-2 -right-2 animate-bounce" />
            </div>

            {/* Active Online Status Badge */}
            <span className="absolute -bottom-1.5 -right-1.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900" />
            </span>
          </div>

          {/* Hover Tooltip Pill */}
          <span className="absolute right-20 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-700">
            AI Pravah Sahayak • APH Copilot
          </span>
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-5 right-3 sm:right-6 z-50 w-[94vw] sm:w-[460px] h-[85vh] max-h-[640px] bg-white rounded-2xl border border-slate-200/90 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Top Hairline Accent */}
          <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600" />

          {/* Header */}
          <div className="bg-[#0f172a] text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-sm shrink-0">
                <Sparkles className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black tracking-tight truncate font-display">
                    AICTE Pravah Sahayak
                  </h3>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Live
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 truncate font-mono">
                  {engineMode}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleClearChat}
                title="Reset conversation"
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Assistant"
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages View */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/60 text-xs">
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white text-[11px] font-bold ${
                      isUser
                        ? 'bg-[#ea580c] shadow-xs'
                        : 'bg-[#0c2340] border border-orange-500/30'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5 text-orange-400" />}
                  </div>

                  <div
                    className={`max-w-[82%] rounded-2xl p-3 sm:p-3.5 leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-[#0c2340] text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans">
                      {m.text}
                    </div>

                    {m.note && (
                      <p className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400 italic font-mono leading-tight">
                        💡 {m.note}
                      </p>
                    )}

                    <span
                      className={`block text-[9px] font-mono mt-1.5 ${
                        isUser ? 'text-slate-400 text-right' : 'text-slate-400'
                      }`}
                    >
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs py-2 pl-2">
                <RefreshCw className="w-4 h-4 animate-spin text-orange-500" />
                <span className="font-medium animate-pulse">
                  Pravah Sahayak is analyzing Approval Process Handbook...
                </span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-800 border border-slate-200 hover:border-orange-200 transition shrink-0 whitespace-nowrap"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="Ask APH norms (e.g. land size, cadre ratio, fire NOC)..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
            />

            <button
              onClick={() => handleSend()}
              disabled={!inputQuery.trim() || loading}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition shrink-0"
              title="Send Prompt"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Footer Label */}
          <div className="bg-slate-50 px-3 py-1.5 text-center border-t border-slate-100 text-[10px] text-slate-400 font-medium">
            Grounded strictly on <span className="font-semibold text-slate-600">AICTE APH 2024-27</span>. Supports English & हिन्दी.
          </div>
        </div>
      )}
    </>
  );
};

export default AICopilotModal;
