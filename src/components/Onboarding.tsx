import React, { useState } from 'react';
import { User } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { UserCircle2, Shield } from 'lucide-react';

const AVATARS = [
  'https://storage.googleapis.com/dala-prod-public-storage/generated-images/45953161-77c5-46f8-a851-4ca8e316cdb8/avatar-1-3e69ae99-1776363862122.webp',
  'https://storage.googleapis.com/dala-prod-public-storage/generated-images/45953161-77c5-46f8-a851-4ca8e316cdb8/avatar-2-16feb65c-1776363861409.webp',
  'https://storage.googleapis.com/dala-prod-public-storage/generated-images/45953161-77c5-46f8-a851-4ca8e316cdb8/avatar-3-89f86f7b-1776363863989.webp',
  'https://storage.googleapis.com/dala-prod-public-storage/generated-images/45953161-77c5-46f8-a851-4ca8e316cdb8/avatar-4-56a62ec3-1776363862909.webp',
];

export function Onboarding({ onComplete }: { onComplete: (user: User) => void }) {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onComplete({
      id: crypto.randomUUID(),
      name: name.trim(),
      avatar: selectedAvatar,
      isOnline: true,
      lastSeen: Date.now(),
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
      <Card className="w-full max-w-md shadow-xl border-slate-200 dark:border-slate-800">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="bg-emerald-500 p-3 rounded-2xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to Offline Messenger</CardTitle>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Secure, end-to-end encrypted messaging without internet.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Choose your avatar</label>
              <div className="flex justify-between gap-2">
                {AVATARS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedAvatar(url)}
                    className={`relative rounded-full p-1 transition-all ${
                      selectedAvatar === url ? 'ring-2 ring-emerald-500 scale-110' : 'opacity-60 grayscale-[50%] hover:opacity-100 hover:grayscale-0'
                    }`}
                  >
                    <Avatar className="w-14 h-14">
                      <AvatarImage src={url} alt={`Avatar ${i}`} />
                      <AvatarFallback><UserCircle2 /></AvatarFallback>
                    </Avatar>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Your Name</label>
              <Input
                id="name"
                placeholder="How should people see you?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12"
                autoFocus
              />
            </div>

            <Button type="submit" className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
              Get Started
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-xs text-slate-400">
            No servers. No cloud. Just your device.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}