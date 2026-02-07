import { Card } from '@/components/ui/card';
import { fightingStyles, FightingStyle } from '../../game/content/styles';

interface StylePickerProps {
  selectedStyle: FightingStyle | null;
  onSelectStyle: (style: FightingStyle) => void;
}

export default function StylePicker({ selectedStyle, onSelectStyle }: StylePickerProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {fightingStyles.map((style) => (
        <Card
          key={style.id}
          className={`p-4 cursor-pointer transition-all hover:scale-105 ${
            selectedStyle?.id === style.id
              ? 'border-primary border-2 bg-primary/10'
              : 'border-border hover:border-primary/50'
          }`}
          onClick={() => onSelectStyle(style)}
        >
          <div className="space-y-2">
            <div className="text-2xl text-center">{style.icon}</div>
            <h3 className="font-bold text-center text-sm">{style.name}</h3>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Speed: {style.stats.speed}</div>
              <div>Power: {style.stats.damage}</div>
              <div>Defense: {style.stats.defense}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
