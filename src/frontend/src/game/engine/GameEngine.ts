import { InputManager } from '../input/InputManager';
import { FightingStyle, ElementalAbility } from '../content/styles';

interface MappedAbility {
  id: string;
  name: string;
  icon: string;
  element: 'fire' | 'water' | 'earth' | 'lightning' | 'none';
  cooldown: number;
  currentCooldown: number;
  damage: number;
  effect: string;
}

interface Fighter {
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  health: number;
  maxHealth: number;
  isBlocking: boolean;
  facingRight: boolean;
  style: FightingStyle;
  abilities: MappedAbility[];
  cSpec: any;
  attackCooldown: number;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private inputManager: InputManager | null = null;
  private animationId: number | null = null;
  private lastTime: number = 0;
  private onStateChange: (state: any) => void;

  private player: Fighter;
  private enemy: Fighter;
  private playerRounds: number = 0;
  private enemyRounds: number = 0;
  private roundNumber: number = 1;
  private roundResult: string | null = null;
  private matchEnded: boolean = false;
  private winner: string | null = null;
  private roundTimer: number = 0;
  private roundEndTimer: number = 0;

  private background: HTMLImageElement;
  private mode: 'bot' | 'boss';

  constructor(
    canvas: HTMLCanvasElement,
    loadout: { style: FightingStyle; abilities: ElementalAbility[] },
    mode: 'bot' | 'boss',
    onStateChange: (state: any) => void
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.onStateChange = onStateChange;
    this.mode = mode;

    // Set canvas size
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // Load background
    this.background = new Image();
    this.background.src = '/assets/generated/arena-bg.dim_1920x1080.png';

    // Initialize fighters
    this.player = this.createFighter('Player', loadout.style, loadout.abilities, 200, true);
    this.enemy = this.createFighter(
      mode === 'boss' ? 'Boss' : 'Opponent',
      loadout.style,
      [],
      this.canvas.width - 200,
      false
    );

    // Boss has more health
    if (mode === 'boss') {
      this.enemy.maxHealth = 150;
      this.enemy.health = 150;
    }
  }

  private createFighter(
    name: string,
    style: FightingStyle,
    abilities: ElementalAbility[],
    x: number,
    facingRight: boolean
  ): Fighter {
    const mappedAbilities: MappedAbility[] = abilities.map((ability) => ({
      id: ability.id,
      name: ability.name,
      icon: ability.icon,
      element: ability.element,
      cooldown: ability.cooldown,
      currentCooldown: 0,
      damage: ability.damage,
      effect: ability.effect,
    }));

    // Fill empty slots
    while (mappedAbilities.length < 6) {
      mappedAbilities.push({
        id: `empty-${mappedAbilities.length}`,
        name: 'Empty',
        icon: '⚫',
        element: 'none',
        cooldown: 0,
        currentCooldown: 0,
        damage: 0,
        effect: '',
      });
    }

    return {
      name,
      x,
      y: this.canvas.height / 2,
      vx: 0,
      vy: 0,
      health: 100,
      maxHealth: 100,
      isBlocking: false,
      facingRight,
      style,
      abilities: mappedAbilities,
      cSpec: {
        isActive: false,
        duration: 10,
        currentDuration: 0,
        cooldown: 30,
        currentCooldown: 0,
      },
      attackCooldown: 0,
    };
  }

  public setInputManager(inputManager: InputManager) {
    this.inputManager = inputManager;
  }

  public start() {
    this.lastTime = performance.now();
    this.loop();
  }

  public stop() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private loop = () => {
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.render();

    this.animationId = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    if (this.matchEnded) return;

    // Handle round end delay
    if (this.roundResult) {
      this.roundEndTimer += dt;
      if (this.roundEndTimer >= 2) {
        this.startNewRound();
      }
      return;
    }

    this.roundTimer += dt;

    // Update cooldowns
    this.updateCooldowns(this.player, dt);
    this.updateCooldowns(this.enemy, dt);

    // Get input
    if (this.inputManager) {
      const actions = this.inputManager.getActions();
      this.handlePlayerInput(actions, dt);
    }

    // AI for enemy
    this.updateAI(dt);

    // Update physics
    this.updatePhysics(this.player, dt);
    this.updatePhysics(this.enemy, dt);

    // Check collisions and attacks
    this.checkCombat();

    // Check round end
    if (this.player.health <= 0 || this.enemy.health <= 0) {
      this.endRound();
    }

    // Emit state
    this.emitState();
  }

  private updateCooldowns(fighter: Fighter, dt: number) {
    fighter.abilities.forEach((ability) => {
      if (ability.currentCooldown > 0) {
        ability.currentCooldown = Math.max(0, ability.currentCooldown - dt);
      }
    });

    if (fighter.cSpec.isActive) {
      fighter.cSpec.currentDuration -= dt;
      if (fighter.cSpec.currentDuration <= 0) {
        fighter.cSpec.isActive = false;
        fighter.cSpec.currentCooldown = fighter.cSpec.cooldown;
      }
    } else if (fighter.cSpec.currentCooldown > 0) {
      fighter.cSpec.currentCooldown = Math.max(0, fighter.cSpec.currentCooldown - dt);
    }

    if (fighter.attackCooldown > 0) {
      fighter.attackCooldown -= dt;
    }
  }

  private handlePlayerInput(actions: any, dt: number) {
    const speed = this.player.style.stats.speed * 100;
    const speedMultiplier = this.player.cSpec.isActive ? 1.5 : 1;

    this.player.vx = 0;
    this.player.vy = 0;

    if (actions.moveLeft) {
      this.player.vx = -speed * speedMultiplier;
      this.player.facingRight = false;
    }
    if (actions.moveRight) {
      this.player.vx = speed * speedMultiplier;
      this.player.facingRight = true;
    }
    if (actions.moveUp) this.player.vy = -speed * speedMultiplier;
    if (actions.moveDown) this.player.vy = speed * speedMultiplier;

    this.player.isBlocking = actions.block;

    if (actions.attack && this.player.attackCooldown <= 0) {
      this.performAttack(this.player, this.enemy);
      this.player.attackCooldown = 0.5;
    }

    // Abilities
    [actions.ability1, actions.ability2, actions.ability3, actions.ability4, actions.ability5, actions.ability6].forEach(
      (pressed, index) => {
        if (pressed && this.player.abilities[index]?.currentCooldown === 0 && this.player.abilities[index]?.element !== 'none') {
          this.useAbility(this.player, this.enemy, index);
        }
      }
    );

    // C-Spec
    if (actions.cSpec && !this.player.cSpec.isActive && this.player.cSpec.currentCooldown === 0) {
      this.activateCSpec(this.player);
    }
  }

  private updateAI(dt: number) {
    const distance = Math.abs(this.player.x - this.enemy.x);
    const speed = this.enemy.style.stats.speed * 80;

    // Simple AI: move toward player and attack
    if (distance > 150) {
      if (this.player.x < this.enemy.x) {
        this.enemy.vx = -speed;
        this.enemy.facingRight = false;
      } else {
        this.enemy.vx = speed;
        this.enemy.facingRight = true;
      }
    } else {
      this.enemy.vx = 0;
      if (this.enemy.attackCooldown <= 0 && Math.random() < 0.02) {
        this.performAttack(this.enemy, this.player);
        this.enemy.attackCooldown = 1;
      }
    }

    // Boss uses abilities more often
    if (this.mode === 'boss' && Math.random() < 0.005) {
      const availableAbilities = this.player.abilities.filter((a) => a.currentCooldown === 0 && a.element !== 'none');
      if (availableAbilities.length > 0) {
        const randomAbility = Math.floor(Math.random() * 6);
        if (this.enemy.abilities[randomAbility]?.currentCooldown === 0 && this.enemy.abilities[randomAbility]?.element !== 'none') {
          this.useAbility(this.enemy, this.player, randomAbility);
        }
      }
    }
  }

  private updatePhysics(fighter: Fighter, dt: number) {
    fighter.x += fighter.vx * dt;
    fighter.y += fighter.vy * dt;

    // Bounds
    fighter.x = Math.max(50, Math.min(this.canvas.width - 50, fighter.x));
    fighter.y = Math.max(100, Math.min(this.canvas.height - 100, fighter.y));
  }

  private performAttack(attacker: Fighter, defender: Fighter) {
    const distance = Math.abs(attacker.x - defender.x);
    const range = attacker.style.stats.range * 20;

    if (distance <= range) {
      let damage = attacker.style.stats.damage * 5;
      if (attacker.cSpec.isActive) damage += 10;

      if (defender.isBlocking) {
        damage *= 0.3;
      }

      // Auto-dodge for defender with C-Spec
      if (defender.cSpec.isActive && Math.random() < 0.5) {
        damage = 0;
      }

      defender.health = Math.max(0, defender.health - damage);
    }
  }

  private useAbility(user: Fighter, target: Fighter, index: number) {
    const ability = user.abilities[index];
    if (!ability || ability.currentCooldown > 0 || ability.element === 'none') return;

    ability.currentCooldown = ability.cooldown;

    // Apply ability effects
    if (ability.effect.includes('Restores')) {
      user.health = Math.min(user.maxHealth, user.health + 30);
    } else if (ability.damage > 0) {
      let damage = ability.damage;
      if (user.cSpec.isActive) damage += 10;
      if (target.isBlocking) damage *= 0.5;
      target.health = Math.max(0, target.health - damage);
    }
  }

  private activateCSpec(fighter: Fighter) {
    fighter.cSpec.isActive = true;
    fighter.cSpec.currentDuration = fighter.cSpec.duration;
    fighter.maxHealth += 20;
    fighter.health = Math.min(fighter.maxHealth, fighter.health + 20);
  }

  private checkCombat() {
    // Combat is handled in performAttack
  }

  private endRound() {
    if (this.player.health <= 0) {
      this.enemyRounds++;
      this.roundResult = 'enemy';
    } else {
      this.playerRounds++;
      this.roundResult = 'player';
    }

    this.roundEndTimer = 0;

    // Check match end (best of 3, win by 2)
    const roundDiff = Math.abs(this.playerRounds - this.enemyRounds);
    if ((this.playerRounds >= 2 || this.enemyRounds >= 2) && roundDiff >= 2) {
      this.matchEnded = true;
      this.winner = this.playerRounds > this.enemyRounds ? 'player' : 'enemy';
    }
  }

  private startNewRound() {
    this.roundResult = null;
    this.roundNumber++;
    this.roundTimer = 0;

    // Reset fighters
    this.player.health = this.player.maxHealth;
    this.enemy.health = this.enemy.maxHealth;
    this.player.x = 200;
    this.enemy.x = this.canvas.width - 200;
    this.player.cSpec.isActive = false;
    this.enemy.cSpec.isActive = false;
  }

  private render() {
    // Clear
    this.ctx.fillStyle = '#0a0a0a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Background
    if (this.background.complete) {
      this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);
    }

    // Fighters
    this.renderFighter(this.player);
    this.renderFighter(this.enemy);
  }

  private renderFighter(fighter: Fighter) {
    const size = 60;

    // Shadow
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.beginPath();
    this.ctx.ellipse(fighter.x, fighter.y + size / 2 + 10, size / 2, 10, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Body
    this.ctx.fillStyle = fighter === this.player ? '#3b82f6' : '#ef4444';
    if (fighter.cSpec.isActive) {
      this.ctx.fillStyle = '#a855f7';
    }
    this.ctx.fillRect(fighter.x - size / 2, fighter.y - size / 2, size, size);

    // Blocking indicator
    if (fighter.isBlocking) {
      this.ctx.strokeStyle = '#fbbf24';
      this.ctx.lineWidth = 3;
      this.ctx.strokeRect(fighter.x - size / 2 - 5, fighter.y - size / 2 - 5, size + 10, size + 10);
    }

    // Direction indicator
    this.ctx.fillStyle = '#ffffff';
    const arrowX = fighter.facingRight ? fighter.x + 10 : fighter.x - 10;
    this.ctx.fillRect(arrowX, fighter.y - 5, 10, 10);
  }

  private emitState() {
    this.onStateChange({
      player: { ...this.player },
      enemy: { ...this.enemy },
      playerRounds: this.playerRounds,
      enemyRounds: this.enemyRounds,
      roundNumber: this.roundNumber,
      roundResult: this.roundResult,
      matchEnded: this.matchEnded,
      winner: this.winner,
    });
  }
}
