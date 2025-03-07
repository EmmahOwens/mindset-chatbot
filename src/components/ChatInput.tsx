
import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import { Send, ChevronUp } from 'lucide-react';

export const ChatInput = () => {
  const [message, setMessage] = useState('');
  const { addMessage } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() === '') return;
    
    addMessage({
      content: message,
      sender: 'user',
    });
    
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = '48px';
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    adjustTextareaHeight(e.target);
  };
  
  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    // Reset the height first to get the correct scrollHeight
    textarea.style.height = '48px';
    // Set the height based on the content, with a max height
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  };
  
  useEffect(() => {
    if (textareaRef.current) {
      adjustTextareaHeight(textareaRef.current);
    }
  }, [message]);
  
  return (
    <form onSubmit={handleSubmit} className="p-5 border-t border-border backdrop-blur-sm bg-background/80">
      <div className="flex items-center gap-3 max-w-3xl mx-auto">
        <div className="relative flex-1 rounded-2xl overflow-hidden border border-border/50 shadow-sm bg-white/10 dark:bg-gray-900/30 backdrop-blur-sm">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            placeholder="Type your message..."
            rows={1}
            className="w-full py-3 px-4 bg-transparent focus:outline-none placeholder:text-muted-foreground resize-none overflow-hidden"
            style={{ minHeight: '48px', maxHeight: '150px' }}
          />
        </div>
        <button
          type="submit"
          disabled={message.trim() === ''}
          className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-md"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};
