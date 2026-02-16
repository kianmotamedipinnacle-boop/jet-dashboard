'use client';

import { useEffect, useState, ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  transitionKey?: string;
}

export function PageTransition({ children, transitionKey }: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in
    setIsVisible(true);

    return () => {
      // Clean up when component unmounts
      setIsVisible(false);
    };
  }, [transitionKey]);

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        isVisible
          ? 'opacity-100 transform translate-y-0'
          : 'opacity-0 transform translate-y-4'
      }`}
    >
      {children}
    </div>
  );
}