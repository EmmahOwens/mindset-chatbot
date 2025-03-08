
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Sidebar } from './Sidebar';
import { ChatInterface } from './ChatInterface';
import { Menu, Settings, X } from 'lucide-react';
import { SettingsDialog } from './SettingsDialog';

export const Layout = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  return (
    <div className="min-h-screen flex relative">
      {showSidebar && <Sidebar />}
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${showSidebar ? 'md:ml-72' : ''}`}>
        {/* Floating header controls */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md border border-border/30">
          {!showSidebar && (
            <button
              onClick={() => setShowSidebar(true)}
              className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center transition-all duration-300 hover:scale-105"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          
          <button 
            onClick={() => setShowSettings(true)}
            className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center transition-all duration-300 hover:scale-105"
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
      
      {/* Overlay for mobile when sidebar is open */}
      {showSidebar && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 z-20"
          onClick={() => setShowSidebar(false)}
        >
          <button 
            className="absolute top-4 right-4 h-10 w-10 bg-background rounded-full flex items-center justify-center shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              setShowSidebar(false);
            }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};
