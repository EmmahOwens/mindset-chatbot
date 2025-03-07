
import { useChat, Chat } from '@/context/ChatContext';
import { useState } from 'react';
import { 
  Plus, MessageSquare, Settings, 
  Trash2, ChevronDown, ChevronRight, 
  Archive, ArchiveX, Sparkles
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

export const Sidebar = () => {
  const { chats, activeChat, createChat, setActiveChat, deleteChat, archiveChat, unarchiveChat } = useChat();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  
  const activeChats = chats.filter(chat => !chat.archived);
  const archivedChats = chats.filter(chat => chat.archived);
  
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
  
  const handleUnarchiveChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    unarchiveChat(id);
    toast.success('Chat unarchived');
  };
  
  const getMessageCount = (chat: Chat) => {
    return chat.messages.length;
  };
  
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  };
  
  return (
    <aside className={`h-screen fixed z-30 ${isCollapsed ? 'w-16' : 'w-72'} transition-all duration-300 flex flex-col bg-gradient-to-b from-primary/5 to-background`}>
      <div className="p-4 flex items-center justify-between border-b border-border/40">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-10 w-10 rounded-full bg-white/90 dark:bg-gray-800/90 flex items-center justify-center shadow-md hover:bg-primary/10 transition-all duration-200"
        >
          <Settings className="h-5 w-5 text-primary" />
        </button>
        
        {!isCollapsed && (
          <button
            onClick={handleNewChat}
            className="flex items-center justify-center gap-2 py-2 px-4 bg-primary/90 hover:bg-primary transition-all duration-300 rounded-full text-white shadow-md"
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">New Chat</span>
          </button>
        )}
        
        {isCollapsed && (
          <button
            onClick={handleNewChat}
            className="h-10 w-10 bg-primary/90 hover:bg-primary flex items-center justify-center rounded-full text-white shadow-md transition-all duration-200"
            title="New Chat"
          >
            <Plus className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
        {!isCollapsed && activeChats.length > 0 && (
          <h2 className="text-xs uppercase tracking-wider text-primary font-semibold mb-3 ml-2 flex items-center">
            <Sparkles className="h-3 w-3 mr-1" />
            Active Chats
          </h2>
        )}
        
        <div className="space-y-2">
          {activeChats.map(chat => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`cursor-pointer transition-all duration-200 ${
                activeChat === chat.id 
                  ? 'bg-primary/15 border-primary/30 text-primary shadow-sm'
                  : 'bg-white/60 dark:bg-gray-800/30 hover:bg-white/80 dark:hover:bg-gray-800/40 text-foreground shadow-sm border-transparent'
              } ${isCollapsed ? 'p-2 rounded-full' : 'p-3 rounded-xl'} border`}
            >
              {isCollapsed ? (
                <div className="flex justify-center">
                  <MessageSquare className="h-5 w-5" />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      activeChat === chat.id ? 'bg-primary/20' : 'bg-primary/10'
                    }`}>
                      <MessageSquare className={`h-4 w-4 ${activeChat === chat.id ? 'text-primary' : 'text-primary/70'}`} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="truncate font-medium">{chat.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(chat.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full mr-2">
                      {getMessageCount(chat)}
                    </span>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger className="focus:outline-none" onClick={(e) => e.stopPropagation()}>
                        <div className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-primary/10">
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
                </div>
              )}
            </div>
          ))}
        </div>
        
        {!isCollapsed && archivedChats.length > 0 && (
          <div className="mt-6">
            <button 
              onClick={() => setShowArchived(!showArchived)}
              className="flex items-center w-full text-xs uppercase tracking-wider text-muted-foreground mb-3 ml-2 font-semibold"
            >
              {showArchived ? <ChevronDown className="h-3 w-3 mr-1" /> : <ChevronRight className="h-3 w-3 mr-1" />}
              Archived Chats ({archivedChats.length})
            </button>
            
            {showArchived && (
              <div className="space-y-2">
                {archivedChats.map(chat => (
                  <div
                    key={chat.id}
                    onClick={() => setActiveChat(chat.id)}
                    className={`cursor-pointer transition-all duration-200 ${
                      activeChat === chat.id 
                        ? 'bg-primary/15 border-primary/30 text-primary shadow-sm'
                        : 'bg-white/60 dark:bg-gray-800/30 hover:bg-white/80 dark:hover:bg-gray-800/40 text-foreground shadow-sm border-transparent'
                    } p-3 rounded-xl border`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          activeChat === chat.id ? 'bg-primary/20' : 'bg-primary/10'
                        }`}>
                          <Archive className={`h-4 w-4 ${activeChat === chat.id ? 'text-primary' : 'text-primary/70'}`} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="truncate font-medium">{chat.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatTimestamp(chat.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full mr-2">
                          {getMessageCount(chat)}
                        </span>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger className="focus:outline-none" onClick={(e) => e.stopPropagation()}>
                            <div className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-primary/10">
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="19" cy="12" r="1" />
                                <circle cx="5" cy="12" r="1" />
                              </svg>
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => handleUnarchiveChat(chat.id, e as unknown as React.MouseEvent)}>
                              <Archive className="h-4 w-4 mr-2" />
                              Unarchive Chat
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
