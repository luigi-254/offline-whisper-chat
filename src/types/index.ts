export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string; // Chat ID (User ID or Group ID)
  text?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'document';
  timestamp: number;
  status: 'sent' | 'delivered' | 'read';
  isGroup?: boolean;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: Message;
  unreadCount: number;
  isGroup: boolean;
  participants: string[]; // User IDs
}

export interface AppState {
  currentUser: User | null;
  chats: Chat[];
  messages: Record<string, Message[]>; // chatID -> messages
  nearbyUsers: User[];
}