
import { useChat } from '@/context/ChatContext';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { QuickResponses } from './QuickResponses';
import { useEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const ChatInterface = () => {
  const { activeMessages, activeChat } = useChat();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [activeMessages]);
  
  // Show scroll buttons when chat is scrollable
  useEffect(() => {
    const checkScrollable = () => {
      if (chatContainerRef.current) {
        const { scrollHeight, clientHeight } = chatContainerRef.current;
        setShowScrollButtons(scrollHeight > clientHeight);
      }
    };
    
    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    
    return () => {
      window.removeEventListener('resize', checkScrollable);
    };
  }, [activeMessages]);
  
  const scrollToTop = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };
  
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-b from-background to-background/80 rounded-2xl relative">
      <div 
        ref={chatContainerRef}
        className="flex-1 p-6 pt-16 pb-32 overflow-y-auto scrollbar-thin rounded-t-2xl"
      >
        {activeMessages.length > 0 ? (
          <div className="max-w-3xl mx-auto w-full">
            {activeMessages.map((message, index) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                isLast={index === activeMessages.length - 1} 
              />
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M12 8V4H8" />
                <rect width="16" height="12" x="4" y="8" rx="2" />
                <path d="M2 14h2" />
                <path d="M20 14h2" />
                <path d="M15 13v2" />
                <path d="M9 13v2" />
              </svg>
            </div>
            <p className="text-xl font-medium text-foreground">Start a Conversation</p>
            <p className="text-muted-foreground text-center mt-2 max-w-sm">
              Send a message to begin chatting with the AI assistant.
            </p>
          </div>
        )}
      </div>
      
      {/* Floating scroll navigation buttons */}
      {showScrollButtons && activeMessages.length > 0 && (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-40">
          <button 
            onClick={scrollToTop}
            className="h-10 w-10 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-md flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
          <button 
            onClick={scrollToBottom}
            className="h-10 w-10 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-md flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="h-5 w-5" />
          </button>
        </div>
      )}
      
      {/* Floating quick responses */}
      {activeMessages.length > 0 && (
        <div className="fixed bottom-24 left-0 right-0 z-40 px-4 mx-auto max-w-3xl">
          <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-border/30 rounded-xl shadow-md">
            <QuickResponses />
          </div>
        </div>
      )}
      
      {/* Floating chat input */}
      <div className="fixed bottom-6 left-0 right-0 z-40 px-4 mx-auto max-w-3xl">
        <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-border/30 rounded-xl shadow-md">
          <ChatInput />
        </div>
      </div>
    </div>
  );
};
