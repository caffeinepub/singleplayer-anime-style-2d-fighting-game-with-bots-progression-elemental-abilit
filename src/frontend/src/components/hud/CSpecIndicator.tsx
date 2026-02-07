import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Eye } from 'lucide-react';

interface CSpecState {
  isActive: boolean;
  duration: number;
  currentDuration: number;
  cooldown: number;
  currentCooldown: number;
}

interface CSpecIndicatorProps {
  cSpecState: CSpecState;
}

export default function CSpecIndicator({ cSpecState }: CSpecIndicatorProps) {
  const isReady = !cSpecState.isActive && cSpecState.currentCooldown === 0;
  const durationPercent = cSpecState.isActive
    ? (cSpecState.currentDuration / cSpecState.duration) * 100
    : 0;
  const cooldownPercent = cSpecState.currentCooldown > 0
    ? ((cSpecState.cooldown - cSpecState.currentCooldown) / cSpecState.cooldown) * 100
    : 100;

  return (
    <Card className="p-3 bg-background/80 backdrop-blur min-w-[140px]">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <img
            src="/assets/generated/c-spec-eye-icon.dim_128x128.png"
            alt="Sharingan"
            className="w-8 h-8"
          />
          <div className="flex-1">
            <div className="text-xs font-bold">Sharingan</div>
            {cSpecState.isActive ? (
              <div className="text-xs text-primary">Active!</div>
            ) : isReady ? (
              <div className="text-xs text-accent">Ready (C)</div>
            ) : (
              <div className="text-xs text-muted-foreground">
                {Math.ceil(cSpecState.currentCooldown)}s
              </div>
            )}
          </div>
        </div>
        <Progress
          value={cSpecState.isActive ? durationPercent : cooldownPercent}
          className="h-2"
        />
      </div>
    </Card>
  );
}
