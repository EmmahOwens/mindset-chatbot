
import { useState, useEffect, useRef } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Sidebar } from './Sidebar';
import { ChatInterface } from './ChatInterface';
import { Menu, Settings } from 'lucide-react';
import { SettingsDialog } from './SettingsDialog';

export const Layout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };
  
  // Handle touch events for swipe gestures
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartX(e.touches[0].clientX);
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartX === null) return;
      
      const currentX = e.touches[0].clientX;
      const diff = currentX - touchStartX;
      
      // Swipe right to open sidebar (when closed)
      if (diff > 70 && !showSidebar) {
        setShowSidebar(true);
        setTouchStartX(null);
      }
      
      // Swipe left to close sidebar (when open)
      if (diff < -70 && showSidebar) {
        setShowSidebar(false);
        setTouchStartX(null);
      }
    };
    
    const handleTouchEnd = () => {
      setTouchStartX(null);
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchmove', handleTouchMove);
      container.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [touchStartX, showSidebar]);
  
  return (
    <div className="min-h-screen flex relative" ref={containerRef}>
      {/* Sidebar that overlays the content with animation */}
      <div 
        className={`fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onToggle={toggleSidebar} />
      </div>
      
      {/* Semi-transparent overlay that blurs content when sidebar is open */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={() => setShowSidebar(false)}
        />
      )}
      
      <div className="flex-1 flex flex-col transition-all duration-500 ease-in-out">
        {/* Floating header controls without background */}
        <div className="fixed top-4 right-4 z-30 flex items-center gap-3">
          {/* Show toggle button on the left when sidebar is closed */}
          {!showSidebar && (
            <button
              onClick={toggleSidebar}
              className="fixed left-4 top-4 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center transition-all duration-300 hover:scale-105"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          
          <button 
            onClick={() => setShowSettings(true)}
            className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center transition-all duration-300 hover:scale-105"
            aria-label="Open settings"
          >
            <Settings className="h-5 w-5" />
          </button>
          <ThemeToggle />
        </div>
        
        <div className="flex-1 flex flex-col h-screen">
          <ChatInterface />
        </div>
        
        <SettingsDialog open={showSettings} onOpenChange={setShowSettings} />
      </div>
    </div>
  );
};
