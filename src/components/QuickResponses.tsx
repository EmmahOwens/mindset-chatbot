
import { useChat } from '@/context/ChatContext';
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const QuickResponses = () => {
  const { addMessage, activeMessages } = useChat();
  const { toast } = useToast();
  const [responses, setResponses] = useState<string[]>([
    "I've been feeling overwhelmed lately",
    "Something happened at work today",
    "My sleep has been affected",
    "I'm trying to practice self-care"
  ]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke('chat-suggestions', {
          body: { messages: activeMessages }
        });
        
        if (error) throw error;
        
        if (data.suggestions) {
          setResponses(data.suggestions);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        // Don't show the error toast to avoid overwhelming the user
      } finally {
        setLoading(false);
      }
    };

    // Fetch new suggestions when messages change
    if (activeMessages.length > 0) {
      fetchSuggestions();
    }
  }, [activeMessages]);
  
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
          disabled={loading}
        >
          {response}
        </button>
      ))}
    </div>
  );
};
