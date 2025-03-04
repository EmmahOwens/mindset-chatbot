
import { ThemeToggle } from './ThemeToggle';
import { Sidebar } from './Sidebar';
import { ChatInterface } from './ChatInterface';
import { Settings } from 'lucide-react';

export const Layout = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border flex items-center justify-end gap-2 px-4">
          <button className="w-10 h-10 rounded-full neumorph-flat flex items-center justify-center transition-all duration-300 hover:scale-105">
            <Settings className="h-5 w-5" />
          </button>
          <ThemeToggle />
        </header>
        
        <ChatInterface />
      </div>
    </div>
  );
};
