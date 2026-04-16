import { User } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Radar, Smartphone, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DiscoveryProps {
  isOpen: boolean;
  onClose: () => void;
  nearbyUsers: User[];
  onStartChat: (user: User) => void;
}

export function Discovery({ isOpen, onClose, nearbyUsers, onStartChat }: DiscoveryProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nearby Devices</DialogTitle>
          <DialogDescription>
            Scanning for other users on your local network/Bluetooth range.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
            <div className="relative bg-emerald-100 dark:bg-emerald-900 p-4 rounded-full">
              <Radar className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>

          <div className="w-full space-y-3">
            <h4 className="text-sm font-medium text-slate-500 px-1 flex items-center justify-between">
              Found ({nearbyUsers.length})
              <RefreshCw className="w-3 h-3 animate-spin text-slate-400" />
            </h4>
            
            <div className="max-h-60 overflow-y-auto space-y-2">
              <AnimatePresence>
                {nearbyUsers.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-8 text-center"
                  >
                    <Smartphone className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm text-slate-400">Make sure others have the app open nearby.</p>
                  </motion.div>
                ) : (
                  nearbyUsers.map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 rounded-xl border dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{user.name}</p>
                          <p className="text-[10px] text-emerald-500">Available</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          onStartChat(user);
                          onClose();
                        }}
                        className="text-xs h-8 border-emerald-500/50 text-emerald-600 hover:bg-emerald-50"
                      >
                        Message
                      </Button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}