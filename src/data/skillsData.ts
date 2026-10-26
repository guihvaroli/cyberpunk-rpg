import { SkillDefinition } from '../types/character';

export const OFFICIAL_SKILLS: SkillDefinition[] = [
  // Awareness
  { name: 'Concentration', stat: 'WILL', category: 'Awareness', description: 'Capacidade de foco, superar distrações e sustentar força mental.' },
  { name: 'Conceal/Reveal Object', stat: 'INT', category: 'Awareness', description: 'Esconder objetos no corpo/ambiente ou detectar objetos ocultos.' },
  { name: 'Lip Reading', stat: 'INT', category: 'Awareness', description: 'Leitura labial à distância sem ouvir o som.' },
  { name: 'Perception', stat: 'INT', category: 'Awareness', description: 'Atenção geral para ver, ouvir ou notar perigos sutis ao redor.' },
  { name: 'Tracking', stat: 'INT', category: 'Awareness', description: 'Rastrear pessoas ou criaturas através de pegadas e rastros.' },

  // Body
  { name: 'Athletics', stat: 'DEX', category: 'Body', description: 'Correr, saltar, escalar, nadar e lançar objetos.' },
  { name: 'Contortionist', stat: 'DEX', category: 'Body', description: 'Escapar de amarras ou contorcer-se em espaços apertados.' },
  { name: 'Dance', stat: 'DEX', category: 'Body', description: 'Dança coreografada ou improvisada em pistas de clubes de Night City.' },
  { name: 'Endurance', stat: 'WILL', category: 'Body', description: 'Resistir à exaustão física, fome, sede e sono.' },
  { name: 'Resist Torture/Drugs', stat: 'WILL', category: 'Body', description: 'Resistência mental e física contra interrogatórios brutais e narcóticos.' },
  { name: 'Stealth', stat: 'DEX', category: 'Body', description: 'Mover-se silenciosamente e permanecer oculto nas sombras.' },

  // Control
  { name: 'Drive Land Vehicle', stat: 'REF', category: 'Control', description: 'Operar carros, motos, caminhões e veículos terrestres.' },
  { name: 'Pilot Air Vehicle [x2]', stat: 'REF', category: 'Control', isDoubleCost: true, description: 'Pilotar AVs, helicópteros, jatos e aeródinos (Custo x2).' },
  { name: 'Pilot Sea Vehicle', stat: 'REF', category: 'Control', description: 'Pilotar lanchas, iates, hovercrafts e submarinos.' },
  { name: 'Riding', stat: 'REF', category: 'Control', description: 'Montar animais vivos ou cibernéticos (cavalos, feras biogenéticas).' },

  // Education
  { name: 'Accounting', stat: 'INT', category: 'Education', description: 'Contabilidade, lavagem de eurobucks e auditoria financeira.' },
  { name: 'Animal Handling', stat: 'INT', category: 'Education', description: 'Treinamento e acalmar animais domésticos e exóticos.' },
  { name: 'Bureaucracy', stat: 'INT', category: 'Education', description: 'Navegar em sistemas corporativos, policiais e governamentais.' },
  { name: 'Business', stat: 'INT', category: 'Education', description: 'Conhecimento de mercados, cadeias de suprimentos e megacorps.' },
  { name: 'Composition', stat: 'INT', category: 'Education', description: 'Escrever canções, artigos de mídia, discursos ou poesia.' },
  { name: 'Criminology', stat: 'INT', category: 'Education', description: 'Investigação forense, perfil psicológico e pistas criminais.' },
  { name: 'Cryptography', stat: 'INT', category: 'Education', description: 'Decifrar códigos, cifras e sistemas de segurança lógica.' },
  { name: 'Deduction', stat: 'INT', category: 'Education', description: 'Conectar pistas e tirar conclusões lógicas precisas.' },
  { name: 'Education', stat: 'INT', category: 'Education', description: 'Conhecimento geral sobre ciências, história e o mundo pré-Guerra.' },
  { name: 'Gamble', stat: 'INT', category: 'Education', description: 'Jogos de azar, apostas e cálculo de probabilidades em cassinos.' },
  { name: 'Language - Streetslang', stat: 'INT', category: 'Education', description: 'Gíria das ruas de Night City, jargão cyberpunk e dialeto urbano.' },
  { name: 'Language - Nativo', stat: 'INT', category: 'Education', description: 'Língua materna do personagem.' },
  { name: 'Library Search', stat: 'INT', category: 'Education', description: 'Pesquisar arquivos, dataterms e bancos de dados locais.' },
  { name: 'Local Expert', stat: 'INT', category: 'Education', description: 'Conhecimento aprofundado sobre um distrito específico de Night City.' },
  { name: 'Science', stat: 'INT', category: 'Education', description: 'Física, química, matemática e biologia teórica.' },
  { name: 'Tactics', stat: 'INT', category: 'Education', description: 'Doutrina militar, planejamento tático de esquadrão e emboscadas.' },
  { name: 'Wilderness Survival', stat: 'INT', category: 'Education', description: 'Sobrevivência nas Badlands, tempestades de areia e terras devastadas.' },

  // Fighting
  { name: 'Brawling', stat: 'DEX', category: 'Fighting', description: 'Combate corpo a corpo desarmado (socos, chutes, agarrões).' },
  { name: 'Evasion', stat: 'DEX', category: 'Fighting', description: 'Esquivar de ataques corpo a corpo e tiros (se REF >= 8).' },
  { name: 'Martial Arts [x2]', stat: 'DEX', category: 'Fighting', isDoubleCost: true, description: 'Artes marciais avançadas (Karatê, Judô, Taekwondo, Boxe - Custo x2).' },
  { name: 'Melee Weapon', stat: 'DEX', category: 'Fighting', description: 'Facas, katanas, bastões, machados e lâminas cibernéticas.' },

  // Performance
  { name: 'Acting', stat: 'COOL', category: 'Performance', description: 'Atuação, fingir emoções e interpretar disfarces.' },
  { name: 'Play Instrument', stat: 'TECH', category: 'Performance', description: 'Tocar guitarra, sintetizador, bateria ou instrumentos musicais.' },

  // Ranged Weapon
  { name: 'Archery', stat: 'REF', category: 'Ranged Weapon', description: 'Arcos e bestas modernas de combate silencioso.' },
  { name: 'Autofire [x2]', stat: 'REF', category: 'Ranged Weapon', isDoubleCost: true, description: 'Disparo em rajada contínua com submetralhadoras e fuzis (Custo x2).' },
  { name: 'Handgun', stat: 'REF', category: 'Ranged Weapon', description: 'Pistolas leves, pesadas e revólveres de alta potência.' },
  { name: 'Heavy Weapons [x2]', stat: 'REF', category: 'Ranged Weapon', isDoubleCost: true, description: 'Lança-foguetes, canhões de riel, miniguns e metralhadoras (Custo x2).' },
  { name: 'Shoulder Arms', stat: 'REF', category: 'Ranged Weapon', description: 'Fuzis de assalto, rifles de precisão e escopetas.' },

  // Social
  { name: 'Bribery', stat: 'COOL', category: 'Social', description: 'Saber a quantia certa e a pessoa certa para subornar em Night City.' },
  { name: 'Conversation', stat: 'EMP', category: 'Social', description: 'Extrair informações de maneira casual através de bate-papo.' },
  { name: 'Human Perception', stat: 'EMP', category: 'Social', description: 'Ler intenções, detectar mentiras e microexpressões humanas.' },
  { name: 'Interrogation', stat: 'COOL', category: 'Social', description: 'Arrancar a verdade de prisioneiros sob pressão.' },
  { name: 'Persuasion', stat: 'COOL', category: 'Social', description: 'Convencer alguém a aceitar seu ponto de vista ou proposta.' },
  { name: 'Personal Grooming', stat: 'COOL', category: 'Social', description: 'Aparência, cuidados pessoais e estilo atraente.' },
  { name: 'Streetwise', stat: 'COOL', category: 'Social', description: 'Conhecer os códigos das gangues, fixers, becos e mercado negro.' },
  { name: 'Trading', stat: 'COOL', category: 'Social', description: 'Negociação de preços, compra e venda de equipamento.' },
  { name: 'Wardrobe & Style', stat: 'COOL', category: 'Social', description: 'Roupas na moda, atitude e estética do futuro sombrio.' },

  // Technique
  { name: 'Air Vehicle Tech', stat: 'TECH', category: 'Technique', description: 'Reparo e modificação de veículos aéreos (AVs).' },
  { name: 'Basic Tech', stat: 'TECH', category: 'Technique', description: 'Construir, consertar e modificar equipamentos comuns do cotidiano.' },
  { name: 'Cybertech', stat: 'TECH', category: 'Technique', description: 'Manutenção, instalação e reparo de próteses e cibernéticos.' },
  { name: 'Demolitions [x2]', stat: 'TECH', category: 'Technique', isDoubleCost: true, description: 'Fabricação, manuseio e desativação de explosivos plásticos e C4 (Custo x2).' },
  { name: 'Electronics/Security Tech [x2]', stat: 'TECH', category: 'Technique', isDoubleCost: true, description: 'Invadir cofres eletrônicos, desativar alarmes e consertar chips (Custo x2).' },
  { name: 'First Aid', stat: 'TECH', category: 'Technique', description: 'Curar ferimentos leves, estabilizar personagens em Death Save.' },
  { name: 'Forgery', stat: 'TECH', category: 'Technique', description: 'Falsificar identidades virtuais, credenciais corporativas e documentos.' },
  { name: 'Land Vehicle Tech', stat: 'TECH', category: 'Technique', description: 'Reparo mecânico de motos, carros e caminhões.' },
  { name: 'Paint/Draw/Sculpt', stat: 'TECH', category: 'Technique', description: 'Arte plástica, grafites urbanos e tatuagens digitais.' },
  { name: 'Paramedic [x2]', stat: 'TECH', category: 'Technique', isDoubleCost: true, description: 'Medicina de campo avançada, tratamento de ferimentos críticos (Custo x2).' },
  { name: 'Photography/Film', stat: 'TECH', category: 'Technique', description: 'Operar câmeras óticas, drones de gravação e edição de holovídeo.' },
  { name: 'Pick Lock', stat: 'TECH', category: 'Technique', description: 'Abrir fechaduras mecânicas e magnéticas convencionais.' },
  { name: 'Pick Pocket', stat: 'TECH', category: 'Technique', description: 'Furtar bolsos e passar despercebido em aglomerações.' },
  { name: 'Sea Vehicle Tech', stat: 'TECH', category: 'Technique', description: 'Reparo e manutenção de embarcações navais.' },
  { name: 'Weaponstech', stat: 'TECH', category: 'Technique', description: 'Manutenção, customização e calibração de armas de fogo e lâminas.' },
];

export const SKILL_CATEGORIES = [
  'Awareness',
  'Body',
  'Control',
  'Education',
  'Fighting',
  'Performance',
  'Ranged Weapon',
  'Social',
  'Technique',
] as const;
