import { Card } from '@/components/ui/card';

interface Ability {
  id: string;
  name: string;
  icon: string;
  cooldown: number;
  currentCooldown: number;
  element: string;
}

interface AbilityBarProps {
  abilities: Ability[];
}

export default function AbilityBar({ abilities }: AbilityBarProps) {
  return (
    <Card className="p-3 bg-background/80 backdrop-blur">
      <div className="flex gap-2">
        {abilities.map((ability, index) => {
          const isOnCooldown = ability.currentCooldown > 0;
          const cooldownPercent = (ability.currentCooldown / ability.cooldown) * 100;

          return (
            <div
              key={ability.id}
              className={`relative flex-1 aspect-square rounded border-2 flex flex-col items-center justify-center ${
                isOnCooldown ? 'border-muted bg-muted/20' : 'border-primary bg-primary/10'
              }`}
            >
              <div className="text-xs absolute top-1 left-1 font-bold">{index + 1}</div>
              <div className="text-2xl">{ability.icon}</div>
              {isOnCooldown && (
                <>
                  <div className="absolute inset-0 bg-background/60 rounded" style={{ clipPath: `inset(${100 - cooldownPercent}% 0 0 0)` }} />
                  <div className="absolute bottom-1 text-xs font-bold">{Math.ceil(ability.currentCooldown)}s</div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
