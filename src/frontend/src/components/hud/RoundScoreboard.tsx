import { Card } from '@/components/ui/card';

interface RoundScoreboardProps {
  playerRounds: number;
  enemyRounds: number;
  roundNumber: number;
}

export default function RoundScoreboard({ playerRounds, enemyRounds, roundNumber }: RoundScoreboardProps) {
  return (
    <Card className="p-3 bg-background/80 backdrop-blur min-w-[120px]">
      <div className="text-center space-y-1">
        <div className="text-xs text-muted-foreground">Round {roundNumber}</div>
        <div className="text-2xl font-bold">
          <span className="text-primary">{playerRounds}</span>
          <span className="text-muted-foreground mx-2">-</span>
          <span className="text-destructive">{enemyRounds}</span>
        </div>
      </div>
    </Card>
  );
}
