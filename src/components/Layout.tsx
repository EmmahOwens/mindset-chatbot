
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
      
      <div className={`flex-1 flex flex-col ${showSidebar ? 'md:ml-72' : ''}`}>
        <header className="h-16 border-b border-border flex items-center justify-between gap-2 px-4 bg-background z-20">
          {!showSidebar && (
            <button
              onClick={() => setShowSidebar(true)}
              className="w-10 h-10 rounded-full neumorph-flat flex items-center justify-center transition-all duration-300 hover:scale-105"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          
          <div className="flex-1 md:flex-none"></div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowSettings(true)}
              className="w-10 h-10 rounded-full neumorph-flat flex items-center justify-center transition-all duration-300 hover:scale-105"
            >
              <Settings className="h-5 w-5" />
            </button>
            <ThemeToggle />
          </div>
        </header>
        
        <ChatInterface />
        
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
