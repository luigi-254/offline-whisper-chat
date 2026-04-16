import { useState } from 'react';
import { useAppStore } from './lib/store';
import { Onboarding } from './components/Onboarding';
import { ChatList } from './components/ChatList';
import { ChatWindow } from './components/ChatWindow';
import { Discovery } from './components/Discovery';
import { Toaster } from './components/ui/sonner';
import { Chat } from './types';
import { Smartphone } from 'lucide-react';

function App() {
  const { state, setUser, addMessage, startChat, clearUnread } = useAppStore();
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(undefined);
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);

  if (!state.currentUser) {
    return (
      <>
        <Onboarding onComplete={setUser} />
        <Toaster position="top-center" />
      </>
    );
  }

  const selectedChat = state.chats.find(c => c.id === selectedChatId);
  const chatMessages = selectedChatId ? (state.messages[selectedChatId] || []) : [];

  const handleSelectChat = (chat: Chat) => {
    setSelectedChatId(chat.id);
    clearUnread(chat.id);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 dark:bg-slate-950">
      <div className="w-full max-w-7xl mx-auto flex h-full overflow-hidden shadow-2xl">
        {/* Sidebar */}
        <div className="w-full sm:w-[350px] md:w-[400px] flex-shrink-0">
          <ChatList
            currentUser={state.currentUser}
            chats={state.chats}
            onSelectChat={handleSelectChat}
            selectedChatId={selectedChatId}
            onOpenDiscovery={() => setIsDiscoveryOpen(true)}
          />
        </div>

        {/* Main Content */}
        <div className="hidden sm:flex flex-1 flex-col">
          {selectedChat ? (
            <ChatWindow
              currentUser={state.currentUser}
              chat={selectedChat}
              messages={chatMessages}
              onSendMessage={(msg) => addMessage(selectedChat.id, msg)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-center p-8 border-l dark:border-slate-800">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-8 rounded-full mb-6">
                <Smartphone className="w-16 h-16 text-emerald-500" />
              </div>
              <h1 className="text-3xl font-light text-slate-700 dark:text-slate-300 mb-2">Offline Messenger</h1>
              <p className="text-slate-500 max-w-xs">
                Select a chat or find nearby devices to start messaging without internet.
              </p>
              <div className="mt-8 flex items-center gap-2 text-slate-400 text-xs">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Scanning for nearby devices...
              </div>
            </div>
          )}
        </div>
      </div>

      <Discovery
        isOpen={isDiscoveryOpen}
        onClose={() => setIsDiscoveryOpen(false)}
        nearbyUsers={state.nearbyUsers}
        onStartChat={(user) => {
          startChat(user);
          setSelectedChatId(user.id);
        }}
      />
      
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;