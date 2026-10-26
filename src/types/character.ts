export type StatKey = 
  | 'INT' 
  | 'REF' 
  | 'DEX' 
  | 'TECH' 
  | 'COOL' 
  | 'WILL' 
  | 'LUCK' 
  | 'MOVE' 
  | 'BODY' 
  | 'EMP';

export interface Stats {
  INT: number;
  REF: number;
  DEX: number;
  TECH: number;
  COOL: number;
  WILL: number;
  LUCK_CURRENT: number;
  LUCK_MAX: number;
  MOVE: number;
  BODY: number;
  EMP_BASE: number;
}

export type RoleName = 
  | 'Solo' 
  | 'Netrunner' 
  | 'Tech' 
  | 'Medtech' 
  | 'Rockerboy' 
  | 'Media' 
  | 'Exec' 
  | 'Lawman' 
  | 'Fixer' 
  | 'Nomad';

export interface Weapon {
  id: string;
  name: string;
  type: 'Pistol' | 'SMG' | 'Shotgun' | 'Assault Rifle' | 'Sniper' | 'Melee' | 'Exotic' | 'Heavy';
  damage: string; // e.g., '3d6', '4d6', '5d6', '2d6'
  ammoCurrent: number;
  ammoMax: number;
  rof: number; // Rate of Fire (1 or 2)
  notes: string;
  equipped: boolean;
}

export interface ArmorPiece {
  name: string;
  spMax: number;
  spCurrent: number;
}

export interface ArmorState {
  head: ArmorPiece;
  body: ArmorPiece;
  shield: {
    hpMax: number;
    hpCurrent: number;
    equipped: boolean;
  };
  penalty: 0 | -2 | -4; // Armor penalty reduces REF, DEX, MOVE
}

export interface CriticalInjury {
  id: string;
  name: string;
  location: string;
  effect: string;
  treated: boolean;
}

export type CyberwareLocation = 
  | 'neuralware' 
  | 'cyberoptics_right'
  | 'cyberoptics_left'
  | 'cyberaudio' 
  | 'internal' 
  | 'external' 
  | 'fashionware'
  | 'cyberarm_right' 
  | 'cyberarm_left' 
  | 'cyberleg_right' 
  | 'cyberleg_left' 
  | 'borgware';

export interface CyberwareItem {
  id: string;
  name: string;
  location: CyberwareLocation;
  hl: number; // Humanity Loss
  costEb: number;
  slots: number;
  description: string;
  isCustom?: boolean;
  isDefault?: boolean; // e.g. Neuroport
}

export interface SkillDefinition {
  name: string;
  stat: StatKey;
  category: 
    | 'Awareness' 
    | 'Body' 
    | 'Control' 
    | 'Education' 
    | 'Fighting' 
    | 'Performance' 
    | 'Ranged Weapon' 
    | 'Social' 
    | 'Technique';
  isDoubleCost?: boolean; // [x2] skills
  description?: string;
}

export interface CharacterSheet {
  id: string;
  handle: string;
  realName: string;
  role: RoleName;
  roleAbilityName: string;
  roleAbilityRank: number;
  reputation: number;
  eurobucks: number;
  avatarUrl: string;
  notes: string;
  
  stats: Stats;
  hpCurrent: number;
  deathSavePenalty: number;
  
  armor: ArmorState;
  weapons: Weapon[];
  criticalInjuries: CriticalInjury[];
  
  skills: Record<string, number>; // Skill name -> level (0-10)
  cyberware: CyberwareItem[];
}

export interface RollBreakdown {
  label: string;
  baseStat: number;
  statName: string;
  skillLevel: number;
  baseValue: number;
  d10Roll: number;
  explodedRolls: number[];
  fumbledRoll: number;
  seriouslyWoundedPenalty: number;
  total: number;
  isCritSuccess: boolean;
  isCritFumble: boolean;
  timestamp: number;
}
