import React, { useState, useRef, useEffect } from 'react';
import { api } from '../../services/api';
import type { AIChatMessage } from '../../types';
import { Sparkles, Send, Bot, X, ArrowRight } from 'lucide-react';

export interface AICompanionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  roomName?: string;
}

let messageIdCounter = 0;
function nextMessageId(): string {
  messageIdCounter += 1;
  return `msg-${messageIdCounter}`;
}

export const AICompanionDrawer: React.FC<AICompanionDrawerProps> = ({
  isOpen,
  onClose,
  roomName,
}) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'init',
      role: 'assistant',
      content: "Hello! I'm your study companion. How are you feeling about today's focus goals?",
      provider: 'XemStreak AI',
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: AIChatMessage = {
      id: nextMessageId(),
      role: 'user',
      content: text,
      timestamp: 'Now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await api.sendAIChat(text, roomName);
      const botMsg: AIChatMessage = {
        id: nextMessageId(),
        role: 'assistant',
        content: res.reply,
        provider: res.provider,
        timestamp: 'Now',
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      let fallbackText = "I'm with you on your study path! Keep taking small, calm steps today.";
      if (text.toLowerCase().includes("don't feel like") || text.toLowerCase().includes("tired")) {
        fallbackText = "Let's make it small. Start a 15-minute session. You only need to focus until the timer ends. 🌱";
      }
      const botMsg: AIChatMessage = {
        id: nextMessageId(),
        role: 'assistant',
        content: fallbackText,
        provider: 'Built-in Companion (Offline)',
        timestamp: 'Now',
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "I don't feel like studying today",
    "How is my tree doing?",
    "Review my progress today",
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1050,
        backgroundColor: 'rgba(9, 23, 44, 0.4)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        className="xem-card"
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '100%',
          borderRadius: '0px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--color-neutral)',
          boxShadow: 'var(--shadow-elevated)',
          padding: '0',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--color-surface)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--rounded-md)',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bot size={20} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="label-md" style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>
                  Study Companion
                </span>
                <span
                  className="xem-chip"
                  style={{
                    fontSize: '10px',
                    padding: '1px 6px',
                    backgroundColor: '#E8F8F0',
                    color: 'var(--color-success)',
                  }}
                >
                  Active
                </span>
              </div>
              <span className="body-sm" style={{ fontSize: '11px', color: 'var(--color-muted)' }}>
                Calm • Context-Aware • Gemini & Groq
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-muted)',
              padding: '6px',
              borderRadius: '6px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Message Thread */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                style={{
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div
                  style={{
                    backgroundColor: isUser ? 'var(--color-primary)' : 'var(--color-surface)',
                    color: isUser ? '#FFFFFF' : 'var(--color-secondary)',
                    padding: '12px 14px',
                    borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    border: `1px solid ${isUser ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    fontSize: '14px',
                    lineHeight: 1.45,
                    boxShadow: 'var(--shadow-subtle)',
                  }}
                >
                  {m.content}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                    gap: '6px',
                    fontSize: '10px',
                    color: 'var(--color-muted)',
                    padding: '0 4px',
                  }}
                >
                  {m.provider && <span>{m.provider}</span>}
                  <span>•</span>
                  <span>{m.timestamp}</span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div
              style={{
                alignSelf: 'flex-start',
                backgroundColor: 'var(--color-surface)',
                padding: '10px 14px',
                borderRadius: '14px 14px 14px 2px',
                fontSize: '13px',
                color: 'var(--color-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Sparkles size={14} className="animate-pulse-live" />
              <span>Thinking with your context...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Prompts */}
        <div style={{ padding: '8px 16px', borderTop: '1px solid var(--color-border)', backgroundColor: '#FAFCFF' }}>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => handleSendMessage(p)}
                style={{
                  whiteSpace: 'nowrap',
                  backgroundColor: 'var(--color-neutral)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--rounded-full)',
                  padding: '4px 10px',
                  fontSize: '11px',
                  color: 'var(--color-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>{p}</span>
                <ArrowRight size={10} />
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div
          style={{
            padding: '14px 16px',
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-neutral)',
            display: 'flex',
            gap: '8px',
          }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Ask your study companion..."
            className="xem-input"
            style={{ height: '42px', fontSize: '13px' }}
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className="xem-button-primary"
            style={{ width: '42px', height: '42px', padding: 0 }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
