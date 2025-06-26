
import { Message } from '@/context/ChatContext';
import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

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
        {message.sender === 'bot' ? (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown 
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                code: ({ children }) => <code className="bg-muted px-1 py-0.5 rounded text-sm">{children}</code>,
                pre: ({ children }) => <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">{children}</pre>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}
      </div>
    </div>
  );
};
