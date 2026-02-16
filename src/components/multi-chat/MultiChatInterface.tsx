'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChatTabs, ChatType } from './ChatTabs';
import { ChatWindow, Message } from './ChatWindow';
import { Card, CardContent } from '@/components/ui/card';

interface ChatState {
  messages: Message[];
  unreadCount: number;
  isTyping: boolean;
  lastActivity?: Date;
}

type ChatStates = Record<ChatType, ChatState>;

export function MultiChatInterface() {
  // Initialize chat states for all chat types
  const [chatStates, setChatStates] = useState<ChatStates>({
    Medicare: { messages: [], unreadCount: 0, isTyping: false },
    Tech: { messages: [], unreadCount: 0, isTyping: false },
    Strategy: { messages: [], unreadCount: 0, isTyping: false },
    General: { messages: [], unreadCount: 0, isTyping: false },
  });

  const [activeTab, setActiveTab] = useState<ChatType>('General');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize with some sample data (in real app, this would come from API/localStorage)
  useEffect(() => {
    const initializeChatData = () => {
      const sampleMessages: Partial<Record<ChatType, Message[]>> = {
        Medicare: [
          {
            id: '1',
            content: 'How many agents are currently active in our Medicare division?',
            sender: 'user',
            timestamp: new Date(Date.now() - 86400000) // 1 day ago
          },
          {
            id: '2',
            content: 'We currently have 47 active Medicare agents across 8 states. The breakdown is: California (12), Florida (9), Texas (8), New York (6), Arizona (4), Georgia (3), North Carolina (3), and Ohio (2). All agents are properly licensed and certified.',
            sender: 'assistant',
            timestamp: new Date(Date.now() - 86350000)
          }
        ],
        Tech: [
          {
            id: '3',
            content: 'Can you help me debug this API endpoint that\'s returning 500 errors?',
            sender: 'user',
            timestamp: new Date(Date.now() - 3600000) // 1 hour ago
          }
        ],
        Strategy: [
          {
            id: '4',
            content: 'What are the key growth opportunities for our Medicare business in 2025?',
            sender: 'user',
            timestamp: new Date(Date.now() - 1800000) // 30 minutes ago
          }
        ]
      };

      setChatStates(prev => {
        const newStates = { ...prev };
        Object.entries(sampleMessages).forEach(([chatType, messages]) => {
          if (messages && messages.length > 0) {
            newStates[chatType as ChatType] = {
              ...newStates[chatType as ChatType],
              messages,
              lastActivity: messages[messages.length - 1].timestamp,
              unreadCount: chatType === 'Tech' ? 1 : chatType === 'Strategy' ? 1 : 0
            };
          }
        });
        return newStates;
      });
      
      setIsInitialized(true);
    };

    initializeChatData();
  }, []);

  // Handle sending a new message
  const handleSendMessage = useCallback((chatType: ChatType, messageContent: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      sender: 'user',
      timestamp: new Date()
    };

    setChatStates(prev => ({
      ...prev,
      [chatType]: {
        ...prev[chatType],
        messages: [...prev[chatType].messages, newMessage],
        lastActivity: new Date(),
        isTyping: true // Start assistant typing
      }
    }));

    // Simulate assistant response
    setTimeout(() => {
      const assistantResponse = generateAssistantResponse(chatType, messageContent);
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: assistantResponse,
        sender: 'assistant',
        timestamp: new Date()
      };

      setChatStates(prev => ({
        ...prev,
        [chatType]: {
          ...prev[chatType],
          messages: [...prev[chatType].messages, responseMessage],
          lastActivity: new Date(),
          isTyping: false,
          unreadCount: activeTab === chatType ? 0 : prev[chatType].unreadCount + 1
        }
      }));
    }, 1500 + Math.random() * 1000); // Random delay 1.5-2.5s
  }, [activeTab]);

  // Generate contextual assistant responses
  const generateAssistantResponse = (chatType: ChatType, userMessage: string): string => {
    const responses = {
      Medicare: [
        "I'll analyze our Medicare data and provide you with detailed insights. Let me pull the latest information from our agent management system.",
        "Based on current Medicare regulations and our performance metrics, here's what I recommend...",
        "I've reviewed the Medicare compliance requirements and market data. Here's my analysis...",
        "Let me check our Medicare agent performance dashboard and CRM integration for the most current data."
      ],
      Tech: [
        "I'll help you debug this issue. Let me analyze the error logs and check the system architecture.",
        "Based on the error pattern, this looks like it could be a database connection timeout or API rate limiting issue. Let me investigate...",
        "I'm reviewing the codebase and server logs now. Here's what I found...",
        "Let me run some diagnostics on the API endpoint and check for potential bottlenecks."
      ],
      Strategy: [
        "Let me analyze the market data and competitive landscape to provide strategic insights...",
        "Based on industry trends and our current position, I see several key opportunities...",
        "I'll review our business metrics and market analysis to give you a comprehensive strategic recommendation.",
        "Let me examine the competitive landscape and identify the most promising growth vectors."
      ],
      General: [
        "I'm here to help! Let me process your request and provide a comprehensive response.",
        "Thanks for your question. I'll analyze this from multiple angles and give you detailed insights.",
        "Let me think through this systematically and provide you with actionable information.",
        "I'll research this thoroughly and give you a well-informed response."
      ]
    };

    const chatResponses = responses[chatType];
    return chatResponses[Math.floor(Math.random() * chatResponses.length)];
  };

  // Handle tab changes
  const handleTabChange = useCallback((newTab: ChatType) => {
    setActiveTab(newTab);
    
    // Clear unread count for the active tab
    setChatStates(prev => ({
      ...prev,
      [newTab]: {
        ...prev[newTab],
        unreadCount: 0
      }
    }));
  }, []);

  // Prepare tab data for ChatTabs component
  const tabData = Object.entries(chatStates).map(([chatType, state]) => ({
    type: chatType as ChatType,
    unreadCount: state.unreadCount,
    isTyping: state.isTyping,
    lastActivity: state.lastActivity
  }));

  if (!isInitialized) {
    return (
      <Card className="h-full flex items-center justify-center bg-gray-900 border-gray-700">
        <CardContent className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Initializing Multi-Chat Interface...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-gray-900 border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Multi-Chat Dashboard
            </h2>
            <p className="text-gray-400">
              Specialized AI assistance across Medicare, Tech, Strategy & General conversations
            </p>
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400 font-medium">Online</span>
            </div>
            
            {/* Total unread indicator */}
            {Object.values(chatStates).some(state => state.unreadCount > 0) && (
              <div className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full animate-bounce">
                {Object.values(chatStates).reduce((total, state) => total + state.unreadCount, 0)} new
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat tabs */}
      <ChatTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabData={tabData}
      />

      {/* Chat windows container */}
      <div className="flex-1 relative overflow-hidden">
        {Object.entries(chatStates).map(([chatType, state]) => (
          <ChatWindow
            key={chatType}
            chatType={chatType as ChatType}
            messages={state.messages}
            onSendMessage={(message) => handleSendMessage(chatType as ChatType, message)}
            isActive={activeTab === chatType}
            isTyping={state.isTyping}
          />
        ))}
      </div>

      {/* Footer status bar */}
      <div className="px-6 py-3 border-t border-gray-700 bg-gray-800/50 flex justify-between items-center text-sm">
        <div className="flex items-center space-x-4">
          <span className="text-gray-400">
            Active: <span className="text-white font-medium">{activeTab}</span>
          </span>
          <span className="text-gray-400">
            Messages: <span className="text-white font-medium">
              {chatStates[activeTab].messages.length}
            </span>
          </span>
        </div>
        
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <span>Multi-threaded conversations</span>
          <span>•</span>
          <span>Context preservation</span>
          <span>•</span>
          <span>Real-time responses</span>
        </div>
      </div>
    </Card>
  );
}