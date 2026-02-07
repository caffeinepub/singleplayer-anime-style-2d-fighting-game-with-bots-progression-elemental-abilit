import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { elementalAbilities, ElementalAbility } from '../../game/content/styles';
import { X } from 'lucide-react';

interface AbilitySlotPickerProps {
  selectedAbilities: (ElementalAbility | null)[];
  onSelectAbility: (index: number, ability: ElementalAbility | null) => void;
}

export default function AbilitySlotPicker({ selectedAbilities, onSelectAbility }: AbilitySlotPickerProps) {
  return (
    <div className="space-y-4">
      {/* Ability Slots */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {selectedAbilities.map((ability, index) => (
          <Card
            key={index}
            className="p-4 relative min-h-[100px] flex flex-col items-center justify-center"
          >
            <div className="text-xs text-muted-foreground mb-2">Slot {index + 1}</div>
            {ability ? (
              <>
                <div className="text-3xl mb-1">{ability.icon}</div>
                <div className="text-xs font-bold text-center">{ability.name}</div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0"
                  onClick={() => onSelectAbility(index, null)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </>
            ) : (
              <div className="text-muted-foreground text-xs">Empty</div>
            )}
          </Card>
        ))}
      </div>

      {/* Available Abilities */}
      <div>
        <h3 className="text-lg font-bold mb-2">Available Abilities</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {elementalAbilities.map((ability) => (
            <Card
              key={ability.id}
              className="p-4 cursor-pointer transition-all hover:scale-105 hover:border-primary/50"
              onClick={() => {
                const emptyIndex = selectedAbilities.findIndex((a) => a === null);
                if (emptyIndex !== -1) {
                  onSelectAbility(emptyIndex, ability);
                }
              }}
            >
              <div className="space-y-2">
                <div className="text-3xl text-center">{ability.icon}</div>
                <h4 className="font-bold text-center text-sm">{ability.name}</h4>
                <div className="text-xs text-muted-foreground text-center">{ability.element}</div>
                <div className="text-xs text-center">CD: {ability.cooldown}s</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
