
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
  MessageSquare,
  Archive,
  X,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SettingsDialog } from './SettingsDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const { chats, createChat, setActiveChat, activeChat, deleteChat, archiveChat, unarchiveChat } = useChat();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isArchiveVisible, setIsArchiveVisible] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
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
  
  // Close sidebar completely
  const closeSidebar = () => {
    onToggle(); // Call the parent toggle function
  };
  
  // Toggle collapse state of sidebar
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const handleArchiveChat = (chatId: string) => {
    archiveChat(chatId);
    toast({
      description: 'Chat archived successfully',
    });
  };
  
  const handleUnarchiveChat = (chatId: string) => {
    unarchiveChat(chatId);
    toast({
      description: 'Chat restored from archive',
    });
  };
  
  const handleDeleteChat = () => {
    if (chatToDelete) {
      deleteChat(chatToDelete);
      setChatToDelete(null);
      toast({
        description: 'Chat deleted successfully',
        variant: 'destructive',
      });
    }
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
        
        <div className="flex items-center gap-1 ml-auto">
          {!isMobile && (
            <button 
              onClick={toggleCollapse}
              className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          )}
          
          <button 
            onClick={closeSidebar}
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-none">
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
              <li key={chat.id} className="relative">
                <DropdownMenu>
                  <div className="flex items-center">
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
                    
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="absolute right-0 h-8 w-8 opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100 hover:bg-secondary/50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical">
                          <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                  </div>
                  
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>{chat.title}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleArchiveChat(chat.id)} className="cursor-pointer">
                      <Archive className="h-4 w-4 mr-2" />
                      Archive Chat
                    </DropdownMenuItem>
                    <AlertDialog open={chatToDelete === chat.id} onOpenChange={(open) => !open && setChatToDelete(null)}>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem 
                          onClick={() => setChatToDelete(chat.id)} 
                          className="cursor-pointer text-destructive"
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Chat
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the chat and all its messages.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteChat} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                <li key={chat.id} className="relative">
                  <DropdownMenu>
                    <div className="flex items-center">
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
                      
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="absolute right-0 h-8 w-8 opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100 hover:bg-secondary/50">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical">
                            <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                    </div>
                    
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>{chat.title}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleUnarchiveChat(chat.id)} className="cursor-pointer">
                        <ArrowUpRightFromCircle className="h-4 w-4 mr-2" />
                        Restore Chat
                      </DropdownMenuItem>
                      <AlertDialog open={chatToDelete === chat.id} onOpenChange={(open) => !open && setChatToDelete(null)}>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem 
                            onClick={() => setChatToDelete(chat.id)} 
                            className="cursor-pointer text-destructive"
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Chat
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the chat and all its messages.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteChat} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </motion.aside>
  );
};
