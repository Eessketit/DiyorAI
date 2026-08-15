import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "@/lib/i18n";
import { ChatMessage, UserPageContext } from "@/lib/aiPrompts";
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Trash2,
  Minimize2,
  Bot,
  User,
  Zap,
  MapPin,
  ChevronDown,
  Info,
} from "lucide-react";

export default function AiChatWidget() {
  const router = useRouter();
  const { language } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: language === "uz"
        ? "Assalomu alaykum! Men DiyorAI raqamli konsyerjiman. O'zbekiston bo'ylab sayohat, Afrosiyob poyezdlari, milliy taomlar yoki byudjet bo'yicha qanday yordam bera olaman?"
        : language === "en"
        ? "Hello! I am DiyorAI, your personal Uzbekistan travel concierge. How can I help you with itineraries, Afrosiyob trains, dining, or budgets today?"
        : "Ассалому алейкум! Я DiyorAI — ваш персональный цифровой консьерж по Узбекистану. Чем я могу помочь вам с маршрутом, билетами на Афросиаб, отелями или ресторанами?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const quickQuestions = [
    {
      label: language === "uz" ? "🥘 Eng yaxshi osh qayerda?" : language === "en" ? "🥘 Best Plov Spots" : "🥘 Где лучший плов?",
      query: language === "uz" ? "Toshkent va Samarqandda eng mashhur va mazali osh qayerda?" : language === "en" ? "Where can I find the best authentic plov in Tashkent and Samarkand?" : "Где поесть самый вкусный плов в Ташкенте и Самарканде?",
    },
    {
      label: language === "uz" ? "🚆 Afrosiyob poyezdlari" : language === "en" ? "🚆 Afrosiyob Express" : "🚆 Билеты на Афросиаб",
      query: language === "uz" ? "Afrosiyob poyezdiga chiptalarni qayerdan va qachon sotib olish kerak?" : language === "en" ? "How and when should I book tickets for the Afrosiyob high-speed train?" : "Как и за сколько дней покупать билеты на скоростной поезд Афросиаб?",
    },
    {
      label: language === "uz" ? "🏔️ Chorvoq va Amirsoy" : language === "en" ? "🏔️ Charvak & Amirsoy" : "🏔️ Поездка на Чарвак",
      query: language === "uz" ? "Toshkentdan Chorvoq va Amirsoyga borish uchun qanday maslahatlar berasiz?" : language === "en" ? "What are the best tips for a day trip to Charvak and Amirsoy from Tashkent?" : "Как спланировать однодневную поездку на Чарвак и Амирсой из Ташкента?",
    },
    {
      label: language === "uz" ? "💰 Kunlik byudjet" : language === "en" ? "💰 Daily Budget" : "💰 Бюджет на человека",
      query: language === "uz" ? "O'zbekistonda 1 kishi uchun kunlik optimal byudjet qancha bo'ladi?" : language === "en" ? "What is a realistic daily travel budget per person in Uzbekistan?" : "Какой оптимальный бюджет на человека в день нужен для путешествия по Узбекистану?",
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || loading) return;

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", text: messageText },
    ];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // Extract current page context
    const pageContext: UserPageContext = {
      pathname: router.pathname,
    };

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          pageContext,
          language,
        }),
      });

      if (!res.ok) {
        throw new Error("AI service temporary error");
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.reply || "Извините, ответ временно недоступен." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: language === "uz"
            ? "Xizmat bilan bog'lanishda xatolik yuz berdi. Iltimos, birozdan so'ng qayta urinib ko'ring."
            : language === "en"
            ? "Could not reach the AI assistant. Please try again in a moment."
            : "Произошла временная ошибка связи с AI-ассистентом. Пожалуйста, попробуйте еще раз.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        text: language === "uz"
          ? "Suhbat tozalandi. Qanday savolingiz bor?"
          : language === "en"
          ? "Chat cleared. What can I help you with?"
          : "Диалог очищен. Чем я могу вам помочь?",
      },
    ]);
  };

  // Render markdown bold and bullets nicely
  const formatMessageText = (text: string) => {
    return text.split("\n").map((line, lineIdx) => {
      // Process bold **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, partIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={partIdx} className="font-bold text-night">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={partIdx} className="italic text-night/90">{part.slice(1, -1)}</em>;
        }
        return part;
      });

      if (line.startsWith("• ") || line.startsWith("- ")) {
        return (
          <li key={lineIdx} className="ml-4 list-disc text-xs sm:text-sm my-0.5">
            {formattedLine}
          </li>
        );
      }

      return (
        <p key={lineIdx} className={`text-xs sm:text-sm leading-relaxed ${line === "" ? "h-2" : "my-0.5"}`}>
          {formattedLine}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Toggle Button (Bottom Right) */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 px-4 py-3.5 rounded-full bg-gradient-to-r from-[#131E3A] via-[#1E3A8A] to-[#2563EB] text-white border-2 border-white/25 shadow-2xl hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300 cursor-pointer animate-fade-in"
            title="Открыть DiyorAI Консьерж"
          >
            {/* Animated Pulse Glow */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
            </span>

            <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 group-hover:rotate-12 transition-transform shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>

            <div className="flex flex-col text-left pr-1.5">
              <span className="font-display font-bold text-xs sm:text-sm leading-tight text-white drop-shadow-xs">
                DiyorAI AI
              </span>
              <span className="text-[9px] font-mono text-amber-300 font-bold uppercase tracking-wider">
                Alice AI LLM
              </span>
            </div>
          </button>
        )}

        {/* Collapsible Chat Window */}
        {isOpen && (
          <div className="w-[calc(100vw-2.5rem)] sm:w-[410px] h-[540px] max-h-[85vh] bg-white border border-indigo-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-up z-50">
            {/* Window Header */}
            <div className="p-4 bg-gradient-to-r from-[#131E3A] to-[#1E3A8A] text-white border-b border-indigo-900 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-300">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-bold text-sm text-white">
                      DiyorAI Concierge
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-[9px] font-mono font-bold text-amber-300 uppercase border border-amber-400/30">
                      Alice AI
                    </span>
                  </div>
                  <p className="text-[10px] text-white/80 font-mono flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Онлайн · Эксперт по Узбекистану</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleClearChat}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors"
                  title="Очистить диалог"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors"
                  title="Свернуть окно"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8FAFC]">
              {messages.map((msg, idx) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs ${
                        isUser
                          ? "bg-[#1E3A8A] text-white font-bold"
                          : "bg-gradient-to-tr from-[#1E3A8A] to-[#2563EB] text-white font-bold shadow-xs"
                      }`}
                    >
                      {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl max-w-[85%] text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? "bg-[#1E3A8A] text-white rounded-tr-xs shadow-xs"
                          : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-xs"
                      }`}
                    >
                      {formatMessageText(msg.text)}
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {loading && (
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#1E3A8A] to-[#2563EB] text-white flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 rounded-tl-xs flex items-center gap-1.5 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-[#1E3A8A] animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-[#1E3A8A] animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-[#1E3A8A] animate-bounce" style={{ animationDelay: "300ms" }} />
                    <span className="text-xs font-mono ml-1 text-slate-500">DiyorAI думает...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Question Chips */}
            <div className="px-3 py-2 bg-slate-100 border-t border-slate-200 flex gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendMessage(q.query)}
                  disabled={loading}
                  className="px-3 py-1 rounded-xl bg-white hover:bg-[#1E3A8A] hover:text-white border border-slate-300 text-[11px] font-medium text-slate-700 transition-all shrink-0 cursor-pointer disabled:opacity-50 shadow-2xs"
                >
                  {q.label}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  language === "uz"
                    ? "Shaharlar, poyezdlar, narxlar haqida so'rang..."
                    : language === "en"
                    ? "Ask about cities, Afrosiyob trains, food..."
                    : "Спросите о городах, билетах, ценах..."
                }
                disabled={loading}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#1E3A8A] focus:bg-white focus:ring-1 focus:ring-[#1E3A8A] transition-all font-sans"
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-xl bg-[#1E3A8A] hover:bg-[#152a65] disabled:opacity-40 text-white transition-all shadow-xs shrink-0 cursor-pointer"
                title="Отправить"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
