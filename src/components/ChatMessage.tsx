
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
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}
    >
      <div className={`
        ${message.sender === 'bot' ? 'chat-bubble-bot' : 'chat-bubble-user'}
        ${isLast && message.sender === 'bot' ? 'animate-pulse-slow' : ''}
      `}>
        <p>{message.content}</p>
        {showTimestamps && (
          <div className={`text-xs mt-1 opacity-70 flex justify-end ${message.sender === 'user' ? 'text-white/70' : 'text-foreground/70'}`}>
            {formatTime(message.timestamp)}
          </div>
        )}
      </div>
    </div>
  );
};
