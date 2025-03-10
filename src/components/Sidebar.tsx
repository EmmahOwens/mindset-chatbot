import { useChat, Chat } from '@/context/ChatContext';
import { useState } from 'react';
import { 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  FileEdit, 
  Inbox, 
  Plus, 
  Settings, 
  Trash2, 
  ArrowUpRightFromCircle,
  MessagesSquare, 
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SettingsDialog } from './SettingsDialog';
import { useMobile } from '@/hooks/use-mobile';

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const { chats, createChat, setActiveChat, activeChat, deleteChat, archiveChat, unarchiveChat } = useChat();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isArchiveVisible, setIsArchiveVisible] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useMobile();
  
  const activeChats = chats.filter(chat => !chat.archived);
  const archivedChats = chats.filter(chat => chat.archived);
  
  const handleCreateChat = () => {
    createChat();
    toast({
      description: 'New chat created',
    });
  };
  
  const toggleArchive = () => {
    setIsArchiveVisible(!isArchiveVisible);
  };
  
  const getMessageCount = (chat: Chat) => {
    return chat.messages.length;
  };
  
  const toggleSidebar = () => {
    onToggle();
  };
  
  return (
    <motion.aside
      className={cn(
        "fixed left-0 top-0 bottom-0 z-50 h-full bg-white dark:bg-gray-900",
        isCollapsed ? "w-[60px]" : "w-[280px]",
        "flex flex-col border-r border-border shadow-sm transition-all duration-300"
      )}
      initial={{ x: "-100%" }}
      animate={{ x: isOpen ? 0 : "-100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <h2 className="font-bold text-lg text-foreground flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span>Chats</span>
          </h2>
        )}
        
        {isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 mx-auto"
            onClick={handleCreateChat}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
        
        {!isCollapsed ? (
          <button 
            onClick={toggleSidebar}
            className="ml-2 h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            aria-label="Close sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        ) : (
          <button 
            onClick={toggleSidebar}
            className="mt-4 h-8 w-8 rounded-full flex items-center justify-center mx-auto hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            aria-label="Close sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-2">
          <Button variant="ghost" className="w-full justify-start rounded-md p-2 hover:bg-secondary/50 dark:hover:bg-secondary/50" onClick={handleCreateChat}>
            <Plus className="h-4 w-4 mr-2" />
            {!isCollapsed && <span>New Chat</span>}
          </Button>
        </div>
        
        <div className="p-2">
          <h3 className="text-sm font-medium text-muted-foreground px-2">
            {!isCollapsed && <span>Recent</span>}
            {isCollapsed && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-center">
                      <MessagesSquare className="h-4 w-4" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Recent</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </h3>
          <ul>
            {activeChats.map((chat) => (
              <li key={chat.id}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start rounded-md p-2 hover:bg-secondary/50 dark:hover:bg-secondary/50",
                    activeChat === chat.id ? "bg-secondary/50 dark:bg-secondary/50" : ""
                  )}
                  onClick={() => setActiveChat(chat.id)}
                >
                  {!isCollapsed && (
                    <>
                      {chat.title}
                      {getMessageCount(chat) > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {getMessageCount(chat)}
                        </Badge>
                      )}
                    </>
                  )}
                  {isCollapsed && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center justify-center">
                            <MessageSquare className="h-4 w-4" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{chat.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </Button>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-2">
          <h3 className="text-sm font-medium text-muted-foreground px-2 flex items-center justify-between">
            <div className="flex items-center">
              {!isCollapsed && <span>Archive</span>}
              {isCollapsed && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-center">
                        <Inbox className="h-4 w-4" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Archive</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            {!isCollapsed && (
              <button onClick={toggleArchive} className="hover:underline text-xs">
                {isArchiveVisible ? "Hide" : "Show"}
              </button>
            )}
          </h3>
          {isArchiveVisible && (
            <ul>
              {archivedChats.map((chat) => (
                <li key={chat.id}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start rounded-md p-2 hover:bg-secondary/50 dark:hover:bg-secondary/50",
                      activeChat === chat.id ? "bg-secondary/50 dark:bg-secondary/50" : ""
                    )}
                    onClick={() => setActiveChat(chat.id)}
                  >
                    {!isCollapsed && (
                      <>
                        {chat.title}
                        {getMessageCount(chat) > 0 && (
                          <Badge variant="secondary" className="ml-auto">
                            {getMessageCount(chat)}
                          </Badge>
                        )}
                      </>
                    )}
                    {isCollapsed && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center">
                              <MessageSquare className="h-4 w-4" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{chat.title}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <div className="p-4 border-t border-border">
        <ul>
          <li>
            <Button variant="ghost" className="w-full justify-start rounded-md p-2 hover:bg-secondary/50 dark:hover:bg-secondary/50" onClick={() => setIsSettingsOpen(true)}>
              <Settings className="h-4 w-4 mr-2" />
              {!isCollapsed && <span>Settings</span>}
            </Button>
          </li>
          <li>
            <ThemeToggle isCollapsed={isCollapsed} />
          </li>
        </ul>
      </div>
      
      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </motion.aside>
  );
};
