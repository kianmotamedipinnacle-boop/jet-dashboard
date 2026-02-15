'use client';

interface JetAvatarProps {
  status: 'idle' | 'working' | 'thinking' | 'error';
  size?: number;
}

export function JetAvatar({ status, size = 64 }: JetAvatarProps) {
  const getExpression = () => {
    switch (status) {
      case 'working':
        return '😤'; // Focused exhaust
      case 'thinking':
        return '🤔'; // Thinking face
      case 'error':
        return '😵'; // Dizzy/error
      default:
        return '😊'; // Happy
    }
  };

  return (
    <div 
      className={`relative bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg ${
        status === 'working' ? 'animate-pulse' : 
        status === 'thinking' ? 'animate-bounce' : ''
      }`}
      style={{ 
        width: size, 
        height: size,
        borderRadius: '50% 50% 40% 40%', // Jet nose shape
        transform: 'rotate(0deg)'
      }}
    >
      {/* Front-facing Jet with Face (Thomas style) */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Wings (top) */}
        <div className="absolute -top-3 text-gray-300 text-xs">━━━━━</div>
        
        {/* Main Face */}
        <div className="text-2xl">{getExpression()}</div>
        
        {/* Jet Nose Point */}
        <div className="absolute -bottom-2 text-blue-300 text-xs">▼</div>
      </div>
      
      {/* Animated Glow for Active States */}
      {(status === 'working' || status === 'thinking') && (
        <div className="absolute inset-0 bg-white opacity-20 animate-ping rounded-full" />
      )}
    </div>
  );
}