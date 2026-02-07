import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import RoundScoreboard from './RoundScoreboard';
import AbilityBar from './AbilityBar';
import CSpecIndicator from './CSpecIndicator';

interface FightHudProps {
  gameState: any;
}

export default function FightHud({ gameState }: FightHudProps) {
  const playerHealthPercent = (gameState.player.health / gameState.player.maxHealth) * 100;
  const enemyHealthPercent = (gameState.enemy.health / gameState.enemy.maxHealth) * 100;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 space-y-4 pointer-events-auto">
        {/* Health Bars */}
        <div className="flex gap-4 items-center">
          {/* Player Health */}
          <Card className="flex-1 p-3 bg-background/80 backdrop-blur">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-bold">{gameState.player.name}</span>
                <span>{Math.ceil(gameState.player.health)} HP</span>
              </div>
              <Progress value={playerHealthPercent} className="h-3 bg-destructive/20" />
            </div>
          </Card>

          {/* Round Score */}
          <RoundScoreboard
            playerRounds={gameState.playerRounds}
            enemyRounds={gameState.enemyRounds}
            roundNumber={gameState.roundNumber}
          />

          {/* Enemy Health */}
          <Card className="flex-1 p-3 bg-background/80 backdrop-blur">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{Math.ceil(gameState.enemy.health)} HP</span>
                <span className="font-bold">{gameState.enemy.name}</span>
              </div>
              <Progress value={enemyHealthPercent} className="h-3 bg-destructive/20" />
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-4 pointer-events-auto">
        <div className="flex gap-4 items-end">
          {/* C-Spec Indicator */}
          <CSpecIndicator cSpecState={gameState.player.cSpec} />

          {/* Ability Bar */}
          <div className="flex-1">
            <AbilityBar abilities={gameState.player.abilities} />
          </div>
        </div>
      </div>

      {/* Round Result Overlay */}
      {gameState.roundResult && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <Card className="p-8">
            <h2 className="text-4xl font-bold text-center">
              {gameState.roundResult === 'player' ? (
                <span className="text-primary">Round Won!</span>
              ) : (
                <span className="text-destructive">Round Lost</span>
              )}
            </h2>
          </Card>
        </div>
      )}

      {/* Match End Overlay */}
      {gameState.matchEnded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
          <Card className="p-12">
            <h1 className="text-6xl font-bold text-center">
              {gameState.winner === 'player' ? (
                <span className="text-primary">VICTORY!</span>
              ) : (
                <span className="text-destructive">DEFEAT</span>
              )}
            </h1>
          </Card>
        </div>
      )}
    </div>
  );
}
