import { CharacterSheet, RoleName, RollBreakdown, StatKey } from '../types/character';

export const ROLE_ABILITIES: Record<RoleName, { name: string; description: string }> = {
  Rockerboy: {
    name: 'Charismatic Impact',
    description: 'Capacidade de influenciar multidões, fãs e indivíduos pelo carisma e magnetismo artístico.',
  },
  Solo: {
    name: 'Combat Awareness',
    description: 'Percepção e táticas de combate avançadas (Threat Detection, Precision Attack, Damage Absorb).',
  },
  Netrunner: {
    name: 'Interface',
    description: 'Habilidade de mergulhar em redes virtuais, invadir sistemas e desferir programas de combate.',
  },
  Tech: {
    name: 'Maker',
    description: 'Fabricar, aprimorar, inventar e reparar qualquer equipamento, arma ou cibernético.',
  },
  Medtech: {
    name: 'Medicine',
    description: 'Cirurgia de campo, farmacologia médica e estabilização de traumas críticos.',
  },
  Media: {
    name: 'Credibility',
    description: 'Poder da imprensa de convencer o público, expor conspirações e acessar fontes protegidas.',
  },
  Exec: {
    name: 'Teamwork',
    description: 'Apoio corporativo de alto escalão: motorista particular, guarda-costas e residência de luxo.',
  },
  Lawman: {
    name: 'Backup',
    description: 'Chamar reforços policiais locais ou esquadrões armados da corporação para o local.',
  },
  Fixer: {
    name: 'Operator',
    description: 'Rede de contatos no submundo, capacidade de achar qualquer mercadoria e negociar favores.',
  },
  Nomad: {
    name: 'Moto',
    description: 'Vínculo com a Família Nômade, manutenção e upgrades customizados na frota veicular.',
  },
};

/**
 * Calculates humanity loss, current humanity, and current EMP.
 */
export function calculateHumanityAndEmp(character: Pick<CharacterSheet, 'stats' | 'cyberware'>) {
  const baseEmp = character.stats.EMP_BASE || 8;
  const initialHumanity = baseEmp * 10;
  
  const totalHL = character.cyberware.reduce((acc, item) => acc + (item.hl || 0), 0);
  const currentHumanity = Math.max(0, initialHumanity - totalHL);
  const currentEmp = Math.floor(currentHumanity / 10);

  return {
    initialHumanity,
    totalHL,
    currentHumanity,
    currentEmp,
    isBorderline: currentHumanity < 20 && currentHumanity > 0,
    isCyberpsycho: currentHumanity <= 0,
  };
}

/**
 * Calculates effective stats considering armor penalty, cyberware buffs (like Grafted Muscle / Linear Frames), and humanity.
 */
export function calculateEffectiveStats(character: CharacterSheet): Record<StatKey, number> {
  const { currentEmp } = calculateHumanityAndEmp(character);
  const armorPenalty = character.armor?.penalty || 0; // 0, -2, -4

  // Check cyberware effects on BODY
  let effectiveBody = character.stats.BODY;
  const hasGraftedMuscle = character.cyberware.some(c => c.name.toLowerCase().includes('grafted muscle'));
  if (hasGraftedMuscle) {
    effectiveBody += 2;
  }
  const hasLinearFrameBeta = character.cyberware.some(c => c.name.toLowerCase().includes('linear frame beta'));
  const hasLinearFrameSigma = character.cyberware.some(c => c.name.toLowerCase().includes('linear frame sigma'));
  if (hasLinearFrameBeta) {
    effectiveBody = Math.max(effectiveBody, 14);
  } else if (hasLinearFrameSigma) {
    effectiveBody = Math.max(effectiveBody, 12);
  }

  // Armor penalty reduces REF, DEX, and MOVE
  const effectiveRef = Math.max(1, character.stats.REF + armorPenalty);
  const effectiveDex = Math.max(1, character.stats.DEX + armorPenalty);
  const effectiveMove = Math.max(1, character.stats.MOVE + armorPenalty);

  return {
    INT: character.stats.INT,
    REF: effectiveRef,
    DEX: effectiveDex,
    TECH: character.stats.TECH,
    COOL: character.stats.COOL,
    WILL: character.stats.WILL,
    LUCK: character.stats.LUCK_CURRENT,
    MOVE: effectiveMove,
    BODY: effectiveBody,
    EMP: currentEmp,
  };
}

/**
 * HP Máximo = 10 + (5 * Math.ceil((BODY_efetivo + WILL) / 2))
 */
export function calculateMaxHp(effectiveBody: number, will: number): number {
  return 10 + (5 * Math.ceil((effectiveBody + will) / 2));
}

/**
 * Seriously Wounded Threshold = Math.ceil(HP Máximo / 2)
 */
export function calculateSeriouslyWoundedThreshold(maxHp: number): number {
  return Math.ceil(maxHp / 2);
}

/**
 * Rolls 1d10 with Cyberpunk RED rules:
 * - 10 explodes (roll another 1d10 and add, can keep exploding)
 * - 1 fumbles (roll 1d10 and subtract from total)
 */
export function rollD10Exploding(
  skillName: string,
  baseValue: number,
  statName: string,
  baseStat: number,
  skillLevel: number,
  applySeriouslyWounded: boolean
): RollBreakdown {
  const initialRoll = Math.floor(Math.random() * 10) + 1;
  const explodedRolls: number[] = [];
  let fumbledRoll = 0;
  let total = baseValue + initialRoll;

  if (initialRoll === 10) {
    let nextRoll = Math.floor(Math.random() * 10) + 1;
    explodedRolls.push(nextRoll);
    total += nextRoll;
    while (nextRoll === 10) {
      nextRoll = Math.floor(Math.random() * 10) + 1;
      explodedRolls.push(nextRoll);
      total += nextRoll;
    }
  } else if (initialRoll === 1) {
    fumbledRoll = Math.floor(Math.random() * 10) + 1;
    total -= fumbledRoll;
  }

  const seriouslyWoundedPenalty = applySeriouslyWounded ? 2 : 0;
  total -= seriouslyWoundedPenalty;

  return {
    label: skillName,
    baseStat,
    statName,
    skillLevel,
    baseValue,
    d10Roll: initialRoll,
    explodedRolls,
    fumbledRoll,
    seriouslyWoundedPenalty,
    total,
    isCritSuccess: initialRoll === 10,
    isCritFumble: initialRoll === 1,
    timestamp: Date.now(),
  };
}

/**
 * Roll damage for a weapon (e.g. 3d6, 5d6, 2d6+2)
 */
export interface DamageRollResult {
  weaponName: string;
  damageFormula: string;
  diceRolls: number[];
  modifier: number;
  total: number;
  isCriticalInjury: boolean; // 2 or more 6s rolled
  sixesCount: number;
  timestamp: number;
}

export function rollDamage(weaponName: string, formula: string): DamageRollResult {
  // Regex to match "Xd6", "Xd6+Y", "Xd6-Y"
  const clean = formula.toLowerCase().replace(/\s+/g, '');
  const match = clean.match(/^(\d+)d(\d+)([+-]\d+)?$/);

  const count = match ? parseInt(match[1], 10) : 3;
  const sides = match ? parseInt(match[2], 10) : 6;
  const mod = match && match[3] ? parseInt(match[3], 10) : 0;

  const diceRolls: number[] = [];
  let sixesCount = 0;
  let sum = 0;

  for (let i = 0; i < count; i++) {
    const roll = Math.floor(Math.random() * sides) + 1;
    diceRolls.push(roll);
    sum += roll;
    if (roll === 6) sixesCount++;
  }

  const total = Math.max(0, sum + mod);
  const isCriticalInjury = sixesCount >= 2;

  return {
    weaponName,
    damageFormula: formula,
    diceRolls,
    modifier: mod,
    total,
    isCriticalInjury,
    sixesCount,
    timestamp: Date.now(),
  };
}
