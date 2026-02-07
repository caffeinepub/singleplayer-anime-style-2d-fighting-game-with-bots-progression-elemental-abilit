import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSaveCallerPlayerProfile } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import type { PlayerProfile } from '../../backend';

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const { identity } = useInternetIdentity();
  const saveMutation = useSaveCallerPlayerProfile();

  const handleSave = () => {
    if (!identity || !name.trim()) return;

    const profile: PlayerProfile = {
      principal: identity.getPrincipal(),
      name: name.trim(),
      avatarUrl: undefined,
      level: 1n,
      experience: 0n,
      unlockedAbilities: [],
    };

    saveMutation.mutate(profile);
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome, Shinobi!</DialogTitle>
          <DialogDescription>Choose your fighter name to begin your journey.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Fighter Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && name.trim()) {
                  handleSave();
                }
              }}
              autoFocus
            />
          </div>
          <Button
            onClick={handleSave}
            disabled={!name.trim() || saveMutation.isPending}
            className="w-full"
          >
            {saveMutation.isPending ? 'Saving...' : 'Start Your Journey'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
