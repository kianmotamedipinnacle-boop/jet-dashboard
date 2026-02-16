'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatWindowProps {
  chatType: string;
  messages: Message[];
  onSendMessage: (message: string) => void;
  isActive: boolean;
  isTyping?: boolean;
}

export function ChatWindow({ 
  chatType, 
  messages, 
  onSendMessage, 
  isActive, 
  isTyping = false 
}: ChatWindowProps) {
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [messages, isAutoScroll, isTyping]);

  // Check if user has scrolled up
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setIsAutoScroll(isNearBottom);
    }
  };

  const getWelcomeMessage = () => {
    switch (chatType) {
      case 'Medicare':
        return "Welcome to Medicare Chat! I can help you with agent management, plan information, compliance questions, and market analysis. What would you like to discuss?";
      case 'Tech':
        return "Welcome to Tech Chat! I'm here to help with development, system architecture, debugging, API integration, and technical challenges. What can I help you build?";
      case 'Strategy':
        return "Welcome to Strategy Chat! Let's discuss business growth, market opportunities, competitive analysis, and strategic planning. What's on your mind?";
      case 'General':
        return "Welcome to General Chat! I'm here to help with anything - ask me questions, brainstorm ideas, or just have a conversation. How can I assist you today?";
      default:
        return "Hello! How can I help you today?";
    }
  };

  const getChatGradient = () => {
    switch (chatType) {
      case 'Medicare':
        return 'from-green-900/20 via-emerald-900/10 to-transparent';
      case 'Tech':
        return 'from-blue-900/20 via-cyan-900/10 to-transparent';
      case 'Strategy':
        return 'from-purple-900/20 via-violet-900/10 to-transparent';
      case 'General':
        return 'from-gray-900/20 via-slate-900/10 to-transparent';
      default:
        return 'from-gray-900/20 via-slate-900/10 to-transparent';
    }
  };

  const scrollToBottom = () => {
    setIsAutoScroll(true);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div 
      className={`
        h-full flex flex-col bg-gray-900 
        ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'}
        transition-all duration-300
      `}
    >
      {/* Chat header */}
      <div className={`
        p-4 bg-gradient-to-r ${getChatGradient()}
        border-b border-gray-700/50 flex-shrink-0
      `}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {chatType} Chat
            </h3>
            <p className="text-sm text-gray-400">
              {messages.length === 0 
                ? 'Start a new conversation' 
                : `${messages.length} messages`
              }
            </p>
          </div>
          
          {/* Chat actions */}
          <div className="flex items-center space-x-2">
            {/* Clear chat button */}
            <button
              onClick={() => {
                // This would be handled by parent component
                console.log('Clear chat requested');
              }}
              className="
                p-2 text-gray-400 hover:text-red-400 
                hover:bg-red-900/20 rounded-md
                transition-all duration-200
              "
              title="Clear chat"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="
          flex-1 overflow-y-auto p-4 space-y-2
          scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600
          hover:scrollbar-thumb-gray-500
        "
      >
        {/* Welcome message */}
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className={`
              p-6 rounded-lg bg-gradient-to-br ${getChatGradient()}
              border border-gray-700/30 max-w-md mx-auto
            `}>
              <div className={`
                w-12 h-12 mx-auto mb-4 rounded-full 
                bg-gradient-to-r ${getChatGradient()} 
                flex items-center justify-center
              `}>
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-gray-300 text-sm">
                {getWelcomeMessage()}
              </p>
            </div>
          </div>
        )}

        {/* Message list */}
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            id={message.id}
            content={message.content}
            sender={message.sender}
            timestamp={message.timestamp}
          />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <ChatMessage
            id="typing"
            content=""
            sender="assistant"
            timestamp={new Date()}
            isTyping={true}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      {!isAutoScroll && (
        <div className="absolute bottom-24 right-6 z-10">
          <button
            onClick={scrollToBottom}
            className="
              p-2 bg-gray-700 hover:bg-gray-600 
              text-white rounded-full shadow-lg
              transition-all duration-200 transform hover:scale-110
            "
            title="Scroll to bottom"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      )}

      {/* Input area */}
      <div className="flex-shrink-0 p-4 border-t border-gray-700/50">
        <ChatInput
          onSendMessage={onSendMessage}
          disabled={isTyping}
          chatType={chatType}
        />
      </div>
    </div>
  );
}