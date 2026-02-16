'use client';

import { useEffect, useState, useRef } from 'react';

interface AnimatedJetAvatarProps {
  status: 'idle' | 'working' | 'thinking' | 'error' | 'listening' | 'speaking';
  size?: number;
  pulseIntensity?: number;
  showActivity?: boolean;
}

export function AnimatedJetAvatar({ 
  status, 
  size = 64, 
  pulseIntensity = 1,
  showActivity = true 
}: AnimatedJetAvatarProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [currentActivity, setCurrentActivity] = useState('');
  const [orbitAngle, setOrbitAngle] = useState(0);
  const animationRef = useRef<number>(0);

  // Random blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (status !== 'error' && status !== 'working') {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 3000 + Math.random() * 4000);

    return () => clearInterval(blinkInterval);
  }, [status]);

  // Orbit animation for thinking particles
  useEffect(() => {
    if (status === 'thinking') {
      const animate = () => {
        setOrbitAngle((prev) => (prev + 2) % 360);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [status]);

  // Activity messages based on status
  useEffect(() => {
    const activities = {
      idle: ['Ready', 'Monitoring', 'Standby'],
      working: ['Processing...', 'Executing...', 'Working...'],
      thinking: ['Analyzing...', 'Computing...', 'Thinking...'],
      error: ['Error', 'Failed', 'Issue detected'],
      listening: ['Listening...', 'Awaiting input...'],
      speaking: ['Speaking...', 'Responding...']
    };

    if (showActivity && activities[status]) {
      const msgs = activities[status];
      setCurrentActivity(msgs[Math.floor(Math.random() * msgs.length)]);
    }
  }, [status, showActivity]);

  const getStatusColors = () => {
    switch (status) {
      case 'working':
        return {
          body: '#3B82F6',
          accent: '#60A5FA',
          exhaust: '#FCD34D',
          glow: '#DBEAFE',
          particles: '#93C5FD'
        };
      case 'thinking':
        return {
          body: '#8B5CF6',
          accent: '#A78BFA',
          exhaust: '#C084FC',
          glow: '#EDE9FE',
          particles: '#DDD6FE'
        };
      case 'error':
        return {
          body: '#EF4444',
          accent: '#F87171',
          exhaust: '#FCA5A5',
          glow: '#FEE2E2',
          particles: '#FECACA'
        };
      case 'listening':
        return {
          body: '#14B8A6',
          accent: '#5EEAD4',
          exhaust: '#6EE7B7',
          glow: '#CCFBF1',
          particles: '#99F6E4'
        };
      case 'speaking':
        return {
          body: '#F59E0B',
          accent: '#FCD34D',
          exhaust: '#FDE68A',
          glow: '#FEF3C7',
          particles: '#FDE047'
        };
      default:
        return {
          body: '#10B981',
          accent: '#34D399',
          exhaust: '#6EE7B7',
          glow: '#D1FAE5',
          particles: '#86EFAC'
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
      case 'listening': return 'attentive';
      case 'speaking': return 'expressive';
      default: return 'happy';
    }
  };

  // Calculate particle positions for orbiting effect
  const getParticlePosition = (index: number, total: number) => {
    const angle = (360 / total) * index + orbitAngle;
    const radius = size * 0.4;
    const x = 50 + Math.cos((angle * Math.PI) / 180) * radius;
    const y = 50 + Math.sin((angle * Math.PI) / 180) * radius;
    return { x, y };
  };

  return (
    <div 
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Klaus-style animated background layers */}
      <div className="absolute inset-0">
        {/* Primary glow layer */}
        <div 
          className={`absolute inset-0 rounded-full transition-all duration-300 ${
            status === 'working' ? 'animate-pulse' : 
            status === 'thinking' ? 'klaus-morph' : ''
          }`}
          style={{ 
            backgroundColor: colors.glow,
            opacity: status === 'idle' ? 0.2 : 0.4,
            filter: 'blur(8px)',
            transform: `scale(${1 + pulseIntensity * 0.1})`
          }}
        />
        
        {/* Secondary pulsing ring */}
        {(status === 'working' || status === 'thinking') && (
          <div 
            className="absolute inset-0 rounded-full klaus-pulse-ring"
            style={{ 
              border: `2px solid ${colors.accent}`,
              opacity: 0.6,
              animationDelay: '0.5s'
            }}
          />
        )}

        {/* Tertiary energy wave */}
        {status === 'thinking' && (
          <div 
            className="absolute inset-0 rounded-full klaus-energy-wave"
            style={{ 
              background: `radial-gradient(circle, ${colors.particles}40 0%, transparent 70%)`,
              animationDelay: '1s'
            }}
          />
        )}
      </div>
      
      {/* Main SVG Jet with Klaus-style enhancements */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className={`relative z-10 ${
          status === 'thinking' ? 'klaus-thinking' : 
          status === 'working' ? 'klaus-working' : 
          status === 'error' ? 'klaus-error' : 
          status === 'listening' ? 'klaus-listening' :
          status === 'speaking' ? 'klaus-speaking' : 'klaus-idle'
        }`}
      >
        <defs>
          {/* Advanced gradients for Klaus-style depth */}
          <linearGradient id={`bodyGradient-${status}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: colors.accent, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: colors.body, stopOpacity: 1 }} />
          </linearGradient>
          
          <radialGradient id={`cockpitGradient-${status}`}>
            <stop offset="0%" style={{ stopColor: '#F3F4F6', stopOpacity: 0.95 }} />
            <stop offset="100%" style={{ stopColor: '#E5E7EB', stopOpacity: 0.8 }} />
          </radialGradient>

          {/* Glow filter for Klaus-style luminescence */}
          <filter id="klaus-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Jet Body with gradient */}
        <ellipse
          cx="50"
          cy="60"
          rx="25"
          ry="35"
          fill={`url(#bodyGradient-${status})`}
          filter="url(#klaus-glow)"
          className="drop-shadow-lg"
        />
        
        {/* Enhanced Wings with animation */}
        <ellipse
          cx="50"
          cy="45"
          rx="45"
          ry="8"
          fill={colors.accent}
          className={`drop-shadow-md ${status === 'working' ? 'klaus-wing-flap' : ''}`}
          opacity="0.9"
        />
        
        {/* Cockpit Window with gradient */}
        <ellipse
          cx="50"
          cy="35"
          rx="12"
          ry="15"
          fill={`url(#cockpitGradient-${status})`}
          className="drop-shadow-sm"
        />
        
        {/* Klaus-style enhanced eyes */}
        <g className="eyes">
          {getEyeState() === 'blink' ? (
            // Closed eyes with eyelashes
            <>
              <path d="M42 30 Q45 32 48 30" stroke="#374151" strokeWidth="2" fill="none" />
              <path d="M52 30 Q55 32 58 30" stroke="#374151" strokeWidth="2" fill="none" />
            </>
          ) : getEyeState() === 'focused' ? (
            // Intense focused eyes
            <>
              <circle cx="45" cy="30" r="4" fill="#1F2937" />
              <circle cx="55" cy="30" r="4" fill="#1F2937" />
              <circle cx="45" cy="30" r="2" fill="#3B82F6" className="animate-pulse" />
              <circle cx="55" cy="30" r="2" fill="#3B82F6" className="animate-pulse" />
              <circle cx="46" cy="29" r="1" fill="white" />
              <circle cx="56" cy="29" r="1" fill="white" />
            </>
          ) : getEyeState() === 'wonder' ? (
            // Wide wondering eyes with sparkles
            <>
              <circle cx="45" cy="30" r="5" fill="#1F2937" />
              <circle cx="55" cy="30" r="5" fill="#1F2937" />
              <circle cx="45" cy="30" r="3" fill="#8B5CF6" opacity="0.5" />
              <circle cx="55" cy="30" r="3" fill="#8B5CF6" opacity="0.5" />
              <circle cx="44" cy="28" r="1.5" fill="white" />
              <circle cx="54" cy="28" r="1.5" fill="white" />
              <circle cx="47" cy="32" r="0.5" fill="white" opacity="0.5" />
              <circle cx="57" cy="32" r="0.5" fill="white" opacity="0.5" />
            </>
          ) : getEyeState() === 'dizzy' ? (
            // Spiral dizzy eyes
            <>
              <g transform="translate(45, 30)">
                <path d="M0,0 Q-3,-3 -3,0 Q-3,3 0,3 Q3,3 3,0 Q3,-3 0,-3" 
                      stroke="#1F2937" strokeWidth="1.5" fill="none" />
              </g>
              <g transform="translate(55, 30)">
                <path d="M0,0 Q-3,-3 -3,0 Q-3,3 0,3 Q3,3 3,0 Q3,-3 0,-3" 
                      stroke="#1F2937" strokeWidth="1.5" fill="none" />
              </g>
            </>
          ) : getEyeState() === 'attentive' ? (
            // Large attentive eyes
            <>
              <ellipse cx="45" cy="30" rx="3.5" ry="4.5" fill="#1F2937" />
              <ellipse cx="55" cy="30" rx="3.5" ry="4.5" fill="#1F2937" />
              <ellipse cx="45" cy="29" rx="2" ry="2.5" fill="#14B8A6" opacity="0.3" />
              <ellipse cx="55" cy="29" rx="2" ry="2.5" fill="#14B8A6" opacity="0.3" />
              <circle cx="45" cy="28" r="1" fill="white" />
              <circle cx="55" cy="28" r="1" fill="white" />
            </>
          ) : (
            // Happy default eyes
            <>
              <ellipse cx="45" cy="30" rx="2.5" ry="3" fill="#1F2937" />
              <ellipse cx="55" cy="30" rx="2.5" ry="3" fill="#1F2937" />
              <circle cx="45" cy="29" r="1" fill="white" />
              <circle cx="55" cy="29" r="1" fill="white" />
              <path d="M40 35 Q50 42 60 35" stroke="#1F2937" strokeWidth="1.5" fill="none" />
            </>
          )}
        </g>
        
        {/* Enhanced Nose Cone */}
        <ellipse
          cx="50"
          cy="20"
          rx="8"
          ry="12"
          fill={colors.accent}
          opacity="0.95"
          className="drop-shadow-sm"
        />
        
        {/* Klaus-style animated propeller */}
        <g className={`${status === 'working' ? 'klaus-propeller-turbo' : 'klaus-propeller-idle'}`}
           style={{ transformOrigin: '50px 18px' }}>
          <rect x="48" y="15" width="4" height="6" fill="#6B7280" />
          <ellipse cx="50" cy="18" rx="15" ry="2" fill="#9CA3AF" opacity="0.7" />
          {status === 'working' && (
            <ellipse cx="50" cy="18" rx="18" ry="1" fill={colors.exhaust} opacity="0.3" 
                     className="animate-ping" />
          )}
        </g>
        
        {/* Enhanced Exhaust Trails */}
        {(status === 'working' || status === 'thinking' || status === 'speaking') && (
          <g className="exhaust">
            <path
              d="M35 85 Q30 92 20 100"
              stroke={colors.exhaust}
              strokeWidth="4"
              fill="none"
              opacity="0.9"
              className="klaus-exhaust-trail"
              strokeLinecap="round"
            />
            <path
              d="M50 85 Q50 94 50 105"
              stroke={colors.exhaust}
              strokeWidth="5" 
              fill="none"
              opacity="0.8"
              className="klaus-exhaust-trail"
              style={{ animationDelay: '0.3s' }}
              strokeLinecap="round"
            />
            <path
              d="M65 85 Q70 92 80 100"
              stroke={colors.exhaust}
              strokeWidth="4"
              fill="none"
              opacity="0.9"
              className="klaus-exhaust-trail"
              style={{ animationDelay: '0.6s' }}
              strokeLinecap="round"
            />
          </g>
        )}
        
        {/* Klaus-style Status Core */}
        <circle
          cx="50"
          cy="50"
          r="3"
          fill={colors.exhaust}
          className={`${
            status === 'working' ? 'klaus-core-pulse' : 
            status === 'thinking' ? 'klaus-core-spin' :
            status === 'error' ? 'animate-ping' : 'animate-pulse'
          }`}
          filter="url(#klaus-glow)"
        />
      </svg>
      
      {/* Klaus-style Orbiting Particles */}
      {status === 'thinking' && (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className="absolute inset-0 pointer-events-none"
        >
          {[...Array(6)].map((_, i) => {
            const pos = getParticlePosition(i, 6);
            return (
              <circle
                key={i}
                cx={pos.x}
                cy={pos.y}
                r="2"
                fill={colors.particles}
                opacity={0.8 - i * 0.1}
                className="klaus-particle"
                style={{
                  filter: 'blur(0.5px)',
                  animation: `klaus-particle-pulse 2s ease-in-out ${i * 0.2}s infinite`
                }}
              />
            );
          })}
        </svg>
      )}

      {/* Klaus-style Activity Indicator */}
      {showActivity && currentActivity && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <div className={`text-xs px-2 py-1 rounded-full ${
            status === 'error' ? 'bg-red-500/20 text-red-400' :
            status === 'working' ? 'bg-yellow-500/20 text-yellow-400' :
            status === 'thinking' ? 'bg-purple-500/20 text-purple-400' :
            'bg-green-500/20 text-green-400'
          } backdrop-blur-sm animate-fade-in`}>
            {currentActivity}
          </div>
        </div>
      )}

      {/* Klaus-style energy field for listening/speaking */}
      {(status === 'listening' || status === 'speaking') && (
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute inset-0 rounded-full ${
            status === 'listening' ? 'klaus-listening-waves' : 'klaus-speaking-waves'
          }`} style={{
            background: `radial-gradient(circle, transparent 30%, ${colors.particles}20 50%, transparent 70%)`
          }} />
        </div>
      )}
    </div>
  );
}