'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useAuth } from '@/hooks/use-auth';

const UserProfile = () => {
  const { user } = useAuth();
  const userAvatar = PlaceHolderImages.find((p) => p.id === 'user-avatar');
  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            {userAvatar && (
              <AvatarImage
                src={userAvatar.imageUrl}
                alt="User Avatar"
                data-ai-hint={userAvatar.imageHint}
              />
            )}
            <AvatarFallback>
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">My Profile</CardTitle>
            <CardDescription className="font-code">
              {user.walletAddress}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">Reputation Score</h3>
          <p className="text-primary">{user.reputationScore} / 100</p>
        </div>
        <div>
          <h3 className="font-semibold">Wallet Provider</h3>
          <p>Mock Wallet</p>
        </div>
      </CardContent>
    </Card>
  );
};


export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          View your account details and reputation.
        </p>
      </div>
      <UserProfile />
    </div>
  );
}
