
import { Plus, MessageSquare, ArchiveX, Trash2, Menu } from 'lucide-react';
import { useState } from 'react';
import { useChat, Chat } from '@/context/ChatContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

export const Sidebar = () => {
  const { chats, activeChat, createChat, setActiveChat, deleteChat, archiveChat } = useChat();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const activeChats = chats.filter(chat => !chat.archived);
  
  const handleNewChat = () => {
    createChat();
    toast.success('New chat created');
  };
  
  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteChat(id);
    toast.success('Chat deleted');
  };
  
  const handleArchiveChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    archiveChat(id);
    toast.success('Chat archived');
  };
  
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `in about ${diffInHours} hours`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  return (
    <aside className={`h-screen ${isCollapsed ? 'w-16' : 'w-72'} border-r border-border transition-all duration-300 flex flex-col bg-sidebar`}>
      <div className="p-4 flex items-center justify-between border-b border-border">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-10 w-10 neumorph-flat flex items-center justify-center rounded-full"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        {!isCollapsed && (
          <button
            onClick={handleNewChat}
            className="flex items-center justify-center gap-2 p-2 px-4 neumorph-flat hover:neumorph-pressed transition-all duration-300 rounded-full text-sidebar-primary"
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">New Chat</span>
          </button>
        )}
        
        {isCollapsed && (
          <button
            onClick={handleNewChat}
            className="h-10 w-10 neumorph-flat flex items-center justify-center rounded-full text-sidebar-primary"
            title="New Chat"
          >
            <Plus className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-3">
        {!isCollapsed && activeChats.length > 0 && (
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-3 ml-2">Active Chats</h2>
        )}
        
        <div className="space-y-2">
          {activeChats.map(chat => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`cursor-pointer transition-all duration-200 ${
                activeChat === chat.id 
                  ? 'neumorph-pressed text-primary'
                  : 'neumorph-flat hover:scale-[0.98] text-sidebar-foreground'
              } ${isCollapsed ? 'p-2 rounded-full' : 'p-3 rounded-xl'}`}
            >
              {isCollapsed ? (
                <div className="flex justify-center">
                  <MessageSquare className="h-5 w-5" />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 flex-shrink-0" />
                    <div className="overflow-hidden">
                      <p className="truncate font-medium">{chat.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(chat.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none" onClick={(e) => e.stopPropagation()}>
                      <div className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-sidebar-accent">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="19" cy="12" r="1" />
                          <circle cx="5" cy="12" r="1" />
                        </svg>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => handleArchiveChat(chat.id, e as unknown as React.MouseEvent)}>
                        <ArchiveX className="h-4 w-4 mr-2" />
                        Archive Chat
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive" 
                        onClick={(e) => handleDeleteChat(chat.id, e as unknown as React.MouseEvent)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Chat
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
