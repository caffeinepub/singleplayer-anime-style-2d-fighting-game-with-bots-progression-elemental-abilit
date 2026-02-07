import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import FightHud from '../components/hud/FightHud';
import TouchControlsOverlay from '../components/controls/TouchControlsOverlay';
import { GameEngine } from '../game/engine/GameEngine';
import { InputManager } from '../game/input/InputManager';

export default function FightPage() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const inputManagerRef = useRef<InputManager | null>(null);
  const [gameState, setGameState] = useState<any>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Load loadout from session
    const loadoutStr = sessionStorage.getItem('loadout');
    const matchMode = sessionStorage.getItem('matchMode') || 'bot';

    if (!loadoutStr) {
      navigate({ to: '/loadout' });
      return;
    }

    const loadout = JSON.parse(loadoutStr);

    // Initialize input manager
    const inputManager = new InputManager();
    inputManagerRef.current = inputManager;

    // Initialize game engine
    const engine = new GameEngine(canvas, loadout, matchMode as 'bot' | 'boss', (state) => {
      setGameState(state);
    });
    engineRef.current = engine;

    // Connect input to engine
    engine.setInputManager(inputManager);

    // Start game loop
    engine.start();

    // Cleanup
    return () => {
      engine.stop();
      inputManager.destroy();
    };
  }, [navigate]);

  // Handle match end
  useEffect(() => {
    if (gameState?.matchEnded) {
      const result = {
        didWin: gameState.winner === 'player',
        playerRounds: gameState.playerRounds,
        enemyRounds: gameState.enemyRounds,
        totalRounds: gameState.roundNumber,
      };
      sessionStorage.setItem('matchResult', JSON.stringify(result));

      // Small delay before navigating
      setTimeout(() => {
        navigate({ to: '/results' });
      }, 2000);
    }
  }, [gameState?.matchEnded, gameState?.winner, navigate]);

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      {/* Game Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        tabIndex={0}
        style={{ imageRendering: 'pixelated' }}
      />

      {/* HUD Overlay */}
      {gameState && <FightHud gameState={gameState} />}

      {/* Touch Controls */}
      {inputManagerRef.current && <TouchControlsOverlay inputManager={inputManagerRef.current} />}
    </div>
  );
}
