
import { useChat } from '@/context/ChatContext';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { QuickResponses } from './QuickResponses';
import { useEffect, useRef } from 'react';

export const ChatInterface = () => {
  const { activeMessages, activeChat } = useChat();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [activeMessages]);
  
  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-b from-background to-background/80">
      <div 
        ref={chatContainerRef}
        className="flex-1 p-6 overflow-y-auto scrollbar-thin"
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
      
      {/* Show quick responses when there's at least one message */}
      {activeMessages.length > 0 && (
        <div className="px-4 backdrop-blur-sm bg-background/70 border-t border-border">
          <QuickResponses />
        </div>
      )}
      
      <ChatInput />
    </div>
  );
};
