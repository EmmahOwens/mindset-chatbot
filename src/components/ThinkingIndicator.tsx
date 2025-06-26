
export const ThinkingIndicator = () => {
  return (
    <div className="flex justify-start mb-6 animate-fade-in">
      <div className="chat-bubble-bot shadow-md md:ml-16 md:mr-8 max-w-[80%] sm:max-w-[75%] md:max-w-[70%] rounded-2xl">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-muted-foreground text-sm">Thinking...</span>
        </div>
      </div>
    </div>
  );
};
