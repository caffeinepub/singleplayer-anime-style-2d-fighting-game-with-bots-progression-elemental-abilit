import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MatchResult {
    xpAwarded: bigint;
    didWin: boolean;
}
export interface AbilitySet {
    id: bigint;
    requiredLevel: bigint;
    name: string;
    description: string;
}
export interface PlayerProfile {
    principal: Principal;
    name: string;
    level: bigint;
    experience: bigint;
    unlockedAbilities: Array<AbilitySet>;
    avatarUrl?: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    awardMatchXp(didWin: boolean): Promise<MatchResult>;
    getAbilityById(abilityId: bigint): Promise<AbilitySet | null>;
    getAvailableAbilities(): Promise<Array<AbilitySet>>;
    getCallerPlayerProfile(): Promise<PlayerProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPlayerProfile(principal: Principal): Promise<PlayerProfile | null>;
    initializeAbilities(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerPlayerProfile(profile: PlayerProfile): Promise<void>;
}
