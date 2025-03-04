
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
    <form onSubmit={handleSubmit} className="p-4 border-t border-border">
      <div className="relative neumorph-flat p-1 rounded-full">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full p-3 pr-12 bg-transparent focus:outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          disabled={message.trim() === ''}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};
