
import { Message } from '@/context/ChatContext';
import { useEffect, useRef } from 'react';
import { scrollToBottom } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
  isLast: boolean;
}

export const ChatMessage = ({ message, isLast }: ChatMessageProps) => {
  const messageRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to newly generated bot message
  useEffect(() => {
    if (isLast && message.sender === 'bot') {
      const parentElement = messageRef.current?.parentElement?.parentElement?.parentElement;
      if (parentElement) {
        setTimeout(() => {
          parentElement.scrollTop = parentElement.scrollHeight;
        }, 100);
      }
    }
  }, [isLast, message.sender]);
  
  return (
    <div 
      ref={messageRef}
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-6 animate-fade-in`}
    >
      <div className={`
        ${message.sender === 'bot' 
          ? 'chat-bubble-bot shadow-md md:ml-16 md:mr-8' 
          : 'chat-bubble-user shadow-md'}
        ${isLast && message.sender === 'bot' ? 'typing-indicator' : ''}
        max-w-[80%] sm:max-w-[75%] md:max-w-[70%] rounded-2xl
      `}>
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};
