'use client';

import { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSendMessage: (content: string, type: 'TEXTE' | 'IMAGE' | 'AUDIO' | 'VIDEO') => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 140);
      textareaRef.current.style.height = `${newHeight}px`;
      textareaRef.current.style.overflowY =
        textareaRef.current.scrollHeight > 140 ? 'auto' : 'hidden';
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    onSendMessage(input, 'TEXTE');
    setInput('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 px-4 pb-4 pt-2 border-t border-white/5 flex-shrink-0"
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        placeholder="Écris un message..."
        rows={1}
        className="flex-1 bg-card text-cream placeholder-muted rounded-3xl px-5 py-3.5 text-[15px] outline-none border border-white/10 focus:border-coral cursor-text resize-none max-h-[140px] break-words overflow-hidden"
      />

      <button
        type="submit"
        className="w-12 h-12 rounded-full flex items-center justify-center bg-[linear-gradient(135deg,var(--color-coral),var(--color-amber))] text-ink text-xl cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
      >
        ➤
      </button>
    </form>
  );
}