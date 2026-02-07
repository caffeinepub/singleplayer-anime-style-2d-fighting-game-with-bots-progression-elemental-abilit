# Specification

## Summary
**Goal:** Build a playable singleplayer 2D anime-inspired fighting game where the player fights AI bots (including boss variants), uses elemental abilities and a Sharingan-like C-spec power, and earns persistent XP/levels to unlock move sets.

**Planned changes:**
- Create core game loop and screens: main menu → mode select (standard bot or boss) → loadout (10 fighting styles) → 2D fight scene → results/restart.
- Implement combat basics and match rules: best-of-3 rounds with win-by-2; show round score, round outcome, and match winner in the HUD/UI.
- Add input support: keyboard (WASD, 1–6), mouse (MB1 attack, MB2 block), touch on-screen controls, and basic gamepad mappings for movement/attack/block/abilities.
- Implement abilities: elemental set (fire/water/earth/lightning) mapped into ability slots 1–6 with visible effects and UI cooldown/availability indicators.
- Implement Sharingan C-spec: activation input/button, duration + cooldown UI, auto-dodge behavior, and buffs (+10 damage, increased speed, increased HP).
- Build AI opponents: standard bots that move/attack/block and sometimes use abilities; boss variant with higher stats and at least one unique behavior/ability.
- Add progression: award XP per match (win 20, loss 5), level up each 100 XP, cap level at 100; display XP/level and persist profile.
- Backend (single Motoko actor): Internet Identity-auth keyed profile storage with total XP, level, and unlocked move/ability sets; methods getProfile, awardMatchXp(result), updateUnlocks; frontend fetch via React Query.
- Apply a consistent 2D anime-inspired UI theme across menus, HUD, and results.
- Add and render required static assets from `frontend/public/assets/generated` (arena background, sprites, HUD frames, icons).

**User-visible outcome:** The user can sign in (or play as guest without persistence), pick a fighting style, choose a bot or boss match, fight in a 2D anime-style arena using attacks, block, elemental abilities (1–6), and a Sharingan-like C-spec, then see match/round results and earn persistent XP and levels with unlocks.
