import { useChat } from '@/context/ChatContext';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { QuickResponses } from './QuickResponses';
import { useEffect, useRef, useState } from 'react';
import { ChevronsUp, ChevronsDown } from 'lucide-react';
import { Button } from './ui/button';
import { isScrolledToBottom, isScrolledToTop, scrollToBottom } from '@/lib/utils';

export const ChatInterface = () => {
  const { activeMessages, activeChat } = useChat();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  
  // Scroll to bottom on new messages if we're already at the bottom or when a bot message is added
  useEffect(() => {
    if (chatContainerRef.current) {
      // Auto-scroll to bottom when a new bot message is added
      if (activeMessages.length > 0 && activeMessages[activeMessages.length - 1].sender === 'bot') {
        scrollToBottom(chatContainerRef);
        setIsAtBottom(true);
      } 
      // Otherwise, only scroll if we were already at the bottom
      else if (isAtBottom) {
        scrollToBottom(chatContainerRef);
      }
    }
  }, [activeMessages, isAtBottom]);
  
  // Show scroll buttons when chat is scrollable and track scroll position
  useEffect(() => {
    const checkScrollable = () => {
      if (chatContainerRef.current) {
        const { scrollHeight, clientHeight } = chatContainerRef.current;
        setShowScrollButtons(scrollHeight > clientHeight + 50); // Only show if there's significant scroll
      }
    };
    
    const handleScroll = () => {
      if (chatContainerRef.current) {
        setIsAtBottom(isScrolledToBottom(chatContainerRef, 100));
        setIsAtTop(isScrolledToTop(chatContainerRef, 20));
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
      window.removeEventListener('resize', checkScrollable);
    };
  }, [activeMessages]);
  
  const scrollToTopHandler = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };
  
  const scrollToBottomHandler = () => {
    if (chatContainerRef.current) {
      scrollToBottom(chatContainerRef);
      setIsAtBottom(true);
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
      
      {/* Navigation buttons */}
      {showScrollButtons && activeMessages.length > 0 && (
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-3 z-40">
          <Button
            onClick={scrollToTopHandler}
            size="icon"
            variant="secondary"
            className={`h-10 w-10 rounded-full shadow-md transition-all duration-300 ${
              !isAtTop ? 'hover:bg-primary hover:text-white' : 'opacity-50'
            }`}
            disabled={isAtTop}
            aria-label="Scroll to first message"
          >
            <ChevronsUp className="h-5 w-5" />
          </Button>
          <Button
            onClick={scrollToBottomHandler}
            size="icon"
            variant="secondary"
            className={`h-10 w-10 rounded-full shadow-md transition-all duration-300 ${
              !isAtBottom ? 'animate-bounce-subtle bg-primary/90 text-white' : 'opacity-50'
            }`}
            disabled={isAtBottom}
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
