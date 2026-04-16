import { useState, useEffect } from 'react';
import { AppState, User, Message, Chat } from '../types';
import { p2p } from './p2p';
import { toast } from 'sonner';

const STORAGE_KEY = 'offline_messenger_v1';

const INITIAL_STATE: AppState = {
  currentUser: null,
  chats: [],
  messages: {},
  nearbyUsers: [],
};

export function useAppStore() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  // Sync with local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (state.currentUser) {
      localStorage.setItem('messenger_user', JSON.stringify(state.currentUser));
    }
  }, [state]);

  // Setup P2P listeners
  useEffect(() => {
    p2p.setListeners(
      (msg) => {
        // Handle incoming message
        if (state.currentUser && msg.receiverId === state.currentUser.id) {
          addMessage(msg.senderId, msg);
          toast.success(`New message from ${msg.senderId}`);
        }
      },
      (user) => {
        // Handle discovered user
        if (state.currentUser && user.id !== state.currentUser.id) {
          setState(prev => {
            const exists = prev.nearbyUsers.find(u => u.id === user.id);
            if (exists) return prev;
            return { ...prev, nearbyUsers: [...prev.nearbyUsers, user] };
          });
        }
      }
    );

    // Initial discovery broadcast
    if (state.currentUser) {
      p2p.broadcastPresence(state.currentUser);
    }
  }, [state.currentUser]);

  const setUser = (user: User) => {
    setState(prev => ({ ...prev, currentUser: user }));
    p2p.broadcastPresence(user);
  };

  const addMessage = (chatId: string, message: Message) => {
    setState(prev => {
      const chatMessages = prev.messages[chatId] || [];
      const updatedMessages = {
        ...prev.messages,
        [chatId]: [...chatMessages, message],
      };

      // Update or create chat in chat list
      const existingChat = prev.chats.find(c => c.id === chatId);
      let updatedChats = [...prev.chats];

      if (existingChat) {
        updatedChats = updatedChats.map(c => 
          c.id === chatId 
            ? { ...c, lastMessage: message, unreadCount: message.senderId !== prev.currentUser?.id ? c.unreadCount + 1 : 0 } 
            : c
        );
      } else {
        const user = prev.nearbyUsers.find(u => u.id === chatId);
        if (user) {
          updatedChats.push({
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            isGroup: false,
            participants: [prev.currentUser!.id, user.id],
            lastMessage: message,
            unreadCount: 0,
          });
        }
      }

      return { ...prev, messages: updatedMessages, chats: updatedChats };
    });
  };

  const startChat = (user: User) => {
    setState(prev => {
      const exists = prev.chats.find(c => c.id === user.id);
      if (exists) return prev;
      return {
        ...prev,
        chats: [
          {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            isGroup: false,
            participants: [prev.currentUser!.id, user.id],
            unreadCount: 0,
          },
          ...prev.chats,
        ],
      };
    });
  };

  const clearUnread = (chatId: string) => {
    setState(prev => ({
      ...prev,
      chats: prev.chats.map(c => c.id === chatId ? { ...c, unreadCount: 0 } : c)
    }));
  };

  return {
    state,
    setUser,
    addMessage,
    startChat,
    clearUnread,
  };
}