
import { useChat } from '@/context/ChatContext';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { QuickResponses } from './QuickResponses';
import { useEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowDown, ChevronsUp, ChevronsDown } from 'lucide-react';
import { Button } from './ui/button';

export const ChatInterface = () => {
  const { activeMessages, activeChat } = useChat();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  
  // Scroll to bottom on new messages if we're already at the bottom
  useEffect(() => {
    if (chatContainerRef.current && isScrolledToBottom) {
      scrollToBottom();
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
    
    const handleScroll = () => {
      if (chatContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        // Consider "at bottom" when within 100px of the bottom
        const atBottom = scrollHeight - scrollTop - clientHeight < 100;
        setIsScrolledToBottom(atBottom);
      }
    };
    
    const chatContainer = chatContainerRef.current;
    checkScrollable();
    
    // Add scroll event listener
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
    }
    
    window.addEventListener('resize', checkScrollable);
    
    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener('scroll', handleScroll);
      }
      window.addEventListener('resize', checkScrollable);
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
      setIsScrolledToBottom(true);
    }
  };
  
  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-b from-background to-background/80 rounded-2xl relative">
      <div 
        ref={chatContainerRef}
        className="flex-1 p-6 pt-16 pb-32 overflow-y-auto scrollbar-none rounded-t-2xl"
      >
        {activeMessages.length > 0 ? (
          <div className="max-w-3xl mx-auto w-full pl-0 sm:pl-4">
            {activeMessages.map((message, index) => (
              <div key={message.id}>
                <ChatMessage 
                  message={message} 
                  isLast={index === activeMessages.length - 1} 
                />
                {/* Place suggestions right after bot messages */}
                {message.sender === 'bot' && index === activeMessages.length - 1 && (
                  <div className="pl-2 mb-6">
                    <QuickResponses />
                  </div>
                )}
              </div>
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
      
      {/* Enhanced navigation buttons */}
      {showScrollButtons && activeMessages.length > 0 && (
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-3 z-40">
          <Button
            onClick={scrollToTop}
            size="icon"
            variant="secondary"
            className="h-10 w-10 rounded-full shadow-md hover:bg-primary hover:text-white transition-all duration-300"
            aria-label="Scroll to first message"
          >
            <ChevronsUp className="h-5 w-5" />
          </Button>
          <Button
            onClick={scrollToBottom}
            size="icon"
            variant="secondary"
            className={`h-10 w-10 rounded-full shadow-md transition-all duration-300 ${
              !isScrolledToBottom ? 'animate-bounce-subtle bg-primary/90 text-white' : ''
            }`}
            aria-label="Scroll to latest message"
          >
            <ChevronsDown className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      {/* Floating chat input with no background */}
      <div className="fixed bottom-6 left-0 right-0 z-40 px-4 mx-auto max-w-3xl">
        <ChatInput />
      </div>
    </div>
  );
};
