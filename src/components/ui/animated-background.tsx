
import React, { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
  children: React.ReactNode;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ children }) => {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!backgroundRef.current) return;
      
      const { clientX, clientY } = e;
      const x = Math.round((clientX / window.innerWidth) * 100);
      const y = Math.round((clientY / window.innerHeight) * 100);
      
      backgroundRef.current.style.background = `
        radial-gradient(circle at ${x}% ${y}%, 
        rgba(147, 39, 143, 0.15) 0%, 
        rgba(211, 149, 229, 0.15) 35%, 
        rgba(236, 172, 232, 0.1) 70%, 
        rgba(246, 219, 245, 0.05) 100%),
        linear-gradient(102.3deg, rgba(147, 39, 143, 0.1) 5.9%, rgba(234, 172, 232, 0.1) 64%, rgba(246, 219, 245, 0.1) 89%)
      `;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div 
        ref={backgroundRef}
        className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-50 to-blue-50 transition-all duration-300"
        style={{ 
          background: 'linear-gradient(102.3deg, rgba(147, 39, 143, 0.1) 5.9%, rgba(234, 172, 232, 0.1) 64%, rgba(246, 219, 245, 0.1) 89%)'
        }}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      </div>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;
