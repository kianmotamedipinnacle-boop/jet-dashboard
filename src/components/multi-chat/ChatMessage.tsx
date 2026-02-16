'use client';

import { useState } from 'react';

interface ChatMessageProps {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
}

export function ChatMessage({ id, content, sender, timestamp, isTyping = false }: ChatMessageProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`max-w-[80%] ${sender === 'user' ? 'md:max-w-[60%]' : 'md:max-w-[70%]'}`}>
        {/* Message bubble */}
        <div
          className={`
            px-4 py-2 rounded-lg relative
            ${sender === 'user'
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white ml-auto'
              : 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-100'
            }
            ${isHovered ? 'transform scale-[1.02]' : ''}
            transition-all duration-200 shadow-md
          `}
        >
          {/* Typing indicator */}
          {isTyping && sender === 'assistant' && (
            <div className="flex space-x-1 mb-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}
          
          {/* Message content */}
          <div className="whitespace-pre-wrap break-words">
            {content}
          </div>
          
          {/* Message tail */}
          <div
            className={`
              absolute top-3 w-0 h-0
              ${sender === 'user'
                ? 'right-[-8px] border-l-[8px] border-l-blue-600 border-t-[6px] border-b-[6px] border-t-transparent border-b-transparent'
                : 'left-[-8px] border-r-[8px] border-r-gray-700 border-t-[6px] border-b-[6px] border-t-transparent border-b-transparent'
              }
            `}
          ></div>
        </div>
        
        {/* Timestamp */}
        <div
          className={`
            text-xs text-gray-400 mt-1 px-1
            ${sender === 'user' ? 'text-right' : 'text-left'}
            ${isHovered ? 'opacity-100' : 'opacity-60'}
            transition-opacity duration-200
          `}
        >
          {formatTime(timestamp)}
        </div>
      </div>
    </div>
  );
}