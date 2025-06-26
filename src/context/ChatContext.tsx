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
  isLoadingResponse: boolean;
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
  showTimestamps: false,
  friendlyTone: true,
  responseLength: 400,
};

const addEmojisToResponse = (content: string) => {
  const emotionEmojis: Record<string, string[]> = {
    happy: ['😊', '😄', '🙂', '😁', '🌟'],
    sad: ['😔', '🥺', '😢', '💔', '😞'],
    angry: ['😠', '😡', '🔥', '💢'],
    surprise: ['😮', '😲', '😯', '🤯', '😳'],
    confused: ['🤔', '😕', '❓', '🧐'],
    love: ['❤️', '💕', '🥰', '💗', '💓'],
    support: ['👍', '🤝', '💪', '🙌', '🫂'],
    agreement: ['👌', '✅', '👍', '💯'],
    congratulation: ['🎉', '🎊', '🏆', '👏', '✨'],
    thoughtful: ['💭', '🧠', '💫', '✨'],
    health: ['🧘‍♀️', '💝', '🌱', '🌿', '💆‍♂️'],
    relieved: ['😌', '🙏', '✨', '💫'],
    hopeful: ['🌈', '⭐', '✨', '🌟', '💫'],
    calm: ['😌', '🧘‍♀️', '🌊', '🍃'],
    empathy: ['🫂', '💕', '👂', '🤲'],
    encouragement: ['💪', '🚀', '🔥', '⚡', '✨'],
    gratitude: ['🙏', '💖', '✨', '🌟'],
  };
  
  let matchedEmojis: string[] = [];
  Object.entries(emotionEmojis).forEach(([emotion, emojis]) => {
    const emotionRegex = new RegExp(`\\b${emotion}|${emotion}s|${emotion}ing\\b`, 'i');
    if (content.toLowerCase().match(emotionRegex)) {
      matchedEmojis.push(...emojis);
    }
  });
  
  if (matchedEmojis.length === 0) {
    matchedEmojis = [...emotionEmojis.support, ...emotionEmojis.thoughtful];
  }
  
  const randomEmoji1 = matchedEmojis[Math.floor(Math.random() * matchedEmojis.length)];
  const randomEmoji2 = matchedEmojis[Math.floor(Math.random() * matchedEmojis.length)];
  
  let enhancedContent = `${randomEmoji1} ${content}`;
  
  if (content.length > 100 && Math.random() > 0.5) {
    const sentences = content.split(/(?<=[.!?])\s+/);
    if (sentences.length > 1) {
      const middleIndex = Math.floor(sentences.length / 2);
      sentences[middleIndex] = `${sentences[middleIndex]} ${randomEmoji2}`;
      enhancedContent = sentences.join(' ');
    } else {
      enhancedContent = `${enhancedContent} ${randomEmoji2}`;
    }
  }
  
  return enhancedContent;
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
              content: "👋 Hi, I'm your mental health companion. How are you feeling today? I'm here to listen and support you. ✨",
              sender: 'bot',
              timestamp: Date.now(),
            },
          },
        });
      }, 500);
    }
    
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
            content: "👋 Hi, I'm your mental health companion. How are you feeling today? I'm here to listen and support you. ✨",
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
        const chat = state.chats.find(c => c.id === state.activeChat);
        if (!chat) throw new Error("Chat not found");
        
        const messageHistory = [...chat.messages, newMessage];
        
        // Use higher token limit to prevent truncation
        const { data, error } = await supabase.functions.invoke('chat-gemini', {
          body: { 
            messages: messageHistory,
            maxTokens: Math.max(settings.responseLength, 1500) // Ensure minimum of 1500 tokens
          }
        });
        
        if (error) throw error;
        
        let responseContent = data.content;
        
        // Log truncation warning to console but don't show to user
        if (data.truncated) {
          console.warn('Response was truncated by the API');
        }
        
        responseContent = addEmojisToResponse(responseContent);
        
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
              content: "😔 I'm sorry, I encountered an error generating a response. Please try again later. 🙏",
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
    
    const chatsAfterDeletion = state.chats.filter(chat => chat.id !== chatId);
    const nonArchivedChats = chatsAfterDeletion.filter(chat => !chat.archived);
    
    if (nonArchivedChats.length === 0) {
      createChat();
    }
  };
  
  const archiveChat = (chatId: string) => {
    dispatch({ type: 'ARCHIVE_CHAT', payload: { chatId } });
    
    if (state.activeChat === chatId) {
      const nonArchivedChats = state.chats.filter(chat => !chat.archived && chat.id !== chatId);
      if (nonArchivedChats.length > 0) {
        setActiveChat(nonArchivedChats[0].id);
      } else {
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
        isLoadingResponse,
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
