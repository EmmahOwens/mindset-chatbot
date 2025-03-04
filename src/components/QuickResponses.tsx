
import { useChat } from '@/context/ChatContext';
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const QuickResponses = () => {
  const { addMessage } = useChat();
  const [responses, setResponses] = useState<string[]>([
    "I've been feeling overwhelmed lately",
    "Something happened at work today",
    "My sleep has been affected",
    "I'm trying to practice self-care"
  ]);
  
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('chat-suggestions');
        if (error) throw error;
        if (data.suggestions) {
          setResponses(data.suggestions);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    fetchSuggestions();
  }, []);
  
  const handleQuickResponse = (response: string) => {
    addMessage({
      content: response,
      sender: 'user',
    });
  };
  
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8 mt-2">
      {responses.map((response, index) => (
        <button
          key={index}
          onClick={() => handleQuickResponse(response)}
          className="quick-response-btn animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {response}
        </button>
      ))}
    </div>
  );
};
