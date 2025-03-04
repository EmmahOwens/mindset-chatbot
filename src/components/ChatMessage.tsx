
import { Message } from '@/context/ChatContext';
import { useEffect, useRef } from 'react';

type ChatMessageProps = {
  message: Message;
  isLast: boolean;
};

export const ChatMessage = ({ message, isLast }: ChatMessageProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Scroll to the message if it's the last one
  useEffect(() => {
    if (isLast && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isLast]);
  
  const isBot = message.sender === 'bot';
  
  return (
    <div 
      ref={ref}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4 animate-fade-in`}
    >
      <div 
        className={`${isBot ? 'chat-bubble-bot animate-slide-in-left' : 'chat-bubble-user animate-slide-in-right'}`}
      >
        <p>{message.content}</p>
      </div>
    </div>
  );
};
