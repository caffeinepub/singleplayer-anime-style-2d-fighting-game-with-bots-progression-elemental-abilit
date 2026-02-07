import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type PlayerProfile = {
    principal : Principal;
    name : Text;
    avatarUrl : ?Text;
    level : Nat;
    experience : Nat;
    unlockedAbilities : [AbilitySet];
  };

  public type AbilitySet = {
    id : Nat;
    name : Text;
    description : Text;
    requiredLevel : Nat;
  };

  public type MatchResult = {
    didWin : Bool;
    xpAwarded : Nat;
  };

  public type ProfileUpdate = {
    name : ?Text;
    avatarUrl : ?Text;
  };

  // Data stores
  let profiles = Map.empty<Principal, PlayerProfile>();
  let availableAbilities = Map.empty<Nat, AbilitySet>();

  // XP amounts and thresholds
  let XP_PER_WIN = 20;
  let XP_PER_LOSS = 5;
  let XP_PER_LEVEL = 100;
  let MAX_LEVEL = 100;

  // Player Profile Management
  public query ({ caller }) func getPlayerProfile(principal : Principal) : async ?PlayerProfile {
    profiles.get(principal);
  };

  public query ({ caller }) func getCallerPlayerProfile() : async ?PlayerProfile {
    profiles.get(caller);
  };

  public shared ({ caller }) func saveCallerPlayerProfile(profile : PlayerProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    if (profile.principal != caller) {
      Runtime.trap("Unauthorized: You can only update your own profile");
    };
    profiles.add(caller, profile);
  };

  // Ability System
  public query ({ caller }) func getAvailableAbilities() : async [AbilitySet] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view abilities");
    };
    availableAbilities.values().toArray();
  };

  public query ({ caller }) func getAbilityById(abilityId : Nat) : async ?AbilitySet {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view abilities");
    };
    availableAbilities.get(abilityId);
  };

  // Progression System
  public shared ({ caller }) func awardMatchXp(didWin : Bool) : async MatchResult {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can earn XP");
    };
    let xpAwarded = if didWin { XP_PER_WIN } else { XP_PER_LOSS };
    let newProfile = switch (profiles.get(caller)) {
      case (null) {
        let defaultProfile : PlayerProfile = {
          principal = caller;
          name = "Anonymous";
          avatarUrl = null;
          level = 1;
          experience = 0;
          unlockedAbilities = [];
        };
        updateProfileWithXp(defaultProfile, xpAwarded);
      };
      case (?profile) {
        updateProfileWithXp(profile, xpAwarded);
      };
    };

    profiles.add(caller, newProfile);

    {
      didWin;
      xpAwarded;
    };
  };

  func updateProfileWithXp(profile : PlayerProfile, xp : Nat) : PlayerProfile {
    let totalXp = profile.experience + xp;
    let newLevel = calculateLevel(totalXp);

    let newUnlockedAbilities = availableAbilities.values().toArray().filter(
      func(ability) {
        ability.requiredLevel <= newLevel and not isAbilityUnlocked(profile.unlockedAbilities, ability.id);
      }
    );

    let updatedAbilities = profile.unlockedAbilities.concat(newUnlockedAbilities);

    {
      profile with
      level = newLevel;
      experience = totalXp;
      unlockedAbilities = updatedAbilities;
    };
  };

  func isAbilityUnlocked(unlockedAbilities : [AbilitySet], abilityId : Nat) : Bool {
    unlockedAbilities.values().any(func(ability) { ability.id == abilityId });
  };

  func calculateLevel(totalXp : Nat) : Nat {
    let level = (totalXp / XP_PER_LEVEL) + 1;
    if (level > MAX_LEVEL) { MAX_LEVEL } else { level };
  };

  // Initialization of default Abilities (Run Once on Canister Deploy)
  public shared ({ caller }) func initializeAbilities() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can initialize abilities");
    };

    let abilitySets : [AbilitySet] = [
      {
        id = 1;
        name = "Beginner's Kit";
        description = "Starter moves for new players";
        requiredLevel = 1;
      },
      {
        id = 2;
        name = "Advanced Tactics";
        description = "Unlocks advanced strategies at level 10";
        requiredLevel = 10;
      },
      {
        id = 3;
        name = "Expert Level Set";
        description = "Expert level moves, only for level 25+ players";
        requiredLevel = 25;
      },
    ];

    abilitySets.values().forEach(func(ability) { availableAbilities.add(ability.id, ability) });
  };
};
