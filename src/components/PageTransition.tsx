
import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const pageRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const page = pageRef.current;
    
    if (page) {
      // Initial animation
      page.style.opacity = '0';
      page.style.transform = 'scale(0.98)';
      
      // Trigger animation after a small delay
      const timer = setTimeout(() => {
        page.style.transition = 'opacity 400ms ease, transform 400ms ease';
        page.style.opacity = '1';
        page.style.transform = 'scale(1)';
      }, 50);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [location.pathname]);
  
  return (
    <div ref={pageRef} className="min-h-screen w-full">
      {children}
    </div>
  );
};

export default PageTransition;
