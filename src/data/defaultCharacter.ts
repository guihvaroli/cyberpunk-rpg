import { CharacterSheet } from '../types/character';
import { OFFICIAL_SKILLS } from './skillsData';

export const DEFAULT_CHARACTER: CharacterSheet = {
  id: 'cp2077-v-solo-01',
  handle: 'V',
  realName: 'Valerie / Vincent',
  role: 'Solo',
  roleAbilityName: 'Combat Awareness',
  roleAbilityRank: 4,
  reputation: 0,
  eurobucks: 3850,
  avatarUrl: '',
  notes: 'Mercenário(a) de elite de Night City. Contratos com Fixers do Afterlife. Especialista em incursões táticas urbanas e combate com cromo de ponta.',

  stats: {
    INT: 6,
    REF: 8,
    DEX: 7,
    TECH: 5,
    COOL: 7,
    WILL: 6,
    LUCK_CURRENT: 6,
    LUCK_MAX: 6,
    MOVE: 6,
    BODY: 6, // Base 6. With Grafted Muscle (+2), effective BODY becomes 8!
    EMP_BASE: 7,
  },

  hpCurrent: 45, // Max HP with effective BODY 8 and WILL 6 is: 10 + 5 * ceil(14/2) = 45
  deathSavePenalty: 0,

  armor: {
    head: {
      name: 'Capacete Tático Light Armorjack',
      spMax: 11,
      spCurrent: 11,
    },
    body: {
      name: 'Colete Balístico Light Armorjack',
      spMax: 11,
      spCurrent: 11,
    },
    shield: {
      hpMax: 10,
      hpCurrent: 10,
      equipped: false,
    },
    penalty: 0,
  },

  weapons: [
    {
      id: 'w-1',
      name: 'Arasaka Tamayura',
      type: 'Pistol',
      damage: '3d6',
      ammoCurrent: 10,
      ammoMax: 10,
      rof: 2,
      notes: 'Pistola pesada japonesa. Smartlink integrado, silenciada. +1 no ataque (Qualidade Excelente).',
      equipped: true,
    },
    {
      id: 'w-2',
      name: 'Militech Crusher MK.II',
      type: 'Shotgun',
      damage: '5d6',
      ammoCurrent: 8,
      ammoMax: 8,
      rof: 1,
      notes: 'Escopeta semi-automática de alto impacto. Dispersão devastadora a curta distância.',
      equipped: true,
    },
    {
      id: 'w-3',
      name: 'Mantis Blades (Cromo)',
      type: 'Melee',
      damage: '3d6',
      ammoCurrent: 1,
      ammoMax: 1,
      rof: 2,
      notes: 'Lâminas retráteis de cerâmica instaladas nos antebraços. Ataques velozes.',
      equipped: true,
    },
  ],

  criticalInjuries: [
    {
      id: 'inj-1',
      name: 'Cicatriz de Fragmentação Subdérmica',
      location: 'Torso',
      effect: '-1 em testes atléticos intensos até cirurgia de remoção de fragmentos.',
      treated: false,
    },
  ],

  inventory: [
    {
      id: 'inv-1',
      name: 'Agent (Smartphone Holográfico c/ IA)',
      category: 'Tech',
      quantity: 1,
      costEb: 100,
      equipped: true,
      description: 'Dispositivo multifuncional de Night City: comunicador, mapas holográficos, transferências e navegador NET.',
    },
    {
      id: 'inv-2',
      name: 'Mochila Tática Reforçada (Carryall)',
      category: 'Gear',
      quantity: 1,
      costEb: 20,
      equipped: true,
      description: 'Mochila militar de nylon balístico resistente à chuva ácida e perfurações.',
    },
    {
      id: 'inv-3',
      name: 'Munição Pesada (Very Heavy Pistol x50)',
      category: 'Ammo',
      quantity: 50,
      costEb: 50,
      equipped: true,
      description: 'Munição padrão para pistolas pesadas como a Tamayura.',
    },
    {
      id: 'inv-4',
      name: 'Cartuchos de Escopeta (Shotgun Slugs x20)',
      category: 'Ammo',
      quantity: 20,
      costEb: 30,
      equipped: true,
      description: 'Balas de escopeta de alto impacto calibre 12.',
    },
    {
      id: 'inv-5',
      name: 'Inalador Médico Hypospray (Trauma Stim)',
      category: 'Consumable',
      quantity: 2,
      costEb: 100,
      equipped: true,
      description: 'Injeção pressurizada de emergência que estabiliza sinais vitais e acelera a coagulação.',
    },
    {
      id: 'inv-6',
      name: 'Chips de Dados Criptografados (Datashards x4)',
      category: 'Tech',
      quantity: 4,
      costEb: 40,
      equipped: false,
      description: 'Chips de memória virgens e blindados para extração de dados e logs corporativos.',
    },
    {
      id: 'inv-7',
      name: 'Granada de Concussão Flashbang',
      category: 'Gear',
      quantity: 2,
      costEb: 100,
      equipped: true,
      description: 'Granada não letal que cega e ensurdece alvos que não possuem Anti-Dazzle e Level Damper.',
    },
  ],

  cyberdeck: {
    modelName: 'Raven Microcyber Phoenix MK.IV',
    hardwareSlots: 5,
    programSlots: 7,
    hardware: [
      {
        id: 'hw-1',
        name: 'Backup Drive',
        slots: 1,
        costEb: 100,
        effect: 'Protege um programa escolhido contra destruição permanente no combate virtual.',
        installed: true,
      },
      {
        id: 'hw-2',
        name: 'Hardened Circuitry',
        slots: 1,
        costEb: 100,
        effect: 'Blindagem de Faraday contra EMP e sobrecargas térmicas.',
        installed: true,
      },
    ],
    programs: [
      {
        id: 'prog-1',
        name: 'Sword',
        category: 'Attacker',
        classType: 'Anti-Program',
        slots: 1,
        costEb: 100,
        damageFormula: '3d6',
        effect: 'Lâmina afiada virtual que fatia programas e Black ICE (Dano: 3d6).',
        equipped: true,
      },
      {
        id: 'prog-2',
        name: 'Banhammer',
        category: 'Attacker',
        classType: 'Anti-Program',
        slots: 1,
        costEb: 100,
        damageFormula: '3d6',
        effect: 'Martelo virtual que causa 3d6 contra programas e 2d6 contra Black ICE.',
        equipped: true,
      },
      {
        id: 'prog-3',
        name: 'Armor',
        category: 'Defender',
        classType: 'Proteção',
        slots: 1,
        costEb: 100,
        defenseBonus: 4,
        effect: 'Reduz todo o dano recebido por programas em 4 pontos.',
        equipped: true,
      },
      {
        id: 'prog-4',
        name: 'Worm',
        category: 'Booster',
        classType: 'Infiltração',
        slots: 1,
        costEb: 100,
        attackBonus: 2,
        effect: '+2 em testes de Backdoor para furar firewalls e quebrar senhas.',
        equipped: true,
      },
      {
        id: 'prog-5',
        name: 'Speedbrute',
        category: 'Booster',
        classType: 'Velocidade',
        slots: 1,
        costEb: 100,
        attackBonus: 2,
        effect: '+2 em testes de Pathfinder durante varreduras na rede.',
        equipped: true,
      },
      {
        id: 'prog-6',
        name: 'Hellhound',
        category: 'Black ICE',
        classType: 'Anti-Personnel',
        slots: 2,
        costEb: 500,
        rezHp: 15,
        rezHpMax: 15,
        attackBonus: 6,
        defenseBonus: 2,
        damageFormula: '2d6',
        effect: 'Cão demoníaco em chamas digitais (HP 15, ATK 6, DEF 2, Dano: 2d6 direto no HP do Netrunner).',
        equipped: true,
        isBlackIce: true,
      },
    ],
  },

  skills: {
    // Awareness
    'Concentration': 3,
    'Conceal/Reveal Object': 4,
    'Perception': 6,
    'Tracking': 2,

    // Body
    'Athletics': 5,
    'Endurance': 4,
    'Resist Torture/Drugs': 4,
    'Stealth': 5,

    // Control
    'Drive Land Vehicle': 6,

    // Education
    'Education': 2,
    'Language - Streetslang': 5,
    'Language - Nativo': 4,
    'Local Expert': 5,
    'Tactics': 4,
    'Wilderness Survival': 2,

    // Fighting
    'Brawling': 4,
    'Evasion': 6,
    'Martial Arts [x2]': 3,
    'Melee Weapon': 5,

    // Performance
    'Acting': 1,

    // Ranged Weapon
    'Handgun': 6,
    'Shoulder Arms': 5,
    'Autofire [x2]': 3,

    // Social
    'Conversation': 3,
    'Human Perception': 4,
    'Interrogation': 3,
    'Persuasion': 3,
    'Streetwise': 6,
    'Trading': 3,
    'Wardrobe & Style': 3,

    // Technique
    'Basic Tech': 3,
    'Cybertech': 4,
    'First Aid': 4,
    'Weaponstech': 4,
  },

  cyberware: [
    {
      id: 'cw-1',
      name: 'Neuroport 2077 (Standard)',
      location: 'neuralware',
      hl: 0,
      costEb: 0,
      slots: 0,
      description: 'Interface neural padrão de Night City em 2077. Conexão holo, D-pad mental e biomonitor básico.',
      isDefault: true,
    },
    {
      id: 'cw-2',
      name: 'Sandevistan "Warp Dancer" OS',
      location: 'neuralware',
      hl: 7,
      costEb: 1000,
      slots: 1,
      description: 'Sistema operacional neural militar. Ao ser ativado desacelera a percepção temporal.',
    },
    {
      id: 'cw-3',
      name: 'Targeting Scope',
      location: 'cyberoptics',
      hl: 3,
      costEb: 500,
      slots: 1,
      description: 'Mira inteligente calibrada. Concede +1 em rolagens de ataque com armas de fogo.',
    },
    {
      id: 'cw-4',
      name: 'Image Enhance',
      location: 'cyberoptics',
      hl: 3,
      costEb: 500,
      slots: 1,
      description: 'Processador de contornos e contraste digital que concede +1 em testes de Percepção visual.',
    },
    {
      id: 'cw-5',
      name: 'Grafted Muscle and Bone Lace',
      location: 'internal',
      hl: 14,
      costEb: 1000,
      slots: 2,
      description: 'Enxerto de fibras musculares sintéticas e cerâmica na estrutura óssea. Concede +2 de BODY permanentemente!',
    },
    {
      id: 'cw-6',
      name: 'Subdermal Armor',
      location: 'external',
      hl: 14,
      costEb: 1000,
      slots: 3,
      description: 'Malha de placas de cerâmica e kevlar sob a epiderme. Fornece SP 11 constante no corpo.',
    },
    {
      id: 'cw-7',
      name: 'Rippers',
      location: 'cyberarm',
      hl: 7,
      costEb: 500,
      slots: 2,
      description: 'Lâminas retráteis duplas em cerâmica endurecida que se projetam dos antebraços (Dano: 2d6 Melee afiado).',
    },
    {
      id: 'cw-8',
      name: 'Jump Booster',
      location: 'cyberleg',
      hl: 7,
      costEb: 500,
      slots: 2,
      description: 'Pistões pneumáticos nos joelhos e calcanhares permitindo supersaltos verticais e absorção de impacto.',
    },
  ],
};

export function createBlankCharacter(): CharacterSheet {
  const emptySkills: Record<string, number> = {};
  OFFICIAL_SKILLS.forEach((skill) => {
    emptySkills[skill.name] = 0;
  });

  return {
    id: `cp2077-blank-${Date.now()}`,
    handle: '',
    realName: '',
    role: 'Solo',
    roleAbilityName: 'Combat Awareness',
    roleAbilityRank: 4,
    reputation: 0,
    eurobucks: 0,
    avatarUrl: '',
    notes: '',

    stats: {
      INT: 4,
      REF: 4,
      DEX: 4,
      TECH: 4,
      COOL: 4,
      WILL: 4,
      LUCK_CURRENT: 4,
      LUCK_MAX: 4,
      MOVE: 4,
      BODY: 4,
      EMP_BASE: 4,
    },

    hpCurrent: 30,
    deathSavePenalty: 0,

    armor: {
      head: {
        name: 'Nenhuma',
        spMax: 0,
        spCurrent: 0,
      },
      body: {
        name: 'Nenhuma',
        spMax: 0,
        spCurrent: 0,
      },
      shield: {
        hpMax: 0,
        hpCurrent: 0,
        equipped: false,
      },
      penalty: 0,
    },

    weapons: [],
    criticalInjuries: [],
    inventory: [], // Empty inventory!
    cyberware: [], // Empty cyberware!
    skills: emptySkills, // Every skill at 0!
    cyberdeck: {
      modelName: 'Cyberdeck Básico',
      hardwareSlots: 5,
      programSlots: 5,
      hardware: [],
      programs: [],
    },
  };
}

export const BLANK_CHARACTER: CharacterSheet = createBlankCharacter();
