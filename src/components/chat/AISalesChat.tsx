"use client";

import { useState, useEffect, useRef } from "react";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string | Date;
}

interface AISalesChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const STARTER_PROMPTS = [
  "Looking for a WordPress developer",
  "Need help with a slow / broken site",
  "Agency white-label partner enquiry",
  "How can I book a call with Naveen?",
];

export default function AISalesChat({ isOpen, onClose }: AISalesChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");
  const [sessionToken, setSessionToken] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session and restore conversation
  useEffect(() => {
    if (typeof window === "undefined") return;

    let token = sessionStorage.getItem("ng_chat_token");
    if (!token) {
      token = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
      sessionStorage.setItem("ng_chat_token", token);
    }
    setSessionToken(token);

    const savedConvId = sessionStorage.getItem("ng_chat_conv_id");
    if (savedConvId) {
      setConversationId(savedConvId);
      // Fetch conversation history
      fetch(`/api/chat?conversationId=${encodeURIComponent(savedConvId)}&sessionToken=${encodeURIComponent(token)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.messages && Array.isArray(data.messages) && data.messages.length > 0) {
            setMessages(data.messages);
          } else {
            setInitialGreeting();
          }
        })
        .catch((err) => {
          console.warn("Failed to load chat history:", err);
          setInitialGreeting();
        });
    } else {
      setInitialGreeting();
    }
  }, []);

  const setInitialGreeting = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hi! I'm Naveen's AI assistant. Looking for a WordPress development partner, planning a new website, or need help with performance and WooCommerce? I can help answer questions and arrange a call with Naveen.",
        timestamp: new Date(),
      },
    ]);
  };

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, loading]);

  const sendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: Message = {
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: conversationId || undefined,
          sessionToken,
          message: text,
        }),
      });

      const data = await res.json();
      if (res.ok && data?.reply) {
        if (data.conversationId) {
          setConversationId(data.conversationId);
          sessionStorage.setItem("ng_chat_conv_id", data.conversationId);
        }
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.reply,
            timestamp: new Date(),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I encountered an issue processing your request. Please try again or reach out directly at hello@naveengaur.com.",
            timestamp: new Date(),
          },
        ]);
      }
    } catch (e) {
      console.error("Chat message error:", e);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, network error. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-label="Naveen's AI Sales Assistant"
      className="fixed bottom-20 right-5 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[540px] max-h-[calc(100vh-6.5rem)] flex flex-col bg-[#0D0D0D] border border-white/15 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#141414] border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[#C4A35A]/20 flex items-center justify-center text-[#C4A35A] font-semibold text-xs border border-[#C4A35A]/40">
              NG
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0D0D0D]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-semibold text-white tracking-wide">Naveen's Assistant</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#C4A35A]/15 text-[#C4A35A] border border-[#C4A35A]/30">
                AI
              </span>
            </div>
            <p className="text-[11px] text-white/50">Typically replies instantly</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-white/60 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
          title="Close chat"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#C4A35A] text-[#0D0D0D] font-medium rounded-tr-sm"
                  : "bg-[#181818] text-white/90 border border-white/10 rounded-tl-sm whitespace-pre-wrap"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-1.5 py-2 px-3 bg-[#181818] border border-white/10 rounded-2xl rounded-tl-sm w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C4A35A] animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#C4A35A] animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#C4A35A] animate-bounce" />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter Prompts (if chat just started) */}
      {messages.length <= 2 && (
        <div className="px-3 py-2 bg-[#101010] border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
          {STARTER_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => sendMessage(prompt)}
              className="text-[11px] whitespace-nowrap bg-white/5 hover:bg-[#C4A35A]/20 hover:text-[#C4A35A] text-white/70 border border-white/10 rounded-full px-2.5 py-1 transition-colors flex-shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <div className="p-3 bg-[#141414] border-t border-white/10 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question or describe your project..."
          className="flex-1 bg-[#1C1C1C] text-white text-xs px-3.5 py-2.5 rounded-full border border-white/10 focus:outline-none focus:border-[#C4A35A] transition-colors placeholder:text-white/40"
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className="w-9 h-9 rounded-full bg-[#C4A35A] text-[#0D0D0D] flex items-center justify-center hover:bg-[#d4b46a] disabled:opacity-40 disabled:hover:bg-[#C4A35A] transition-all cursor-pointer flex-shrink-0"
          title="Send message"
        >
          <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
