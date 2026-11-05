import React, { useState, useRef, useEffect } from 'react';
import { Send, Scissors, RotateCcw, Sparkles, SlidersHorizontal } from 'lucide-react';
import { RevisionEffect, StylePreset } from '../utils/stylistEngine';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  appliedRevision?: RevisionEffect;
}

interface StylistChatPanelProps {
  activeStyle: StylePreset;
  messages: ChatMessage[];
  appliedRevisions: RevisionEffect[];
  isSending: boolean;
  onSendMessage: (messageText: string) => void;
  onResetRevisions: () => void;
}

export const StylistChatPanel: React.FC<StylistChatPanelProps> = ({
  activeStyle,
  messages,
  appliedRevisions,
  isSending,
  onSendMessage,
  onResetRevisions,
}) => {
  const [inputValue, setInputValue] = useState('');
  const chatThreadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 1 && chatThreadRef.current) {
      chatThreadRef.current.scrollTop = chatThreadRef.current.scrollHeight;
    }
  }, [messages.length, isSending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isSending) return;
    onSendMessage(trimmed);
    setInputValue('');
  };

  return (
    <section
      id="ai-stylist"
      aria-label="Bağlama Duyarlı AI Stilist Sohbeti"
      className="bg-white border border-[#E6E0D6] rounded-xl p-6 flex flex-col justify-between"
    >
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-[#E6E0D6]">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#6E665E]">
              <span>Kişisel Terzi & Stil Danışmanı</span>
              <span aria-hidden="true">·</span>
              <span>Aktif Bağlam: {activeStyle.name}</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#181615] mt-1">
              AI Stilist ile Anlık Kombin Revizyonu
            </h2>
          </div>

          {appliedRevisions.length > 0 && (
            <button
              type="button"
              onClick={onResetRevisions}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#575049] hover:text-[#181615] border border-[#E6E0D6] rounded-md hover:bg-[#FAF8F5] transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Revizyonları Sıfırla ({appliedRevisions.length})</span>
            </button>
          )}
        </div>

        {/* Active Tailoring Modifications Summary Bar */}
        {appliedRevisions.length > 0 && (
          <div className="mt-4 p-3.5 rounded-lg bg-[#FAF8F5] border border-[#E6E0D6]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#181615] mb-2">
              <Scissors className="w-3.5 h-3.5 text-[#8C6239]" />
              <span>Uygulanan Terzilik & Kombin Revizyonları</span>
            </div>
            <div className="space-y-1.5">
              {appliedRevisions.flatMap((rev) => rev.detectedChanges).map((change, idx) => (
                <div key={idx} className="text-xs text-[#575049] flex flex-wrap items-baseline gap-1.5">
                  <span className="font-medium text-[#181615]">{change.category}:</span>
                  <span>{change.action}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#6E665E]">{change.technicalSpec}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Revision Prompts */}
        <div className="mt-4">
          <p className="text-xs text-[#6E665E] mb-2 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#8C6239]" />
            <span>Tek Tıkla Hızlı Revizyon Komutları:</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {activeStyle.quickPrompts.map((promptText, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isSending}
                onClick={() => onSendMessage(promptText)}
                className="px-3 py-1.5 text-xs font-medium text-[#181615] bg-[#FAF8F5] hover:bg-[#EFEAE2] border border-[#E6E0D6] rounded-md transition-colors text-left disabled:opacity-50"
              >
                “{promptText}”
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable Conversation Thread */}
      <div
        ref={chatThreadRef}
        data-testid="stylist-chat-thread"
        className="my-4 h-[300px] overflow-y-auto pr-2 space-y-4 border-y border-[#E6E0D6] py-4"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-center gap-2 text-[11px] text-[#6E665E] mb-1">
              <span className="font-medium text-[#181615]">
                {msg.role === 'user' ? 'Siz' : 'Atelier Véra AI Stilist'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-num">{msg.timestamp}</span>
            </div>

            <div
              className={`max-w-[90%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#181615] text-[#FAF8F5]'
                  : 'bg-[#FAF8F5] text-[#181615] border border-[#E6E0D6]'
              }`}
            >
              <p className="whitespace-pre-line">{msg.content}</p>

              {msg.appliedRevision && (
                <div className="mt-2.5 pt-2.5 border-t border-[#E6E0D6] text-xs text-[#575049]">
                  <span className="font-semibold text-[#8C6239]">Görsel & Gardırop Güncellendi: </span>
                  <span>{msg.appliedRevision.summaryTitle}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex items-center gap-2 text-xs text-[#6E665E] py-2">
            <Sparkles className="w-4 h-4 text-[#8C6239] animate-spin" />
            <span>AI Stilist kombin oranlarını ve gardırop parçalarını güncelliyor...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <label htmlFor="stylist-revision-input" className="sr-only">
            Stilist revizyon talimatı yazın
          </label>
          <input
            id="stylist-revision-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Örn: Pantolonun paçasını daralt, ayakkabıyı beyaz sneaker yap..."
            disabled={isSending}
            className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] text-[#181615] placeholder-[#8C8277] border border-[#D8D0C5] rounded-lg focus:outline-none focus:border-[#181615] transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={isSending || !inputValue.trim()}
          className="px-5 py-2.5 bg-[#181615] text-[#FAF8F5] text-xs font-medium rounded-lg hover:bg-[#2E2A27] transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 disabled:opacity-45 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Revizyonu Uygula</span>
        </button>
      </form>
    </section>
  );
};
