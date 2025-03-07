
import { Message } from '@/context/ChatContext';
import { useEffect, useState } from 'react';

interface ChatMessageProps {
  message: Message;
  isLast: boolean;
}

export const ChatMessage = ({ message, isLast }: ChatMessageProps) => {
  const [showTimestamps, setShowTimestamps] = useState(true);
  
  useEffect(() => {
    const settings = localStorage.getItem('chatSettings');
    if (settings) {
      const parsedSettings = JSON.parse(settings);
      setShowTimestamps(parsedSettings.showTimestamps ?? true);
    }
  }, []);
  
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div 
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-6 animate-fade-in`}
    >
      {message.sender === 'bot' && (
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2 self-end mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
          </svg>
        </div>
      )}
      
      <div className={`
        ${message.sender === 'bot' 
          ? 'chat-bubble-bot shadow-md' 
          : 'chat-bubble-user shadow-md'}
        ${isLast && message.sender === 'bot' ? 'typing-indicator' : ''}
        max-w-[75%] sm:max-w-[70%] md:max-w-[65%] rounded-2xl
      `}>
        <p className="whitespace-pre-wrap">{message.content}</p>
        {showTimestamps && (
          <div className={`text-xs mt-2 opacity-70 flex justify-end ${message.sender === 'user' ? 'text-white/70' : 'text-foreground/70'}`}>
            {formatTime(message.timestamp)}
          </div>
        )}
      </div>
      
      {message.sender === 'user' && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-2 self-end mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      )}
    </div>
  );
};
