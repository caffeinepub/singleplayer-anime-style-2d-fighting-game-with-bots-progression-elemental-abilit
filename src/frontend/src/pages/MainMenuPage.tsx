import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerPlayerProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Swords, Target, User, LogIn, LogOut } from 'lucide-react';
import ProfileSetupModal from '../components/profile/ProfileSetupModal';
import ProfileBadge from '../components/profile/ProfileBadge';
import GameLayout from '../components/layout/GameLayout';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export default function MainMenuPage() {
  const navigate = useNavigate();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerPlayerProfile();
  const [selectedMode, setSelectedMode] = useState<'bot' | 'boss'>('bot');

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const handleStartMatch = () => {
    sessionStorage.setItem('matchMode', selectedMode);
    navigate({ to: '/loadout' });
  };

  return (
    <GameLayout>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 relative">
        {/* Auth Button - Top Right */}
        <div className="absolute top-6 right-6 z-10">
          <Button
            onClick={handleAuth}
            disabled={loginStatus === 'logging-in'}
            variant={isAuthenticated ? 'outline' : 'default'}
            size="lg"
            className="gap-2"
          >
            {loginStatus === 'logging-in' ? (
              'Logging in...'
            ) : isAuthenticated ? (
              <>
                <LogOut className="w-4 h-4" />
                Logout
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Login
              </>
            )}
          </Button>
        </div>

        {/* Profile Badge - Top Left */}
        {isAuthenticated && userProfile && (
          <div className="absolute top-6 left-6 z-10">
            <ProfileBadge profile={userProfile} />
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-4xl w-full space-y-8">
          {/* Title */}
          <div className="text-center space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
              SHINOBI CLASH
            </h1>
            <p className="text-xl text-muted-foreground">Master the elements. Unleash your power.</p>
          </div>

          {/* Mode Selection */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card
              className={`p-6 cursor-pointer transition-all hover:scale-105 ${
                selectedMode === 'bot'
                  ? 'border-primary border-2 bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedMode('bot')}
            >
              <div className="flex flex-col items-center space-y-4">
                <Swords className="w-16 h-16 text-primary" />
                <h3 className="text-2xl font-bold">Standard Match</h3>
                <p className="text-center text-muted-foreground">
                  Fight against skilled opponents to test your abilities
                </p>
              </div>
            </Card>

            <Card
              className={`p-6 cursor-pointer transition-all hover:scale-105 ${
                selectedMode === 'boss'
                  ? 'border-destructive border-2 bg-destructive/10'
                  : 'border-border hover:border-destructive/50'
              }`}
              onClick={() => setSelectedMode('boss')}
            >
              <div className="flex flex-col items-center space-y-4">
                <Target className="w-16 h-16 text-destructive" />
                <h3 className="text-2xl font-bold">Boss Challenge</h3>
                <p className="text-center text-muted-foreground">
                  Face powerful bosses with unique abilities and tactics
                </p>
              </div>
            </Card>
          </div>

          {/* Start Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleStartMatch}
              className="text-xl px-12 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            >
              Start Match
            </Button>
          </div>

          {/* Guest Mode Notice */}
          {!isAuthenticated && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                <User className="inline w-4 h-4 mr-1" />
                Playing as guest. Login to save your progress!
              </p>
            </div>
          )}
        </div>

        {/* Profile Setup Modal */}
        {showProfileSetup && <ProfileSetupModal />}
      </div>
    </GameLayout>
  );
}
