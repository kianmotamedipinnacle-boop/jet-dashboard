'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Brain, Zap, Heart, FileText, Send, Circle } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  sessionId: string;
}

interface ChatSession {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  unreadCount: number;
  lastMessage?: string;
  lastActivity?: Date;
}

export function MultiChatInterface() {
  const [sessions, setSessions] = useState<ChatSession[]>([
    { id: 'medicare', name: 'Medicare', icon: Heart, color: 'text-red-400', unreadCount: 0 },
    { id: 'tech', name: 'Tech', icon: Zap, color: 'text-blue-400', unreadCount: 0 },
    { id: 'strategy', name: 'Strategy', icon: Brain, color: 'text-purple-400', unreadCount: 0 },
    { id: 'general', name: 'General', icon: FileText, color: 'text-gray-400', unreadCount: 0 },
  ]);

  const [activeSession, setActiveSession] = useState<string>('general');
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    medicare: [],
    tech: [],
    strategy: [],
    general: [],
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load messages for the active session
  useEffect(() => {
    loadMessages(activeSession);
  }, [activeSession]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, activeSession]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/multi-chat/messages/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(prev => ({ ...prev, [sessionId]: data }));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
      sessionId: activeSession,
    };

    // Add user message immediately
    setMessages(prev => ({
      ...prev,
      [activeSession]: [...(prev[activeSession] || []), newMessage],
    }));
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/multi-chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: activeSession,
          message: inputValue,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => ({
          ...prev,
          [activeSession]: [...prev[activeSession], data.reply],
        }));
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Update session unread counts
  useEffect(() => {
    const updateActivity = async () => {
      try {
        const response = await fetch('/api/multi-chat/activity');
        if (response.ok) {
          const activity = await response.json();
          setSessions(prev => prev.map(session => ({
            ...session,
            unreadCount: session.id === activeSession ? 0 : (activity[session.id]?.unread || 0),
            lastActivity: activity[session.id]?.lastActivity,
          })));
        }
      } catch (error) {
        console.error('Error updating activity:', error);
      }
    };

    const interval = setInterval(updateActivity, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [activeSession]);

  const activeSessionData = sessions.find(s => s.id === activeSession);

  return (
    <div className="flex h-[calc(100vh-10rem)] bg-slate-900 rounded-lg overflow-hidden">
      {/* Sidebar with chat tabs */}
      <div className="w-64 bg-slate-800 border-r border-slate-700">
        <div className="p-4">
          <h2 className="text-white font-semibold mb-4">Conversations</h2>
          <div className="space-y-2">
            {sessions.map(session => {
              const Icon = session.icon;
              const isActive = session.id === activeSession;
              return (
                <button
                  key={session.id}
                  onClick={() => setActiveSession(session.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-slate-700 text-white'
                      : 'hover:bg-slate-700/50 text-gray-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${session.color}`} />
                    <span className="font-medium">{session.name}</span>
                  </div>
                  {session.unreadCount > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {session.unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Quick shortcuts info */}
        <div className="p-4 mt-auto border-t border-slate-700">
          <p className="text-xs text-gray-400">Quick switch:</p>
          <p className="text-xs text-gray-500 mt-1">Ctrl+1-4 for tabs</p>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="bg-slate-800 p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {activeSessionData && (
                <>
                  <activeSessionData.icon className={`h-6 w-6 ${activeSessionData.color}`} />
                  <h3 className="text-white font-semibold text-lg">{activeSessionData.name}</h3>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              {isTyping && (
                <div className="flex items-center gap-2">
                  <Circle className="h-2 w-2 fill-current animate-pulse" />
                  <span>Jet is typing...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages[activeSession]?.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Start a conversation in {activeSessionData?.name}</p>
              <p className="text-sm mt-2">Ask me anything about this topic!</p>
            </div>
          ) : (
            messages[activeSession]?.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-gray-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs mt-2 opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="bg-slate-800 p-4 border-t border-slate-700">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${activeSessionData?.name}...`}
              className="flex-1 bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isTyping}
            />
            <button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isTyping}
              className={`p-3 rounded-lg transition-colors ${
                inputValue.trim() && !isTyping
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}