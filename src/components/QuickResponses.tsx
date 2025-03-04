
import { useChat } from '@/context/ChatContext';

const responses = [
  "I've been feeling overwhelmed lately",
  "Something happened at work today",
  "My sleep has been affected",
  "I'm trying to practice self-care"
];

export const QuickResponses = () => {
  const { addMessage } = useChat();
  
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
