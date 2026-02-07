import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import GameLayout from '../components/layout/GameLayout';
import StylePicker from '../components/loadout/StylePicker';
import AbilitySlotPicker from '../components/loadout/AbilitySlotPicker';
import { FightingStyle, ElementalAbility } from '../game/content/styles';

export default function LoadoutPage() {
  const navigate = useNavigate();
  const [selectedStyle, setSelectedStyle] = useState<FightingStyle | null>(null);
  const [selectedAbilities, setSelectedAbilities] = useState<(ElementalAbility | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  const handleStartFight = () => {
    if (!selectedStyle) return;

    const loadout = {
      style: selectedStyle,
      abilities: selectedAbilities.filter((a) => a !== null) as ElementalAbility[],
    };

    sessionStorage.setItem('loadout', JSON.stringify(loadout));
    navigate({ to: '/fight' });
  };

  const canStart = selectedStyle !== null;

  return (
    <GameLayout>
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-4xl font-bold">Prepare for Battle</h1>
            <div className="w-24" />
          </div>

          {/* Style Selection */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Choose Your Fighting Style</h2>
            <StylePicker selectedStyle={selectedStyle} onSelectStyle={setSelectedStyle} />
          </div>

          {/* Ability Selection */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Select Your Abilities (Slots 1-6)</h2>
            <AbilitySlotPicker
              selectedAbilities={selectedAbilities}
              onSelectAbility={(index, ability) => {
                const newAbilities = [...selectedAbilities];
                newAbilities[index] = ability;
                setSelectedAbilities(newAbilities);
              }}
            />
          </div>

          {/* Start Button */}
          <div className="flex justify-center pt-8">
            <Button
              size="lg"
              onClick={handleStartFight}
              disabled={!canStart}
              className="text-xl px-12 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            >
              Enter the Arena
            </Button>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
