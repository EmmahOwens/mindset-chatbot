
import { useChat, Chat } from '@/context/ChatContext';
import { useState } from 'react';
import { 
  Plus, MessageSquare, 
  Trash2, ChevronDown, ChevronRight,
  Archive, ArchiveX, Sparkles, ChevronLeft
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onToggle: () => void;
}

export const Sidebar = ({ onToggle }: SidebarProps) => {
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
  
  const toggleCollapsed = () => {
    if (isCollapsed) {
      // If already collapsed, close the sidebar completely
      onToggle();
    } else {
      // If expanded, collapse it
      setIsCollapsed(true);
    }
  };
  
  return (
    <aside className={cn(
      "h-screen transition-all duration-300 ease-in-out flex flex-col",
      "bg-white dark:bg-gray-800 border-r border-border/30",
      isCollapsed ? "w-16" : "w-72"
    )}>
      <div className="flex justify-between items-center p-4 border-b border-border/20">
        {!isCollapsed ? (
          <Button
            onClick={handleNewChat}
            className="flex-1 gap-2 bg-teal-500 hover:bg-teal-600 text-white shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span className="font-medium">New Chat</span>
          </Button>
        ) : (
          <Button
            onClick={handleNewChat}
            className="h-10 w-10 p-0 rounded-full bg-teal-500 hover:bg-teal-600 text-white shadow-md mx-auto"
            title="New Chat"
          >
            <Plus className="h-5 w-5" />
          </Button>
        )}
        
        {!isCollapsed && (
          <button 
            onClick={toggleCollapsed}
            className="ml-2 h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        
        {isCollapsed && (
          <button 
            onClick={toggleCollapsed}
            className="mt-4 h-8 w-8 rounded-full flex items-center justify-center mx-auto hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            aria-label="Close sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin p-3">
        {!isCollapsed && activeChats.length > 0 && (
          <div className="flex items-center text-xs uppercase tracking-wider text-gray-500 dark:text-white/70 font-semibold mb-3 ml-2">
            <Sparkles className="h-3 w-3 mr-1" />
            <span>Active Chats</span>
          </div>
        )}
        
        <div className={cn("space-y-2", isCollapsed && "flex flex-col items-center")}>
          {activeChats.map(chat => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={cn(
                "cursor-pointer transition-all duration-200 border",
                activeChat === chat.id 
                  ? "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-white/30 text-gray-900 dark:text-white shadow-sm"
                  : "bg-white/80 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white shadow-sm border-transparent",
                isCollapsed ? "p-2 rounded-full w-12 h-12 flex items-center justify-center" : "p-3 rounded-xl"
              )}
            >
              {isCollapsed ? (
                <div className={cn(
                  "flex justify-center items-center rounded-full",
                  activeChat === chat.id ? "text-teal-500" : "text-gray-500 dark:text-white/70"
                )}>
                  <MessageSquare className="h-5 w-5" />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center",
                      activeChat === chat.id 
                        ? "bg-teal-100 dark:bg-teal-800/30 text-teal-600 dark:text-teal-400" 
                        : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/70"
                    )}>
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="truncate font-medium">{chat.title}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-white/20 text-gray-700 dark:text-white rounded-full mr-2">
                      {getMessageCount(chat)}
                    </span>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger className="focus:outline-none" onClick={(e) => e.stopPropagation()}>
                        <div className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10">
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
              className="flex items-center w-full text-xs uppercase tracking-wider text-gray-500 dark:text-white/60 mb-3 ml-2 font-semibold"
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
                    className={cn(
                      "cursor-pointer transition-all duration-200 border p-3 rounded-xl",
                      activeChat === chat.id 
                        ? "bg-white/20 dark:bg-gray-700 border-white/30 text-white shadow-sm"
                        : "bg-white/10 dark:bg-gray-800/80 hover:bg-white/20 dark:hover:bg-gray-700 text-white shadow-sm border-transparent"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center",
                          activeChat === chat.id ? "bg-amber-100/20 text-amber-400" : "bg-white/10 text-white/70"
                        )}>
                          <Archive className="h-4 w-4" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="truncate font-medium">{chat.title}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-xs px-2 py-1 bg-white/20 text-white rounded-full mr-2">
                          {getMessageCount(chat)}
                        </span>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger className="focus:outline-none" onClick={(e) => e.stopPropagation()}>
                            <div className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/10">
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
      
      {!isCollapsed && (
        <div className="p-3 border-t border-border/20 mt-auto">
          <div className="text-xs text-gray-500 dark:text-white/50 text-center">
            <p>Your mental health companion</p>
          </div>
        </div>
      )}
    </aside>
  );
};
