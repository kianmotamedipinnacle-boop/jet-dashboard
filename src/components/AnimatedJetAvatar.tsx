'use client';

import { useEffect, useState } from 'react';

interface AnimatedJetAvatarProps {
  status: 'idle' | 'working' | 'thinking' | 'error';
  size?: number;
}

export function AnimatedJetAvatar({ status, size = 64 }: AnimatedJetAvatarProps) {
  const [isBlinking, setIsBlinking] = useState(false);

  // Random blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 4000); // Random blink every 3-7 seconds

    return () => clearInterval(blinkInterval);
  }, []);

  const getStatusColors = () => {
    switch (status) {
      case 'working':
        return {
          body: '#3B82F6', // Blue
          accent: '#60A5FA',
          exhaust: '#FCD34D',
          glow: '#DBEAFE'
        };
      case 'thinking':
        return {
          body: '#8B5CF6', // Purple  
          accent: '#A78BFA',
          exhaust: '#C084FC',
          glow: '#EDE9FE'
        };
      case 'error':
        return {
          body: '#EF4444', // Red
          accent: '#F87171', 
          exhaust: '#FCA5A5',
          glow: '#FEE2E2'
        };
      default: // idle
        return {
          body: '#10B981', // Green
          accent: '#34D399',
          exhaust: '#6EE7B7', 
          glow: '#D1FAE5'
        };
    }
  };

  const colors = getStatusColors();
  
  const getEyeState = () => {
    if (isBlinking) return 'blink';
    switch (status) {
      case 'working': return 'focused';
      case 'thinking': return 'wonder';
      case 'error': return 'dizzy';
      default: return 'happy';
    }
  };

  return (
    <div 
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Background Glow */}
      <div 
        className={`absolute inset-0 opacity-30 ${
          status === 'working' ? 'jet-status-glow' : 
          status === 'thinking' ? 'jet-gemini-morph' : 'rounded-full'
        }`}
        style={{ backgroundColor: colors.glow }}
      />
      
      {/* Additional Gemini-inspired thinking glow */}
      {status === 'thinking' && (
        <div 
          className="absolute inset-0 opacity-20 jet-gemini-morph"
          style={{ 
            backgroundColor: colors.accent,
            animationDelay: '2s',
            animationDuration: '6s'
          }}
        />
      )}
      
      {/* Main SVG Jet */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className={`relative z-10 ${
          status === 'thinking' ? 'animate-bounce' : 
          status === 'working' ? 'jet-working-pulse' : 
          status === 'error' ? 'jet-error-shake' : ''
        }`}
      >
        {/* Jet Body (Front View) */}
        <ellipse
          cx="50"
          cy="60"
          rx="25"
          ry="35"
          fill={colors.body}
          className="drop-shadow-lg"
        />
        
        {/* Wings */}
        <ellipse
          cx="50"
          cy="45"
          rx="45"
          ry="8"
          fill={colors.accent}
          className="drop-shadow-md"
        />
        
        {/* Cockpit Window */}
        <ellipse
          cx="50"
          cy="35"
          rx="12"
          ry="15"
          fill="#E5E7EB"
          opacity="0.9"
        />
        
        {/* Eyes */}
        <g className="eyes">
          {getEyeState() === 'blink' ? (
            // Closed eyes
            <>
              <path d="M42 30 Q45 32 48 30" stroke="#374151" strokeWidth="2" fill="none" />
              <path d="M52 30 Q55 32 58 30" stroke="#374151" strokeWidth="2" fill="none" />
            </>
          ) : getEyeState() === 'focused' ? (
            // Focused eyes (working)
            <>
              <ellipse cx="45" cy="30" rx="3" ry="4" fill="#1F2937" />
              <ellipse cx="55" cy="30" rx="3" ry="4" fill="#1F2937" />
              <ellipse cx="45" cy="29" rx="1" ry="1" fill="white" />
              <ellipse cx="55" cy="29" rx="1" ry="1" fill="white" />
            </>
          ) : getEyeState() === 'wonder' ? (
            // Wide wondering eyes (thinking)
            <>
              <circle cx="45" cy="30" r="4" fill="#1F2937" />
              <circle cx="55" cy="30" r="4" fill="#1F2937" />
              <circle cx="45" cy="28" r="1.5" fill="white" />
              <circle cx="55" cy="28" r="1.5" fill="white" />
            </>
          ) : getEyeState() === 'dizzy' ? (
            // Dizzy X eyes (error)
            <>
              <path d="M42 27 L48 33 M48 27 L42 33" stroke="#1F2937" strokeWidth="2" />
              <path d="M52 27 L58 33 M58 27 L52 33" stroke="#1F2937" strokeWidth="2" />
            </>
          ) : (
            // Happy eyes (idle)
            <>
              <ellipse cx="45" cy="30" rx="2.5" ry="3" fill="#1F2937" />
              <ellipse cx="55" cy="30" rx="2.5" ry="3" fill="#1F2937" />
              <ellipse cx="45" cy="29" rx="1" ry="1" fill="white" />
              <ellipse cx="55" cy="29" rx="1" ry="1" fill="white" />
              <path d="M42 35 Q50 40 58 35" stroke="#1F2937" strokeWidth="1.5" fill="none" />
            </>
          )}
        </g>
        
        {/* Nose Cone */}
        <ellipse
          cx="50"
          cy="20"
          rx="8"
          ry="12"
          fill={colors.accent}
          className="drop-shadow-sm"
        />
        
        {/* Propeller (custom fast spin when working) */}
        <g className={`origin-center ${status === 'working' ? 'jet-propeller-working' : ''}`}
           transform-origin="50 18">
          <rect x="48" y="15" width="4" height="6" fill="#6B7280" />
          <ellipse cx="50" cy="18" rx="15" ry="2" fill="#9CA3AF" opacity="0.7" />
        </g>
        
        {/* Exhaust Trails (custom animated) */}
        {(status === 'working' || status === 'thinking') && (
          <g className="exhaust">
            <path
              d="M35 85 Q30 90 25 95"
              stroke={colors.exhaust}
              strokeWidth="3"
              fill="none"
              opacity="0.8"
              className="jet-exhaust"
            />
            <path
              d="M50 85 Q50 92 50 98"
              stroke={colors.exhaust}
              strokeWidth="3" 
              fill="none"
              opacity="0.6"
              className="jet-exhaust"
              style={{ animationDelay: '0.5s' }}
            />
            <path
              d="M65 85 Q70 90 75 95"
              stroke={colors.exhaust}
              strokeWidth="3"
              fill="none"
              opacity="0.8"
              className="jet-exhaust"
              style={{ animationDelay: '1s' }}
            />
          </g>
        )}
        
        {/* Status Indicator Light */}
        <circle
          cx="50"
          cy="50"
          r="2"
          fill={colors.exhaust}
          className={status === 'working' ? 'animate-ping' : 'animate-pulse'}
        />
      </svg>
      
      {/* Floating Particles (Gemini-inspired) */}
      {status === 'thinking' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full jet-thinking-particles opacity-70"
              style={{
                left: `${20 + i * 15}%`,
                top: `${15 + i * 8}%`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}