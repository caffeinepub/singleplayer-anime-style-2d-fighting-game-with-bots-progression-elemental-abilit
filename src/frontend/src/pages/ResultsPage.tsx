import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trophy, Swords, Home } from 'lucide-react';
import GameLayout from '../components/layout/GameLayout';
import { useAwardMatchXp, useGetCallerPlayerProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Progress } from '@/components/ui/progress';

interface MatchResult {
  didWin: boolean;
  playerRounds: number;
  enemyRounds: number;
  totalRounds: number;
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: profile } = useGetCallerPlayerProfile();
  const awardXpMutation = useAwardMatchXp();
  const [result, setResult] = useState<MatchResult | null>(null);
  const [xpAwarded, setXpAwarded] = useState<number>(0);
  const [previousLevel, setPreviousLevel] = useState<number>(1);
  const [previousXp, setPreviousXp] = useState<number>(0);

  useEffect(() => {
    const resultStr = sessionStorage.getItem('matchResult');
    if (!resultStr) {
      navigate({ to: '/' });
      return;
    }

    const matchResult: MatchResult = JSON.parse(resultStr);
    setResult(matchResult);

    // Store previous profile state
    if (profile) {
      setPreviousLevel(Number(profile.level));
      setPreviousXp(Number(profile.experience));
    }

    // Award XP if authenticated
    if (identity) {
      awardXpMutation.mutate(matchResult.didWin, {
        onSuccess: (data) => {
          setXpAwarded(Number(data.xpAwarded));
        },
      });
    } else {
      // Guest mode - just show expected XP
      setXpAwarded(matchResult.didWin ? 20 : 5);
    }
  }, [identity]);

  const handleRestart = () => {
    sessionStorage.removeItem('matchResult');
    navigate({ to: '/loadout' });
  };

  const handleMainMenu = () => {
    sessionStorage.removeItem('matchResult');
    navigate({ to: '/' });
  };

  if (!result) return null;

  const newXp = previousXp + xpAwarded;
  const newLevel = Math.min(Math.floor(newXp / 100) + 1, 100);
  const leveledUp = newLevel > previousLevel;
  const xpInCurrentLevel = newXp % 100;
  const xpProgress = (xpInCurrentLevel / 100) * 100;

  return (
    <GameLayout>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-2xl w-full space-y-8">
          {/* Result Header */}
          <div className="text-center space-y-4">
            {result.didWin ? (
              <>
                <Trophy className="w-24 h-24 mx-auto text-primary animate-bounce" />
                <h1 className="text-6xl font-bold text-primary">VICTORY!</h1>
              </>
            ) : (
              <>
                <Swords className="w-24 h-24 mx-auto text-destructive" />
                <h1 className="text-6xl font-bold text-destructive">DEFEAT</h1>
              </>
            )}
          </div>

          {/* Match Summary */}
          <Card className="p-6 space-y-4">
            <h2 className="text-2xl font-bold text-center">Match Summary</h2>
            <div className="flex justify-center items-center gap-8 text-4xl font-bold">
              <div className="text-center">
                <div className="text-primary">{result.playerRounds}</div>
                <div className="text-sm text-muted-foreground">You</div>
              </div>
              <div className="text-muted-foreground">-</div>
              <div className="text-center">
                <div className="text-destructive">{result.enemyRounds}</div>
                <div className="text-sm text-muted-foreground">Opponent</div>
              </div>
            </div>
            <div className="text-center text-muted-foreground">
              {result.totalRounds} {result.totalRounds === 1 ? 'round' : 'rounds'} played
            </div>
          </Card>

          {/* XP Gained */}
          <Card className="p-6 space-y-4">
            <h2 className="text-2xl font-bold text-center">Experience Gained</h2>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary">+{xpAwarded} XP</div>
              {leveledUp && (
                <div className="text-xl text-accent mt-2 animate-pulse">
                  🎉 Level Up! Now Level {newLevel}
                </div>
              )}
            </div>

            {identity && profile ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Level {newLevel}</span>
                  <span>
                    {xpInCurrentLevel} / 100 XP
                  </span>
                </div>
                <Progress value={xpProgress} className="h-3" />
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground">
                Login to save your progress!
              </div>
            )}
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              size="lg"
              variant="outline"
              onClick={handleMainMenu}
              className="flex-1 gap-2"
            >
              <Home className="w-4 h-4" />
              Main Menu
            </Button>
            <Button
              size="lg"
              onClick={handleRestart}
              className="flex-1 gap-2 bg-gradient-to-r from-primary to-accent"
            >
              <Swords className="w-4 h-4" />
              Fight Again
            </Button>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
