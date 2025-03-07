
import { useState } from 'react';
import { useChat } from '@/context/ChatContext';
import { Send } from 'lucide-react';

export const ChatInput = () => {
  const [message, setMessage] = useState('');
  const { addMessage } = useChat();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() === '') return;
    
    addMessage({
      content: message,
      sender: 'user',
    });
    
    setMessage('');
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // Reset the height first to get the correct scrollHeight
    e.target.style.height = 'auto';
    // Set the height based on the content, with a max height
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-5 border-t border-border backdrop-blur-sm bg-background/80">
      <div className="flex items-center gap-3 max-w-3xl mx-auto">
        <div className="relative flex-1 neumorph-flat p-2 rounded-xl">
          <textarea
            value={message}
            onChange={handleChange}
            placeholder="Type your message..."
            rows={1}
            className="w-full py-3 px-4 bg-transparent focus:outline-none placeholder:text-muted-foreground rounded-xl resize-none overflow-hidden"
            style={{ minHeight: '48px', maxHeight: '150px' }}
          />
        </div>
        <button
          type="submit"
          disabled={message.trim() === ''}
          className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-md"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};
