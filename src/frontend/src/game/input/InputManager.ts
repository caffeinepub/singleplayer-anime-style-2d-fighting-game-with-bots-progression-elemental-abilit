export class InputManager {
  private keys: Map<string, boolean> = new Map();
  private mouseButtons: Map<number, boolean> = new Map();
  private gamepadIndex: number | null = null;

  constructor() {
    this.setupKeyboard();
    this.setupMouse();
    this.setupGamepad();
  }

  private setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      this.keys.set(e.key.toLowerCase(), true);
    });

    window.addEventListener('keyup', (e) => {
      this.keys.set(e.key.toLowerCase(), false);
    });
  }

  private setupMouse() {
    window.addEventListener('mousedown', (e) => {
      this.mouseButtons.set(e.button, true);
    });

    window.addEventListener('mouseup', (e) => {
      this.mouseButtons.set(e.button, false);
    });
  }

  private setupGamepad() {
    window.addEventListener('gamepadconnected', (e) => {
      this.gamepadIndex = e.gamepad.index;
    });

    window.addEventListener('gamepaddisconnected', () => {
      this.gamepadIndex = null;
    });
  }

  public getActions() {
    const actions = {
      moveLeft: this.keys.get('a') || this.keys.get('arrowleft') || false,
      moveRight: this.keys.get('d') || this.keys.get('arrowright') || false,
      moveUp: this.keys.get('w') || this.keys.get('arrowup') || false,
      moveDown: this.keys.get('s') || this.keys.get('arrowdown') || false,
      attack: this.mouseButtons.get(0) || false,
      block: this.mouseButtons.get(2) || false,
      ability1: this.keys.get('1') || false,
      ability2: this.keys.get('2') || false,
      ability3: this.keys.get('3') || false,
      ability4: this.keys.get('4') || false,
      ability5: this.keys.get('5') || false,
      ability6: this.keys.get('6') || false,
      cSpec: this.keys.get('c') || false,
    };

    // Add gamepad support
    if (this.gamepadIndex !== null) {
      const gamepad = navigator.getGamepads()[this.gamepadIndex];
      if (gamepad) {
        actions.moveLeft = actions.moveLeft || gamepad.axes[0] < -0.5;
        actions.moveRight = actions.moveRight || gamepad.axes[0] > 0.5;
        actions.moveUp = actions.moveUp || gamepad.axes[1] < -0.5;
        actions.moveDown = actions.moveDown || gamepad.axes[1] > 0.5;
        actions.attack = actions.attack || gamepad.buttons[0]?.pressed || false;
        actions.block = actions.block || gamepad.buttons[1]?.pressed || false;
        actions.cSpec = actions.cSpec || gamepad.buttons[2]?.pressed || false;
      }
    }

    return actions;
  }

  public setKey(key: string, pressed: boolean) {
    this.keys.set(key.toLowerCase(), pressed);
  }

  public setMouseButton(button: number, pressed: boolean) {
    this.mouseButtons.set(button, pressed);
  }

  public destroy() {
    this.keys.clear();
    this.mouseButtons.clear();
  }
}
