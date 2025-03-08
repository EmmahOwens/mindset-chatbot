
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Sidebar } from './Sidebar';
import { ChatInterface } from './ChatInterface';
import { Menu, Settings } from 'lucide-react';
import { SettingsDialog } from './SettingsDialog';

export const Layout = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  return (
    <div className="min-h-screen flex relative">
      {/* Sidebar that overlays the content with animation */}
      <div 
        className={`fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onToggle={() => setShowSidebar(false)} />
      </div>
      
      <div className="flex-1 flex flex-col transition-all duration-500 ease-in-out">
        {/* Floating header controls without background */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
          {/* Show toggle button on the left when sidebar is closed */}
          {!showSidebar && (
            <button
              onClick={() => setShowSidebar(true)}
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
