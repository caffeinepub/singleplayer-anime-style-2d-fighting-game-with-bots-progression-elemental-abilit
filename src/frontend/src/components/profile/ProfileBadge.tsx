import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { User } from 'lucide-react';
import type { PlayerProfile } from '../../backend';

interface ProfileBadgeProps {
  profile: PlayerProfile;
}

export default function ProfileBadge({ profile }: ProfileBadgeProps) {
  const level = Number(profile.level);
  const xp = Number(profile.experience);
  const xpInCurrentLevel = xp % 100;
  const xpProgress = (xpInCurrentLevel / 100) * 100;

  return (
    <Card className="p-4 min-w-[200px]">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          <span className="font-bold">{profile.name}</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Level {level}</span>
            <span className="text-muted-foreground">
              {xpInCurrentLevel} / 100 XP
            </span>
          </div>
          <Progress value={xpProgress} className="h-2" />
        </div>
      </div>
    </Card>
  );
}
