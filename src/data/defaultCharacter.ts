import { CharacterSheet } from '../types/character';

export const DEFAULT_CHARACTER: CharacterSheet = {
  id: 'cp2077-v-solo-01',
  handle: 'V',
  realName: 'Valerie / Vincent',
  role: 'Solo',
  roleAbilityName: 'Combat Awareness',
  roleAbilityRank: 5,
  reputation: 4,
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
      name: 'Kiroshi Optics MK.III',
      location: 'cyberoptics_right',
      hl: 7,
      costEb: 1000,
      slots: 1,
      description: 'A lendária ótica Kiroshi de Night City. HUD cristalino, identificador facial e scanner.',
    },
    {
      id: 'cw-4',
      name: 'Targeting Scope',
      location: 'cyberoptics_right',
      hl: 3,
      costEb: 500,
      slots: 1,
      description: 'Mira inteligente calibrada. Concede +1 em rolagens de ataque com armas de fogo.',
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
      description: 'Malha de placas de kevlar flexível instalada sob a epiderme. Fornece SP 11 constante no corpo.',
    },
    {
      id: 'cw-7',
      name: 'Mantis Blades / Rippers',
      location: 'cyberarm_right',
      hl: 7,
      costEb: 500,
      slots: 2,
      description: 'Lâminas retráteis duplas em cerâmica endurecida que se projetam dos antebraços (Dano: 3d6 Melee afiado).',
    },
    {
      id: 'cw-8',
      name: 'Jump Boosters (Salto Fortificado)',
      location: 'cyberleg_right',
      hl: 7,
      costEb: 500,
      slots: 2,
      description: 'Pistões pneumáticos nos joelhos e calcanhares permitindo supersaltos verticais.',
    },
  ],
};
