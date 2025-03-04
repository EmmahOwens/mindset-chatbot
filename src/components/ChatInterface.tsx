
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
    <div className="flex-1 flex flex-col h-full">
      <div 
        ref={chatContainerRef}
        className="flex-1 p-4 overflow-y-auto"
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
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              No messages yet. Start a conversation!
            </p>
          </div>
        )}
      </div>
      
      {/* Show quick responses when there's at least one bot message */}
      {activeMessages.some(msg => msg.sender === 'bot') && activeMessages.length <= 2 && (
        <div className="px-4">
          <QuickResponses />
        </div>
      )}
      
      <ChatInput />
    </div>
  );
};
