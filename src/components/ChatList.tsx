import { Chat, User } from '../types';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { format } from 'date-fns';
import { Search, Users, MoreVertical, MessageSquarePlus } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface ChatListProps {
  currentUser: User;
  chats: Chat[];
  onSelectChat: (chat: Chat) => void;
  selectedChatId?: string;
  onOpenDiscovery: () => void;
}

export function ChatList({ currentUser, chats, onSelectChat, selectedChatId, onOpenDiscovery }: ChatListProps) {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r dark:border-slate-800">
      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-800">
        <Avatar className="w-10 h-10 ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900">
          <AvatarImage src={currentUser.avatar} />
          <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={onOpenDiscovery} className="rounded-full">
            <MessageSquarePlus className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreVertical className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>New Group</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem className="text-red-500">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search chats..." 
            className="pl-9 bg-slate-100 dark:bg-slate-800 border-none focus-visible:ring-1 focus-visible:ring-emerald-500" 
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full">
              <Users className="w-12 h-12 text-slate-400" />
            </div>
            <div className="space-y-1">
              <p className="font-medium">No conversations yet</p>
              <p className="text-sm text-slate-500">Discover nearby users to start chatting offline.</p>
            </div>
            <Button onClick={onOpenDiscovery} className="bg-emerald-600 hover:bg-emerald-700">
              Find Nearby Devices
            </Button>
          </div>
        ) : (
          chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className={`w-full flex items-center p-4 gap-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                selectedChatId === chat.id ? 'bg-slate-100 dark:bg-slate-800' : ''
              }`}
            >
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={chat.avatar} />
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
              </div>
              
              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-semibold truncate">{chat.name}</h3>
                  {chat.lastMessage && (
                    <span className="text-[10px] text-slate-400">
                      {format(chat.lastMessage.timestamp, 'HH:mm')}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-slate-500 truncate">
                    {chat.lastMessage?.text || 'No messages yet'}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.2rem] text-center">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}