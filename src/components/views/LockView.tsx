'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Lock, Eye, EyeOff, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/hooks/useTranslations';
import Image from 'next/image';

interface LockViewProps {
  onUnlock: (password: string) => Promise<boolean>;
  onDisconnect: () => void;
  walletInfo: { address: string };
}

export function LockView({ onUnlock, onDisconnect, walletInfo }: LockViewProps) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const t = useTranslations();

  const handleUnlock = async () => {
    if (!password) {
      setError('Password is required.');
      return;
    }
    setIsLoading(true);
    setError('');
    const success = await onUnlock(password);
    setIsLoading(false);
    if (!success) {
      setError('Incorrect password. Please try again.');
      toast({
        title: 'Unlock Failed',
        description: 'The password you entered is incorrect.',
        variant: 'destructive',
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUnlock();
    }
  };

  return (
    <Card className="text-center shadow-lg">
      <CardHeader>
        <div className="mx-auto bg-primary/10 p-4 rounded-full mb-2">
            <Lock className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="font-sans text-3xl">Wallet Locked</CardTitle>
        <CardDescription>
          Your wallet is locked for security. Enter your password to unlock.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-left">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
                <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError('');
                    }}
                    onKeyDown={handleKeyPress}
                    placeholder="Enter your password"
                    className="pr-10"
                />
                <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
            {error && <p className="text-destructive text-sm mt-2">{error}</p>}
        </div>
        <Button size="lg" onClick={handleUnlock} disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="animate-spin mr-2" />}
          Unlock
        </Button>
      </CardContent>
      <CardFooter className="flex-col gap-2">
         <p className="text-xs text-muted-foreground font-mono">{walletInfo.address}</p>
        <Button variant="link" size="sm" onClick={onDisconnect}>
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect and use a different wallet
        </Button>
      </CardFooter>
    </Card>
  );
}