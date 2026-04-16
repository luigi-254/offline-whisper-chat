import { useState, useRef, useEffect } from 'react';
import { Chat, Message, User } from '../types';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Paperclip, 
  Send, 
  MoreVertical, 
  Phone, 
  Video, 
  Smile, 
  Check, 
  CheckCheck,
  Image as ImageIcon,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { p2p } from '../lib/p2p';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface ChatWindowProps {
  currentUser: User;
  chat: Chat;
  messages: Message[];
  onSendMessage: (msg: Message) => void;
}

export function ChatWindow({ currentUser, chat, messages, onSendMessage }: ChatWindowProps) {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      senderId: currentUser.id,
      receiverId: chat.id,
      text: inputText.trim(),
      timestamp: Date.now(),
      status: 'sent',
      isGroup: chat.isGroup,
    };

    onSendMessage(newMessage);
    p2p.sendMessage(newMessage);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full bg-[#E5DDD5] dark:bg-slate-950 relative">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{ 
          backgroundImage: `url('https://storage.googleapis.com/dala-prod-public-storage/generated-images/45953161-77c5-46f8-a851-4ca8e316cdb8/chat-wallpaper-dark-51074139-1776363861399.webp')`,
          backgroundSize: '400px'
        }}
      />

      {/* Header */}
      <div className="relative z-10 p-3 flex items-center justify-between bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={chat.avatar} />
            <AvatarFallback>{chat.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm leading-tight">{chat.name}</h3>
            <p className="text-[10px] text-emerald-500 font-medium">Online</p>
          </div>
        </div>

        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="rounded-full text-slate-600 dark:text-slate-400">
            <Video className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full text-slate-600 dark:text-slate-400">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full text-slate-600 dark:text-slate-400">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="relative z-10 flex-1 overflow-y-auto p-4 space-y-2"
      >
        <div className="flex justify-center mb-4">
          <span className="bg-amber-100 dark:bg-slate-800 text-amber-800 dark:text-amber-200 text-[10px] px-3 py-1 rounded-md shadow-sm border border-amber-200 dark:border-slate-700">
            🔒 Messages are end-to-end encrypted. No third-party can read them.
          </span>
        </div>

        {messages.map((msg) => {
          const isOwn = msg.senderId === currentUser.id;
          return (
            <div
              key={msg.id}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-3 py-1.5 rounded-lg shadow-sm relative group ${
                  isOwn 
                    ? 'bg-emerald-100 dark:bg-emerald-900/50 text-slate-900 dark:text-emerald-50 rounded-tr-none' 
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none'
                }`}
              >
                <p className="text-sm mb-1 leading-relaxed">{msg.text}</p>
                <div className="flex items-center justify-end gap-1">
                  <span className="text-[10px] text-slate-400">
                    {format(msg.timestamp, 'HH:mm')}
                  </span>
                  {isOwn && (
                    <div className="flex text-emerald-500">
                      {msg.status === 'sent' ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <CheckCheck className="w-3 h-3" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="relative z-10 p-3 bg-slate-50 dark:bg-slate-900 border-t dark:border-slate-800 flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full shrink-0">
              <Paperclip className="w-5 h-5 text-slate-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="mb-2">
            <DropdownMenuItem className="gap-2">
              <ImageIcon className="w-4 h-4 text-purple-500" /> Photos & Videos
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <FileText className="w-4 h-4 text-blue-500" /> Document
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="rounded-full shrink-0">
          <Smile className="w-5 h-5 text-slate-500" />
        </Button>
        
        <Input
          placeholder="Type a message"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-white dark:bg-slate-800 border-none focus-visible:ring-0 rounded-full h-10 px-4"
        />

        <Button 
          onClick={handleSend}
          size="icon" 
          className="rounded-full shrink-0 bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}