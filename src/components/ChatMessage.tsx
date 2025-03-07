
import { Message } from '@/context/ChatContext';

interface ChatMessageProps {
  message: Message;
  isLast: boolean;
}

export const ChatMessage = ({ message, isLast }: ChatMessageProps) => {
  return (
    <div 
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-6 animate-fade-in`}
    >
      <div className={`
        ${message.sender === 'bot' 
          ? 'chat-bubble-bot shadow-md' 
          : 'chat-bubble-user shadow-md'}
        ${isLast && message.sender === 'bot' ? 'typing-indicator' : ''}
        max-w-[80%] sm:max-w-[75%] md:max-w-[70%] rounded-2xl
      `}>
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};
