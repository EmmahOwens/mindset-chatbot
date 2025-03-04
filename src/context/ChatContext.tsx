
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

export type Message = {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: number;
};

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  archived: boolean;
};

type ChatState = {
  chats: Chat[];
  activeChat: string | null;
};

type ChatAction =
  | { type: 'CREATE_CHAT'; payload: { id: string } }
  | { type: 'SET_ACTIVE_CHAT'; payload: { chatId: string } }
  | { type: 'ADD_MESSAGE'; payload: { chatId: string; message: Message } }
  | { type: 'DELETE_CHAT'; payload: { chatId: string } }
  | { type: 'ARCHIVE_CHAT'; payload: { chatId: string } }
  | { type: 'UNARCHIVE_CHAT'; payload: { chatId: string } }
  | { type: 'LOAD_CHATS'; payload: { chats: Chat[] } };

type ChatContextType = {
  chats: Chat[];
  activeChat: string | null;
  activeMessages: Message[];
  createChat: () => string;
  setActiveChat: (chatId: string) => void;
  addMessage: (message: Pick<Message, 'content' | 'sender'>) => void;
  deleteChat: (chatId: string) => void;
  archiveChat: (chatId: string) => void;
  unarchiveChat: (chatId: string) => void;
};

type ChatSettings = {
  showTimestamps: boolean;
  friendlyTone: boolean;
  responseLength: number;
};

const defaultSettings: ChatSettings = {
  showTimestamps: true,
  friendlyTone: true,
  responseLength: 400,
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'CREATE_CHAT': {
      const newChat: Chat = {
        id: action.payload.id,
        title: 'New Chat',
        messages: [],
        createdAt: Date.now(),
        archived: false,
      };
      
      return {
        ...state,
        chats: [newChat, ...state.chats],
        activeChat: newChat.id,
      };
    }
    
    case 'SET_ACTIVE_CHAT':
      return {
        ...state,
        activeChat: action.payload.chatId,
      };
      
    case 'ADD_MESSAGE': {
      const { chatId, message } = action.payload;
      return {
        ...state,
        chats: state.chats.map(chat => 
          chat.id === chatId
            ? {
                ...chat,
                messages: [...chat.messages, message],
                // Update title to reflect first user message if it's the first one
                title: chat.title === 'New Chat' && message.sender === 'user' 
                  ? message.content.slice(0, 20) + (message.content.length > 20 ? '...' : '')
                  : chat.title
              }
            : chat
        ),
      };
    }
    
    case 'DELETE_CHAT': {
      const filteredChats = state.chats.filter(chat => chat.id !== action.payload.chatId);
      
      return {
        ...state,
        chats: filteredChats,
        activeChat: state.activeChat === action.payload.chatId
          ? (filteredChats.find(chat => !chat.archived)?.id || null)
          : state.activeChat,
      };
    }
      
    case 'ARCHIVE_CHAT':
      return {
        ...state,
        chats: state.chats.map(chat => 
          chat.id === action.payload.chatId
            ? { ...chat, archived: true }
            : chat
        ),
      };
      
    case 'UNARCHIVE_CHAT':
      return {
        ...state,
        chats: state.chats.map(chat => 
          chat.id === action.payload.chatId
            ? { ...chat, archived: false }
            : chat
        ),
      };
      
    case 'LOAD_CHATS':
      return {
        ...state,
        chats: action.payload.chats,
        activeChat: action.payload.chats.length > 0 
          ? (action.payload.chats.find(chat => !chat.archived)?.id || action.payload.chats[0].id) 
          : null,
      };
      
    default:
      return state;
  }
};

const initialState: ChatState = {
  chats: [],
  activeChat: null,
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const [settings, setSettings] = useState<ChatSettings>(defaultSettings);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  
  useEffect(() => {
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
      dispatch({ type: 'LOAD_CHATS', payload: { chats: JSON.parse(savedChats) } });
    } else {
      const defaultChatId = generateId();
      dispatch({ type: 'CREATE_CHAT', payload: { id: defaultChatId } });
      
      setTimeout(() => {
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            chatId: defaultChatId,
            message: {
              id: generateId(),
              content: "Hi, I'm your mental health companion. How are you feeling today? I'm here to listen and support you.",
              sender: 'bot',
              timestamp: Date.now(),
            },
          },
        });
      }, 500);
    }
    
    // Load settings
    const savedSettings = localStorage.getItem('chatSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    } else {
      localStorage.setItem('chatSettings', JSON.stringify(defaultSettings));
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(state.chats));
  }, [state.chats]);
  
  useEffect(() => {
    localStorage.setItem('chatSettings', JSON.stringify(settings));
  }, [settings]);
  
  const generateId = () => {
    return Math.random().toString(36).substring(2, 15);
  };
  
  const activeMessages = state.activeChat 
    ? state.chats.find(chat => chat.id === state.activeChat)?.messages || []
    : [];
  
  const createChat = () => {
    const newChatId = generateId();
    dispatch({ type: 'CREATE_CHAT', payload: { id: newChatId } });
    
    setTimeout(() => {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          chatId: newChatId,
          message: {
            id: generateId(),
            content: "Hi, I'm your mental health companion. How are you feeling today? I'm here to listen and support you.",
            sender: 'bot',
            timestamp: Date.now(),
          },
        },
      });
    }, 500);
    
    return newChatId;
  };
  
  const setActiveChat = (chatId: string) => {
    dispatch({ type: 'SET_ACTIVE_CHAT', payload: { chatId } });
  };
  
  const addMessage = async (message: Pick<Message, 'content' | 'sender'>) => {
    if (!state.activeChat) return;
    
    const newMessage: Message = {
      id: generateId(),
      ...message,
      timestamp: Date.now(),
    };
    
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        chatId: state.activeChat,
        message: newMessage,
      },
    });
    
    if (message.sender === 'user') {
      setIsLoadingResponse(true);
      
      try {
        // Prepare the conversation history
        const chat = state.chats.find(c => c.id === state.activeChat);
        if (!chat) throw new Error("Chat not found");
        
        const messageHistory = [...chat.messages, newMessage];
        
        // Call the Gemini API through our edge function
        const { data, error } = await supabase.functions.invoke('chat-gemini', {
          body: { 
            messages: messageHistory,
            maxTokens: settings.responseLength
          }
        });
        
        if (error) throw error;
        
        // Add some friendliness if that setting is enabled
        let responseContent = data.content;
        if (settings.friendlyTone && Math.random() > 0.7) {
          const friendlyPhrases = [
            "I'm here for you. ",
            "I understand how you feel. ",
            "That's a great point. ",
            "I appreciate you sharing that with me. ",
            "Thank you for opening up. "
          ];
          const randomPhrase = friendlyPhrases[Math.floor(Math.random() * friendlyPhrases.length)];
          responseContent = randomPhrase + responseContent;
        }
        
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            chatId: state.activeChat,
            message: {
              id: generateId(),
              content: responseContent,
              sender: 'bot',
              timestamp: Date.now(),
            },
          },
        });
      } catch (error) {
        console.error("Error getting response:", error);
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            chatId: state.activeChat,
            message: {
              id: generateId(),
              content: "I'm sorry, I encountered an error generating a response. Please try again later.",
              sender: 'bot',
              timestamp: Date.now(),
            },
          },
        });
      } finally {
        setIsLoadingResponse(false);
      }
    }
  };
  
  const deleteChat = (chatId: string) => {
    dispatch({ type: 'DELETE_CHAT', payload: { chatId } });
    
    // Check if we need to create a new chat (if all chats were deleted or all remaining are archived)
    const chatsAfterDeletion = state.chats.filter(chat => chat.id !== chatId);
    const nonArchivedChats = chatsAfterDeletion.filter(chat => !chat.archived);
    
    if (nonArchivedChats.length === 0) {
      // Create a new chat if there are no non-archived chats left
      createChat();
    }
  };
  
  const archiveChat = (chatId: string) => {
    dispatch({ type: 'ARCHIVE_CHAT', payload: { chatId } });
    
    // If the archived chat was active, set another chat as active
    if (state.activeChat === chatId) {
      const nonArchivedChats = state.chats.filter(chat => !chat.archived && chat.id !== chatId);
      if (nonArchivedChats.length > 0) {
        setActiveChat(nonArchivedChats[0].id);
      } else {
        // Create a new chat if all chats are archived
        createChat();
      }
    }
  };
  
  const unarchiveChat = (chatId: string) => {
    dispatch({ type: 'UNARCHIVE_CHAT', payload: { chatId } });
  };
  
  return (
    <ChatContext.Provider
      value={{
        chats: state.chats,
        activeChat: state.activeChat,
        activeMessages,
        createChat,
        setActiveChat,
        addMessage,
        deleteChat,
        archiveChat,
        unarchiveChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
