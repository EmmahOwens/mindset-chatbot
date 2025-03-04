
import React, { createContext, useContext, useReducer, useEffect } from 'react';

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
    
    case 'DELETE_CHAT':
      return {
        ...state,
        chats: state.chats.filter(chat => chat.id !== action.payload.chatId),
        activeChat: state.activeChat === action.payload.chatId 
          ? (state.chats.find(chat => chat.id !== action.payload.chatId)?.id || null)
          : state.activeChat,
      };
      
    case 'ARCHIVE_CHAT':
      return {
        ...state,
        chats: state.chats.map(chat => 
          chat.id === action.payload.chatId
            ? { ...chat, archived: true }
            : chat
        ),
      };
      
    case 'LOAD_CHATS':
      return {
        ...state,
        chats: action.payload.chats,
        activeChat: action.payload.chats.length > 0 ? action.payload.chats[0].id : null,
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
  
  // Load chats from localStorage on initial render
  useEffect(() => {
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
      dispatch({ type: 'LOAD_CHATS', payload: { chats: JSON.parse(savedChats) } });
    } else {
      // Create a default first chat if no chats exist
      const defaultChatId = generateId();
      dispatch({ type: 'CREATE_CHAT', payload: { id: defaultChatId } });
      
      // Add welcome message from the bot
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
  }, []);
  
  // Save chats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(state.chats));
  }, [state.chats]);
  
  // Generate a unique ID
  const generateId = () => {
    return Math.random().toString(36).substring(2, 15);
  };
  
  // Get messages for the active chat
  const activeMessages = state.activeChat 
    ? state.chats.find(chat => chat.id === state.activeChat)?.messages || []
    : [];
  
  // Create a new chat
  const createChat = () => {
    const newChatId = generateId();
    dispatch({ type: 'CREATE_CHAT', payload: { id: newChatId } });
    
    // Add welcome message from the bot
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
  
  // Set the active chat
  const setActiveChat = (chatId: string) => {
    dispatch({ type: 'SET_ACTIVE_CHAT', payload: { chatId } });
  };
  
  // Add a message to the active chat
  const addMessage = (message: Pick<Message, 'content' | 'sender'>) => {
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
    
    // Auto-respond with a bot message if the message is from the user
    if (message.sender === 'user') {
      setTimeout(() => {
        const botResponses = [
          "Thank you for sharing that with me. How does this situation make you feel?",
          "I understand this can be challenging. Would you like to talk more about it?",
          "I'm here to support you. Have you tried any coping strategies that have helped in the past?",
          "That sounds difficult. Remember that it's okay to feel this way, and your feelings are valid.",
          "I appreciate you opening up. Would it help to break down this situation into smaller parts?",
        ];
        
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
        
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            chatId: state.activeChat,
            message: {
              id: generateId(),
              content: randomResponse,
              sender: 'bot',
              timestamp: Date.now(),
            },
          },
        });
      }, 1000);
    }
  };
  
  // Delete a chat
  const deleteChat = (chatId: string) => {
    dispatch({ type: 'DELETE_CHAT', payload: { chatId } });
  };
  
  // Archive a chat
  const archiveChat = (chatId: string) => {
    dispatch({ type: 'ARCHIVE_CHAT', payload: { chatId } });
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
