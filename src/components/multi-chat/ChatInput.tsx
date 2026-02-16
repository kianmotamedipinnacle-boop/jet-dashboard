'use client';

import { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  chatType: 'Medicare' | 'Tech' | 'Strategy' | 'General';
}

export function ChatInput({ onSendMessage, disabled = false, placeholder, chatType }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      setIsComposing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const getPlaceholderText = () => {
    if (placeholder) return placeholder;
    
    switch (chatType) {
      case 'Medicare':
        return 'Ask about Medicare plans, agents, or compliance...';
      case 'Tech':
        return 'Discuss development, systems, or technical challenges...';
      case 'Strategy':
        return 'Share ideas about business strategy or growth...';
      case 'General':
        return 'Type your message here...';
      default:
        return 'Type your message here...';
    }
  };

  const getAccentColor = () => {
    switch (chatType) {
      case 'Medicare':
        return 'from-green-600 to-emerald-600 focus-within:ring-green-500';
      case 'Tech':
        return 'from-blue-600 to-cyan-600 focus-within:ring-blue-500';
      case 'Strategy':
        return 'from-purple-600 to-violet-600 focus-within:ring-purple-500';
      case 'General':
        return 'from-gray-600 to-slate-600 focus-within:ring-gray-500';
      default:
        return 'from-blue-600 to-cyan-600 focus-within:ring-blue-500';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div
        className={`
          bg-gradient-to-r ${getAccentColor()}
          p-[1px] rounded-lg
          ${isComposing ? 'animate-pulse' : ''}
          transition-all duration-300
        `}
      >
        <div className="bg-gray-800 rounded-lg p-3 flex items-end space-x-3">
          {/* Message input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setIsComposing(e.target.value.length > 0);
              }}
              onKeyDown={handleKeyDown}
              placeholder={getPlaceholderText()}
              disabled={disabled}
              className="
                w-full bg-transparent text-white placeholder-gray-400
                resize-none outline-none min-h-[40px] max-h-[120px]
                scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              rows={1}
            />
            
            {/* Character count for long messages */}
            {message.length > 500 && (
              <div className="absolute -bottom-5 right-0 text-xs text-gray-400">
                {message.length}/2000
              </div>
            )}
          </div>
          
          {/* Send button */}
          <button
            type="submit"
            disabled={disabled || !message.trim()}
            className={`
              p-2 rounded-md transition-all duration-200 flex-shrink-0
              ${message.trim() && !disabled
                ? `bg-gradient-to-r ${getAccentColor()} hover:shadow-lg transform hover:scale-105 text-white`
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Input hints */}
      <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
        <span>Press Enter to send, Shift+Enter for new line</span>
        <span className={`${disabled ? 'text-red-400' : 'text-gray-500'}`}>
          {disabled ? 'Assistant is typing...' : `${chatType} Chat`}
        </span>
      </div>
    </form>
  );
}