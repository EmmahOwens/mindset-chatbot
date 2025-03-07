
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
  
  return (
    <form onSubmit={handleSubmit} className="p-5 border-t border-border backdrop-blur-sm bg-background/80">
      <div className="flex items-center gap-3 max-w-3xl mx-auto">
        <div className="relative flex-1 neumorph-flat p-2 rounded-xl">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full p-3 bg-transparent focus:outline-none placeholder:text-muted-foreground rounded-xl"
          />
        </div>
        <button
          type="submit"
          disabled={message.trim() === ''}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-md"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};
