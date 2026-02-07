export interface FightingStyle {
  id: string;
  name: string;
  icon: string;
  description: string;
  stats: {
    speed: number;
    damage: number;
    defense: number;
    range: number;
  };
}

export interface ElementalAbility {
  id: string;
  name: string;
  icon: string;
  element: 'fire' | 'water' | 'earth' | 'lightning';
  cooldown: number;
  damage: number;
  effect: string;
}

export const fightingStyles: FightingStyle[] = [
  {
    id: 'taijutsu',
    name: 'Taijutsu',
    icon: '👊',
    description: 'Balanced hand-to-hand combat',
    stats: { speed: 7, damage: 7, defense: 7, range: 5 },
  },
  {
    id: 'speed',
    name: 'Swift Strike',
    icon: '⚡',
    description: 'Lightning-fast attacks',
    stats: { speed: 10, damage: 5, defense: 5, range: 6 },
  },
  {
    id: 'power',
    name: 'Iron Fist',
    icon: '💪',
    description: 'Devastating power',
    stats: { speed: 4, damage: 10, defense: 6, range: 5 },
  },
  {
    id: 'defense',
    name: 'Stone Wall',
    icon: '🛡️',
    description: 'Impenetrable defense',
    stats: { speed: 5, damage: 6, defense: 10, range: 4 },
  },
  {
    id: 'range',
    name: 'Long Reach',
    icon: '🎯',
    description: 'Extended attack range',
    stats: { speed: 6, damage: 7, defense: 5, range: 10 },
  },
  {
    id: 'agile',
    name: 'Shadow Step',
    icon: '🌙',
    description: 'Evasive and quick',
    stats: { speed: 9, damage: 6, defense: 6, range: 7 },
  },
  {
    id: 'berserker',
    name: 'Berserker',
    icon: '🔥',
    description: 'High risk, high reward',
    stats: { speed: 7, damage: 9, defense: 4, range: 6 },
  },
  {
    id: 'counter',
    name: 'Counter Master',
    icon: '🔄',
    description: 'Punish enemy attacks',
    stats: { speed: 6, damage: 8, defense: 8, range: 5 },
  },
  {
    id: 'hybrid',
    name: 'Hybrid Arts',
    icon: '⚔️',
    description: 'Mix of all styles',
    stats: { speed: 7, damage: 7, defense: 7, range: 7 },
  },
  {
    id: 'assassin',
    name: 'Assassin',
    icon: '🗡️',
    description: 'Critical strike specialist',
    stats: { speed: 8, damage: 8, defense: 5, range: 6 },
  },
];

export const elementalAbilities: ElementalAbility[] = [
  {
    id: 'fireball',
    name: 'Fireball',
    icon: '🔥',
    element: 'fire',
    cooldown: 5,
    damage: 25,
    effect: 'Launches a fireball projectile',
  },
  {
    id: 'flame-burst',
    name: 'Flame Burst',
    icon: '💥',
    element: 'fire',
    cooldown: 8,
    damage: 40,
    effect: 'Area damage around player',
  },
  {
    id: 'water-wave',
    name: 'Water Wave',
    icon: '🌊',
    element: 'water',
    cooldown: 6,
    damage: 20,
    effect: 'Pushes enemies back',
  },
  {
    id: 'healing-rain',
    name: 'Healing Rain',
    icon: '💧',
    element: 'water',
    cooldown: 12,
    damage: 0,
    effect: 'Restores 30 HP',
  },
  {
    id: 'earth-spike',
    name: 'Earth Spike',
    icon: '🪨',
    element: 'earth',
    cooldown: 7,
    damage: 30,
    effect: 'Ground-based attack',
  },
  {
    id: 'stone-wall',
    name: 'Stone Wall',
    icon: '🧱',
    element: 'earth',
    cooldown: 10,
    damage: 0,
    effect: 'Temporary shield',
  },
  {
    id: 'lightning-dash',
    name: 'Lightning Dash',
    icon: '⚡',
    element: 'lightning',
    cooldown: 4,
    damage: 15,
    effect: 'Quick dash attack',
  },
  {
    id: 'thunder-strike',
    name: 'Thunder Strike',
    icon: '🌩️',
    element: 'lightning',
    cooldown: 9,
    damage: 45,
    effect: 'Powerful lightning attack',
  },
];
