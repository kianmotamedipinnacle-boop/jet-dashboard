# Multi-Chat Interface Components

A comprehensive React-based multi-chat dashboard for specialized AI conversations across Medicare, Tech, Strategy, and General contexts.

## 🚀 Features

### Core Functionality
- **Tabbed Interface**: Switch between Medicare, Tech, Strategy, and General chats
- **Independent Conversations**: Each chat maintains its own message history and state
- **Real-time Messaging**: Live message display with typing indicators
- **Activity Indicators**: Unread message badges and notification system
- **Context Preservation**: Conversations maintain state when switching between tabs
- **Mobile Responsive**: Fully optimized for mobile and tablet devices

### UI/UX Highlights
- **Dark Theme**: Matches existing jet-dashboard design
- **Gradient Accents**: Color-coded tabs and messages for each chat type
- **Smooth Animations**: Message transitions, typing indicators, and tab switching
- **Touch Optimized**: Large touch targets and mobile-friendly interactions
- **Accessibility**: Keyboard navigation and screen reader support
- **Loading States**: Skeleton loading and smooth transitions

## 📦 Components

### MultiChatInterface (Main Component)
The primary container component that manages all chat states and coordinates sub-components.

```tsx
import { MultiChatInterface } from '@/components/multi-chat';

function Dashboard() {
  return (
    <div className="h-screen">
      <MultiChatInterface />
    </div>
  );
}
```

### Individual Components

#### ChatTabs
Tab navigation with activity indicators and mobile scroll support.

#### ChatWindow  
Individual chat areas with message history, welcome messages, and input handling.

#### ChatMessage
Individual message bubbles with timestamps, hover effects, and typing indicators.

#### ChatInput
Contextual input component with auto-resize, keyboard shortcuts, and chat-specific placeholders.

#### ActivityIndicator
Badge system showing unread counts, typing status, and last activity.

## 🎨 Chat Types & Styling

### Medicare Chat
- **Color**: Green gradient (`from-green-600 to-emerald-600`)
- **Icon**: Checkmark/Health
- **Context**: Agent management, compliance, plan information
- **Placeholder**: "Ask about Medicare plans, agents, or compliance..."

### Tech Chat  
- **Color**: Blue gradient (`from-blue-600 to-cyan-600`)
- **Icon**: Code brackets
- **Context**: Development, debugging, system architecture
- **Placeholder**: "Discuss development, systems, or technical challenges..."

### Strategy Chat
- **Color**: Purple gradient (`from-purple-600 to-violet-600`) 
- **Icon**: Chart/Analytics
- **Context**: Business strategy, growth, competitive analysis
- **Placeholder**: "Share ideas about business strategy or growth..."

### General Chat
- **Color**: Gray gradient (`from-gray-600 to-slate-600`)
- **Icon**: Chat bubble
- **Context**: General assistance and conversations
- **Placeholder**: "Type your message here..."

## 📱 Responsive Design

### Desktop (1024px+)
- Full tab bar with text labels and activity overview
- Maximum message width: 60-70%
- Hover effects and detailed interactions

### Tablet (769px - 1024px)
- Simplified tab layout
- Adjusted message widths (75%)
- Touch-optimized interactions

### Mobile (< 769px)
- Horizontal scrolling tab bar
- Icon-only tabs with compact labels
- Fixed input positioning
- 85% message width
- Dynamic viewport height support

## 🔧 Customization

### Adding New Chat Types
1. Update the `ChatType` type in `ChatTabs.tsx`
2. Add color scheme to styling functions
3. Add icon and context in relevant components
4. Update sample data and response generation

### Styling Customization
The components use Tailwind CSS with custom CSS file (`multi-chat.css`) for animations and responsive behavior.

### API Integration
Replace the mock `generateAssistantResponse` function with real API calls:

```tsx
const handleSendMessage = async (chatType: ChatType, message: string) => {
  // Your API integration here
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ chatType, message })
  });
  const data = await response.json();
  // Handle response...
};
```

## 🎯 Integration with Existing Dashboard

### Import and Use
```tsx
// In your main dashboard component
import { MultiChatInterface } from '@/components/multi-chat';

export function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Other dashboard components */}
      <div className="lg:col-span-2 h-96">
        <MultiChatInterface />
      </div>
    </div>
  );
}
```

### CSS Import
Add to your main CSS file or component:
```css
@import './multi-chat.css';
```

## ⌨️ Keyboard Shortcuts

- **Enter**: Send message
- **Shift + Enter**: New line in message
- **Tab**: Navigate between UI elements
- **Esc**: Clear current message (planned)

## 🔄 State Management

The component uses React's built-in state management with:
- `chatStates`: Per-chat message history and metadata
- `activeTab`: Current active chat
- `unreadCounts`: Badge tracking
- `typingStates`: Assistant typing indicators

For production, consider integrating with:
- Redux/Zustand for global state
- React Query for API state management
- LocalStorage for conversation persistence

## 🚀 Future Enhancements

- [ ] Message search across all chats
- [ ] File/image sharing
- [ ] Message reactions and threading
- [ ] Voice message support
- [ ] Export conversation history
- [ ] Custom chat types
- [ ] Notification sound preferences
- [ ] Dark/light theme toggle
- [ ] Message encryption
- [ ] Conversation bookmarking

## 🐛 Troubleshooting

### Common Issues

**Messages not displaying**: Check that the height container has explicit height set.

**Mobile layout issues**: Ensure viewport meta tag is set correctly:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**Animation performance**: On lower-end devices, animations can be disabled via `prefers-reduced-motion` CSS queries.

### Performance Optimization

- Messages are not virtualized - consider implementing for 1000+ message conversations
- Image/media messages should be lazy loaded
- Consider debouncing typing indicators for high-frequency updates

## 📄 License

Part of the jet-dashboard project. Follow existing project licensing.