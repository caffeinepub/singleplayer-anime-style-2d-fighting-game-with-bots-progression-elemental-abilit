import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { InputManager } from '../../game/input/InputManager';

interface TouchControlsOverlayProps {
  inputManager: InputManager;
}

export default function TouchControlsOverlay({ inputManager }: TouchControlsOverlayProps) {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  if (!isTouchDevice) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Left Side - Movement */}
      <div className="absolute bottom-20 left-4 pointer-events-auto">
        <div className="grid grid-cols-3 gap-1 w-32 h-32">
          <div />
          <Button
            variant="outline"
            size="icon"
            className="bg-background/80"
            onTouchStart={() => inputManager.setKey('w', true)}
            onTouchEnd={() => inputManager.setKey('w', false)}
          >
            ↑
          </Button>
          <div />
          <Button
            variant="outline"
            size="icon"
            className="bg-background/80"
            onTouchStart={() => inputManager.setKey('a', true)}
            onTouchEnd={() => inputManager.setKey('a', false)}
          >
            ←
          </Button>
          <div />
          <Button
            variant="outline"
            size="icon"
            className="bg-background/80"
            onTouchStart={() => inputManager.setKey('d', true)}
            onTouchEnd={() => inputManager.setKey('d', false)}
          >
            →
          </Button>
          <div />
          <Button
            variant="outline"
            size="icon"
            className="bg-background/80"
            onTouchStart={() => inputManager.setKey('s', true)}
            onTouchEnd={() => inputManager.setKey('s', false)}
          >
            ↓
          </Button>
          <div />
        </div>
      </div>

      {/* Right Side - Actions */}
      <div className="absolute bottom-20 right-4 pointer-events-auto space-y-2">
        <div className="flex gap-2">
          <Button
            variant="default"
            className="w-16 h-16 bg-primary"
            onTouchStart={() => inputManager.setMouseButton(0, true)}
            onTouchEnd={() => inputManager.setMouseButton(0, false)}
          >
            ATK
          </Button>
          <Button
            variant="outline"
            className="w-16 h-16 bg-background/80"
            onTouchStart={() => inputManager.setMouseButton(2, true)}
            onTouchEnd={() => inputManager.setMouseButton(2, false)}
          >
            BLK
          </Button>
        </div>
        <Button
          variant="destructive"
          className="w-full"
          onTouchStart={() => inputManager.setKey('c', true)}
          onTouchEnd={() => inputManager.setKey('c', false)}
        >
          C-SPEC
        </Button>
      </div>
    </div>
  );
}
