'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, X, MessageSquare } from 'lucide-react';
import { ChatWindow, Message } from './ChatWindow';
import { Card } from '@/components/ui/card';

interface Tab {
  id: string;
  name: string;
  messages: Message[];
  unreadCount: number;
  isTyping: boolean;
  lastActivity?: Date;
  createdAt: Date;
}

interface TabsState {
  tabs: Tab[];
  activeTabId: string | null;
  nextTabNumber: number;
}

export function DynamicMultiChatInterface() {
  const [state, setState] = useState<TabsState>({
    tabs: [],
    activeTabId: null,
    nextTabNumber: 1
  });
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCreatingTab, setIsCreatingTab] = useState(false);
  const [newTabName, setNewTabName] = useState('');
  const newTabInputRef = useRef<HTMLInputElement>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('multiChatState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setState({
          tabs: parsed.tabs.map((tab: any) => ({
            ...tab,
            lastActivity: tab.lastActivity ? new Date(tab.lastActivity) : undefined,
            createdAt: new Date(tab.createdAt),
            messages: tab.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          })),
          activeTabId: parsed.activeTabId,
          nextTabNumber: parsed.nextTabNumber || parsed.tabs.length + 1
        });
      } catch (e) {
        console.error('Failed to parse saved state:', e);
        // Create a default tab if parsing fails
        createDefaultTab();
      }
    } else {
      // Create a default tab for first-time users
      createDefaultTab();
    }
    setIsInitialized(true);
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('multiChatState', JSON.stringify(state));
    }
  }, [state, isInitialized]);

  // Create a default "General" tab
  const createDefaultTab = () => {
    const defaultTab: Tab = {
      id: '1',
      name: 'General',
      messages: [{
        id: '1',
        content: 'Welcome to your dynamic chat interface! Click the + button to create new chat tabs.',
        sender: 'assistant',
        timestamp: new Date()
      }],
      unreadCount: 0,
      isTyping: false,
      createdAt: new Date()
    };
    setState({
      tabs: [defaultTab],
      activeTabId: '1',
      nextTabNumber: 2
    });
  };

  // Create a new tab
  const createTab = (name?: string) => {
    const tabName = name || `Chat ${state.nextTabNumber}`;
    const newTab: Tab = {
      id: Date.now().toString(),
      name: tabName,
      messages: [],
      unreadCount: 0,
      isTyping: false,
      createdAt: new Date()
    };

    setState(prev => ({
      tabs: [...prev.tabs, newTab],
      activeTabId: newTab.id,
      nextTabNumber: prev.nextTabNumber + 1
    }));
    
    setIsCreatingTab(false);
    setNewTabName('');
  };

  // Close a tab
  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    setState(prev => {
      const newTabs = prev.tabs.filter(tab => tab.id !== tabId);
      let newActiveId = prev.activeTabId;
      
      // If closing the active tab, switch to another
      if (prev.activeTabId === tabId) {
        const closedIndex = prev.tabs.findIndex(tab => tab.id === tabId);
        if (newTabs.length > 0) {
          // Try to activate the tab to the right, or left if it was the last tab
          const newIndex = Math.min(closedIndex, newTabs.length - 1);
          newActiveId = newTabs[newIndex].id;
        } else {
          newActiveId = null;
        }
      }
      
      return {
        ...prev,
        tabs: newTabs,
        activeTabId: newActiveId
      };
    });
  };

  // Switch active tab
  const switchTab = (tabId: string) => {
    setState(prev => ({
      ...prev,
      activeTabId: tabId,
      tabs: prev.tabs.map(tab => 
        tab.id === tabId ? { ...tab, unreadCount: 0 } : tab
      )
    }));
  };

  // Handle sending a message
  const handleSendMessage = useCallback((tabId: string, messageContent: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      sender: 'user',
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      tabs: prev.tabs.map(tab => 
        tab.id === tabId
          ? {
              ...tab,
              messages: [...tab.messages, newMessage],
              lastActivity: new Date(),
              isTyping: true
            }
          : tab
      )
    }));

    // Simulate assistant response
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I've received your message: "${messageContent}". How can I help you with this?`,
        sender: 'assistant',
        timestamp: new Date()
      };

      setState(prev => ({
        ...prev,
        tabs: prev.tabs.map(tab => 
          tab.id === tabId
            ? {
                ...tab,
                messages: [...tab.messages, responseMessage],
                lastActivity: new Date(),
                isTyping: false,
                unreadCount: prev.activeTabId === tabId ? 0 : tab.unreadCount + 1
              }
            : tab
        )
      }));
    }, 1500);
  }, []);

  // Get active tab
  const activeTab = state.tabs.find(tab => tab.id === state.activeTabId);

  if (!isInitialized) {
    return (
      <Card className="h-full flex items-center justify-center bg-gray-900 border-gray-700">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-gray-900 border-gray-700 overflow-hidden flex flex-col">
      {/* Header with tabs */}
      <div className="border-b border-gray-700 bg-gray-800">
        <div className="flex items-center p-2 gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600">
          {/* Tabs */}
          {state.tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`
                group flex items-center gap-2 px-3 py-1.5 rounded-md text-sm
                transition-all duration-200 whitespace-nowrap min-w-[120px] max-w-[200px]
                ${state.activeTabId === tab.id
                  ? 'bg-gray-700 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                }
              `}
            >
              <MessageSquare size={14} />
              <span className="truncate flex-1">{tab.name}</span>
              
              {/* Unread indicator */}
              {tab.unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {tab.unreadCount}
                </span>
              )}
              
              {/* Close button */}
              <button
                onClick={(e) => closeTab(tab.id, e)}
                className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
              >
                <X size={14} />
              </button>
            </button>
          ))}

          {/* New tab button or input */}
          {isCreatingTab ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createTab(newTabName);
              }}
              className="flex items-center"
            >
              <input
                ref={newTabInputRef}
                type="text"
                value={newTabName}
                onChange={(e) => setNewTabName(e.target.value)}
                onBlur={() => {
                  if (!newTabName) {
                    setIsCreatingTab(false);
                  }
                }}
                placeholder="Tab name..."
                className="bg-gray-700 text-white px-3 py-1.5 rounded-md text-sm w-32 
                         border border-gray-600 focus:border-blue-500 focus:outline-none"
                autoFocus
              />
            </form>
          ) : (
            <button
              onClick={() => {
                setIsCreatingTab(true);
                setTimeout(() => newTabInputRef.current?.focus(), 50);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm
                       bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200
                       transition-all duration-200"
            >
              <Plus size={14} />
              <span>New Tab</span>
            </button>
          )}
        </div>
      </div>

      {/* Chat content area */}
      {state.tabs.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <MessageSquare size={48} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl text-gray-300 mb-2">No active chats</h3>
            <p className="text-gray-500 mb-4">
              Create a new tab to start a conversation
            </p>
            <button
              onClick={() => createTab()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                       transition-colors inline-flex items-center gap-2"
            >
              <Plus size={16} />
              Create First Tab
            </button>
          </div>
        </div>
      ) : activeTab ? (
        <div className="flex-1 relative">
          <ChatWindow
            chatType={activeTab.name}
            messages={activeTab.messages}
            onSendMessage={(message) => handleSendMessage(activeTab.id, message)}
            isActive={true}
            isTyping={activeTab.isTyping}
          />
        </div>
      ) : null}

      {/* Status bar */}
      <div className="px-4 py-2 border-t border-gray-700 bg-gray-800/50 flex justify-between items-center text-xs">
        <div className="flex items-center gap-4 text-gray-400">
          <span>
            Tabs: <span className="text-white font-medium">{state.tabs.length}</span>
          </span>
          {activeTab && (
            <span>
              Messages: <span className="text-white font-medium">{activeTab.messages.length}</span>
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-gray-500">
          <span>Dynamic tabs</span>
          <span>•</span>
          <span>Persistent state</span>
        </div>
      </div>
    </Card>
  );
}