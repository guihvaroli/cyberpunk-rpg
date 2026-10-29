import React, { useState } from 'react';
import { CharacterSheet, CyberdeckProgram, RollBreakdown } from '../types/character';
import { NET_ACTIONS, PRESET_PROGRAMS, PRESET_HARDWARE } from '../data/netrunningCatalog';
import { DamageRollResult, rollDamage } from '../utils/calculations';
import { sounds } from '../utils/audio';
import {
  Terminal,
  Cpu,
  Shield,
  Sword,
  Zap,
  Flame,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  Skull
} from 'lucide-react';

interface PageNetrunningProps {
  character: CharacterSheet;
  onUpdateCharacter: (updater: (prev: CharacterSheet) => CharacterSheet) => void;
  onTriggerSkillRoll: (roll: RollBreakdown) => void;
  onTriggerDamageRoll: (roll: DamageRollResult) => void;
}

export const PageNetrunning: React.FC<PageNetrunningProps> = ({
  character,
  onUpdateCharacter,
  onTriggerSkillRoll,
  onTriggerDamageRoll,
}) => {
  // Ensure character.cyberdeck exists with fallback defaults
  const deck = character.cyberdeck || {
    modelName: 'Raven Microcyber Phoenix MK.IV',
    hardwareSlots: 5,
    programSlots: 7,
    hardware: PRESET_HARDWARE.slice(0, 2),
    programs: PRESET_PROGRAMS.slice(0, 6).map((p, i) => ({
      ...p,
      id: `prog-${Date.now()}-${i}`,
    })),
  };

  const [activeCategory, setActiveCategory] = useState<'All' | 'Attacker' | 'Defender' | 'Booster' | 'Black ICE'>('All');
  const [showAddProgramModal, setShowAddProgramModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Custom program form
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState<CyberdeckProgram['category']>('Attacker');
  const [customClassType, setCustomClassType] = useState('Anti-Program');
  const [customSlots, setCustomSlots] = useState(1);
  const [customDamage, setCustomDamage] = useState('3d6');
  const [customAttackBonus, setCustomAttackBonus] = useState(0);
  const [customDefenseBonus, setCustomDefenseBonus] = useState(0);
  const [customRezHp, setCustomRezHp] = useState(0);
  const [customEffect, setCustomEffect] = useState('');

  const interfaceRank = character.role === 'Netrunner' ? (character.roleAbilityRank || 4) : 0;
  const usedProgramSlots = deck.programs
    .filter((p) => p.equipped)
    .reduce((acc, p) => acc + (p.slots || 1), 0);

  const filteredPrograms = deck.programs.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.effect.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Roll NET Action (Interface + 1d10)
  const handleRollNetAction = (actionName: string, extraBonus: number = 0) => {
    sounds.playDiceRoll();
    const d10 = Math.floor(Math.random() * 10) + 1;
    const explodedRolls: number[] = [];
    let currentRoll = d10;
    while (currentRoll === 10) {
      const nextRoll = Math.floor(Math.random() * 10) + 1;
      explodedRolls.push(nextRoll);
      currentRoll = nextRoll;
    }
    const fumbledRoll = d10 === 1 ? Math.floor(Math.random() * 10) + 1 : 0;
    const total = interfaceRank + extraBonus + d10 + (d10 === 10 ? explodedRolls.reduce((a, b) => a + b, 0) : 0) - fumbledRoll;

    const breakdown: RollBreakdown = {
      label: `Ação de Rede: ${actionName}`,
      baseStat: interfaceRank,
      statName: 'Interface',
      skillLevel: extraBonus,
      baseValue: interfaceRank + extraBonus,
      d10Roll: d10,
      explodedRolls,
      fumbledRoll,
      seriouslyWoundedPenalty: 0,
      total,
      isCritSuccess: d10 === 10,
      isCritFumble: d10 === 1,
      timestamp: Date.now(),
    };

    if (d10 === 10) setTimeout(() => sounds.playCritSuccess(), 250);
    if (d10 === 1) setTimeout(() => sounds.playCritFumble(), 250);

    onTriggerSkillRoll(breakdown);
  };

  // Roll Program Damage (e.g. 3d6)
  const handleRollProgramDamage = (prog: CyberdeckProgram) => {
    sounds.playDiceRoll();
    const result = rollDamage(prog.name, prog.damageFormula || '3d6');
    if (result.isCriticalInjury) {
      setTimeout(() => sounds.playCritSuccess(), 250);
    }
    onTriggerDamageRoll(result);
  };

  // Toggle program equipped in deck
  const handleToggleEquipped = (id: string) => {
    sounds.playClick();
    onUpdateCharacter((prev) => {
      const prevDeck = prev.cyberdeck || deck;
      const targetProg = prevDeck.programs.find((p) => p.id === id);
      if (!targetProg) return prev;

      // If equipping, check available slots
      if (!targetProg.equipped) {
        const currentlyUsed = prevDeck.programs
          .filter((p) => p.equipped)
          .reduce((a, b) => a + (b.slots || 1), 0);
        if (currentlyUsed + (targetProg.slots || 1) > prevDeck.programSlots) {
          alert(`Espaço insuficiente no Cyberdeck! Restam apenas ${prevDeck.programSlots - currentlyUsed} slot(s).`);
          return prev;
        }
      }

      return {
        ...prev,
        cyberdeck: {
          ...prevDeck,
          programs: prevDeck.programs.map((p) =>
            p.id === id ? { ...p, equipped: !p.equipped } : p
          ),
        },
      };
    });
  };

  // Adjust Rez HP (for Black ICE)
  const handleAdjustRezHp = (id: string, delta: number) => {
    sounds.playClick();
    onUpdateCharacter((prev) => {
      const prevDeck = prev.cyberdeck || deck;
      return {
        ...prev,
        cyberdeck: {
          ...prevDeck,
          programs: prevDeck.programs.map((p) => {
            if (p.id === id && p.rezHpMax) {
              const newHp = Math.max(0, Math.min(p.rezHpMax, (p.rezHp ?? p.rezHpMax) + delta));
              return { ...p, rezHp: newHp };
            }
            return p;
          }),
        },
      };
    });
  };

  // Delete program
  const handleDeleteProgram = (id: string, name: string) => {
    if (confirm(`Desinstalar o programa "${name}" da memória do Cyberdeck?`)) {
      sounds.playClick();
      onUpdateCharacter((prev) => {
        const prevDeck = prev.cyberdeck || deck;
        return {
          ...prev,
          cyberdeck: {
            ...prevDeck,
            programs: prevDeck.programs.filter((p) => p.id !== id),
          },
        };
      });
    }
  };

  // Install Preset program from catalog
  const handleInstallPreset = (preset: typeof PRESET_PROGRAMS[0]) => {
    sounds.playEquipCyberware();
    const newProg: CyberdeckProgram = {
      ...preset,
      id: `prog-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      equipped: usedProgramSlots + (preset.slots || 1) <= deck.programSlots,
    };

    onUpdateCharacter((prev) => {
      const prevDeck = prev.cyberdeck || deck;
      return {
        ...prev,
        cyberdeck: {
          ...prevDeck,
          programs: [...prevDeck.programs, newProg],
        },
      };
    });
  };

  // Add custom program
  const handleAddCustomProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    sounds.playEquipCyberware();
    const newProg: CyberdeckProgram = {
      id: `prog-custom-${Date.now()}`,
      name: customName.trim(),
      category: customCategory,
      classType: customClassType.trim() || 'Script Customizado',
      slots: Number(customSlots) || 1,
      costEb: 100,
      damageFormula: customDamage.trim() || '2d6',
      attackBonus: Number(customAttackBonus) || 0,
      defenseBonus: Number(customDefenseBonus) || 0,
      rezHp: Number(customRezHp) || (customCategory === 'Black ICE' ? 15 : undefined),
      rezHpMax: Number(customRezHp) || (customCategory === 'Black ICE' ? 15 : undefined),
      effect: customEffect.trim() || 'Programa customizado injetado na memória do deck.',
      equipped: true,
      isBlackIce: customCategory === 'Black ICE',
    };

    onUpdateCharacter((prev) => {
      const prevDeck = prev.cyberdeck || deck;
      return {
        ...prev,
        cyberdeck: {
          ...prevDeck,
          programs: [...prevDeck.programs, newProg],
        },
      };
    });

    // Reset
    setCustomName('');
    setCustomEffect('');
    setShowAddProgramModal(false);
  };

  // Toggle hardware
  const handleToggleHardware = (id: string) => {
    sounds.playClick();
    onUpdateCharacter((prev) => {
      const prevDeck = prev.cyberdeck || deck;
      return {
        ...prev,
        cyberdeck: {
          ...prevDeck,
          hardware: prevDeck.hardware.map((h) =>
            h.id === id ? { ...h, installed: !h.installed } : h
          ),
        },
      };
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      
      {/* ================= 1. CYBERDECK HUD BANNER ================= */}
      <section className="bg-[#0b1015] border-2 border-emerald-500/60 p-5 rounded-lg cyber-chamfer relative overflow-hidden shadow-[0_0_25px_rgba(16,185,129,0.2)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-500/30 pb-4 mb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded bg-emerald-950/80 border border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]">
              <Terminal size={24} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/50">
                  INTERFACE RANK {interfaceRank}
                </span>
                <span className="text-xs font-mono text-slate-400">NET ARCHITECTURE v3.0</span>
              </div>
              <h2 className="text-xl font-black font-orbitron text-slate-100 uppercase tracking-wider flex items-center gap-2">
                {deck.modelName}
              </h2>
            </div>
          </div>

          {/* Quick Deck Slots Gauges */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Program Slots */}
            <div className="bg-[#0d141b] border border-[#1e2e3d] px-4 py-2 rounded font-mono text-xs text-right">
              <span className="text-slate-400 block text-[10px]">SLOTS DE PROGRAMAS</span>
              <div className="text-base font-bold font-orbitron">
                <span className={usedProgramSlots >= deck.programSlots ? 'text-red-400' : 'text-emerald-400'}>
                  {usedProgramSlots}
                </span>
                <span className="text-slate-500"> / {deck.programSlots}</span>
              </div>
            </div>

            {/* Jack In Action Quick Roll */}
            <button
              onClick={() => handleRollNetAction('Jack In / Scanner de Rede')}
              className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-orbitron font-bold text-xs uppercase flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all"
            >
              <Zap size={15} /> Rolar Interface (1d10 + {interfaceRank})
            </button>
          </div>
        </div>

        {/* Deck Hardware Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-mono text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Cpu size={14} className="text-emerald-400" />
            <span className="text-slate-300 font-bold">Hardware Instalado:</span>
            {deck.hardware.map((hw) => (
              <button
                key={hw.id}
                onClick={() => handleToggleHardware(hw.id)}
                className={`px-2 py-0.5 rounded border text-[11px] transition-all flex items-center gap-1 ${
                  hw.installed
                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                    : 'bg-[#10141a] border-slate-700 text-slate-500 line-through'
                }`}
                title={hw.effect}
              >
                {hw.name}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-emerald-400 font-bold">
            CONEXÃO NEURAL SEGURA // SEM CHOQUE
          </div>
        </div>
      </section>

      {/* ================= 2. MATRIZ DE AÇÕES DE REDE (NET ACTIONS) ================= */}
      <section className="bg-[#0f121a] border border-[#232738] p-5 rounded-lg cyber-chamfer space-y-3 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#232738] pb-2.5">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-cyan-400" />
            <h3 className="font-orbitron font-bold text-sm text-slate-100 uppercase tracking-wider">
              AÇÕES DE REDE (NET ACTIONS // REGRAS OFICIAIS RED)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Fórmula: 1d10 + Rank de Interface ({interfaceRank})
          </span>
        </div>

        {/* Grid of Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {NET_ACTIONS.map((act, idx) => (
            <div
              key={idx}
              className="bg-[#0a0c12] border border-[#1d2233] hover:border-emerald-500/50 p-2.5 rounded flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-1 mb-1">
                  <span className="font-bold text-xs text-slate-200 group-hover:text-emerald-300">
                    {act.name}
                  </span>
                  {act.dv && (
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-800 text-yellow-400">
                      {act.dv}
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-mono text-slate-400 line-clamp-2">
                  {act.description}
                </p>
              </div>

              <button
                onClick={() => handleRollNetAction(act.name)}
                className="mt-2 w-full py-1 rounded bg-[#131722] hover:bg-emerald-950/80 border border-slate-700 hover:border-emerald-500 text-emerald-400 font-mono text-[11px] font-bold flex items-center justify-center gap-1 transition-all"
              >
                <Play size={10} /> Executar
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 3. REPERTÓRIO DE HACKS E PROGRAMAS ================= */}
      <section className="bg-[#12131a] border border-[#232738] p-5 rounded-lg cyber-chamfer space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#232738] pb-3">
          <div>
            <h3 className="font-orbitron font-bold text-base text-slate-100 uppercase flex items-center gap-2">
              <Sword size={18} className="text-emerald-400" />
              Repertório de Hacks & Programas ({deck.programs.length})
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Gerencie programas carregados na memória do deck, dispare ataques de dados e controle Black ICE autônomo.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { sounds.playClick(); setShowAddProgramModal(true); }}
              className="px-3.5 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-orbitron font-bold text-xs uppercase flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
            >
              <Plus size={14} /> Carregar Novo Hack / Programa
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0a0a0f] p-2.5 rounded border border-[#1e2333]">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {(['All', 'Attacker', 'Defender', 'Booster', 'Black ICE'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => { sounds.playClick(); setActiveCategory(cat); }}
                className={`px-3 py-1 rounded font-orbitron text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-emerald-500 text-black shadow-sm'
                    : 'bg-[#141824] text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'All' ? 'Todos' :
                 cat === 'Attacker' ? 'Ataque' :
                 cat === 'Defender' ? 'Defesa' :
                 cat === 'Booster' ? 'Boosters' : 'Black ICE'}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar hack por nome ou efeito..."
            className="bg-[#121520] border border-[#23283d] px-3 py-1 rounded text-xs text-slate-200 focus:border-emerald-400 focus:outline-none w-full sm:w-64"
          />
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredPrograms.map((prog) => {
            const isAttacker = prog.category === 'Attacker';
            const isDefender = prog.category === 'Defender';
            const isBooster = prog.category === 'Booster';
            const isBlackIce = prog.category === 'Black ICE';

            return (
              <div
                key={prog.id}
                className={`bg-[#0a0c13] border p-3.5 rounded cyber-chamfer flex flex-col justify-between transition-all duration-200 ${
                  prog.equipped
                    ? isBlackIce
                      ? 'border-red-500/60 shadow-[0_0_12px_rgba(239,68,68,0.15)] ring-1 ring-red-500/30'
                      : 'border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/20'
                    : 'border-[#222738] opacity-60'
                }`}
              >
                <div>
                  {/* Top Bar: Category badge & Delete */}
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                          isAttacker
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : isDefender
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : isBooster
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                            : 'bg-purple-950 text-purple-300 border border-purple-800'
                        }`}
                      >
                        {prog.category}
                      </span>
                      {prog.classType && (
                        <span className="text-[9px] font-mono text-slate-400">
                          {prog.classType}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteProgram(prog.id, prog.name)}
                      className="text-slate-500 hover:text-red-400 p-1"
                      title="Desinstalar programa"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Program Title & Slots */}
                  <div className="flex items-baseline justify-between mb-1">
                    <h4 className="font-orbitron font-bold text-sm text-slate-100 flex items-center gap-1.5">
                      {isBlackIce && <Skull size={14} className="text-red-400" />}
                      {prog.name}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">
                      {prog.slots} {prog.slots === 1 ? 'Slot' : 'Slots'}
                    </span>
                  </div>

                  {/* Description / Effect */}
                  <p className="text-xs font-mono text-slate-300 mt-1 leading-relaxed">
                    {prog.effect}
                  </p>

                  {/* Black ICE Rez HP Counter */}
                  {isBlackIce && prog.rezHpMax && (
                    <div className="mt-2.5 p-2 bg-[#121520] rounded border border-red-950 flex items-center justify-between text-xs font-mono">
                      <span className="text-red-400 font-bold">REZ HP: {prog.rezHp}/{prog.rezHpMax}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleAdjustRezHp(prog.id, -2)}
                          className="px-2 py-0.5 rounded bg-red-950 hover:bg-red-900 text-red-300 font-bold"
                          title="Sofrer 2 dano"
                        >
                          -2
                        </button>
                        <button
                          onClick={() => handleAdjustRezHp(prog.id, 2)}
                          className="px-2 py-0.5 rounded bg-green-950 hover:bg-green-900 text-green-300 font-bold"
                          title="Curar 2 REZ"
                        >
                          +2
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Control Buttons */}
                <div className="mt-3.5 pt-2.5 border-t border-[#1a1f2e] flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                  {/* Loaded toggle */}
                  <button
                    onClick={() => handleToggleEquipped(prog.id)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 ${
                      prog.equipped
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                        : 'bg-[#151926] text-slate-400 hover:text-slate-200 border border-slate-700'
                    }`}
                  >
                    <CheckCircle2 size={12} className={prog.equipped ? 'text-emerald-400' : 'text-slate-600'} />
                    {prog.equipped ? 'Carregado no Deck' : 'Na Memória'}
                  </button>

                  <div className="flex items-center gap-1.5 ml-auto">
                    {/* Attack roll button */}
                    {(isAttacker || isBlackIce) && (
                      <button
                        onClick={() => handleRollNetAction(`Ataque c/ ${prog.name}`, prog.attackBonus || 0)}
                        className="px-2 py-1 rounded bg-[#151a24] hover:bg-red-950/70 text-red-300 border border-red-500/40 text-[10px] font-bold"
                        title="Rolar Teste de Ataque na Rede"
                      >
                        Ataque (1d10)
                      </button>
                    )}

                    {/* Damage roll button */}
                    {prog.damageFormula && (
                      <button
                        onClick={() => handleRollProgramDamage(prog)}
                        className="px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-orbitron text-[10px] font-bold flex items-center gap-1"
                        title={`Rolar Dano (${prog.damageFormula})`}
                      >
                        <Flame size={11} /> {prog.damageFormula}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= MODAL: ADICIONAR PROGRAMA DO CATÁLOGO OU CUSTOM ================= */}
      {showAddProgramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#0c0f16] border-2 border-emerald-500 cyber-chamfer p-6 relative shadow-[0_0_30px_rgba(16,185,129,0.3)] max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-black font-orbitron text-emerald-400 uppercase mb-3 flex items-center gap-2">
              <Terminal size={20} /> Carregar Novo Hack / Programa para o Deck
            </h3>

            {/* Quick Presets Catalog */}
            <div className="mb-5">
              <span className="text-[11px] font-mono text-slate-400 uppercase block mb-2">
                Programas Oficiais de Cyberpunk RED (Clique para instalar):
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {PRESET_PROGRAMS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleInstallPreset(p)}
                    className="text-left bg-[#10131d] hover:bg-emerald-950/40 p-2 rounded border border-[#20273a] hover:border-emerald-500 transition-all font-mono text-xs flex justify-between items-start group"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-200 group-hover:text-emerald-300">
                          {p.name}
                        </span>
                        <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-400">
                          {p.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block line-clamp-1 mt-0.5">
                        {p.effect}
                      </span>
                    </div>
                    <span className="text-[10px] text-yellow-400 font-bold ml-2">
                      {p.damageFormula || `${p.slots} slot`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom program form */}
            <form onSubmit={handleAddCustomProgram} className="space-y-3 font-mono text-xs pt-4 border-t border-[#232738]">
              <span className="text-[11px] font-mono text-slate-400 uppercase block">
                Ou Compilar um Script Customizado:
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Nome do Programa</label>
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Ex: NetBlade, Cyberscan, Daemon..."
                    className="w-full bg-[#07090f] border border-[#282d42] px-3 py-2 rounded text-slate-100 focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Categoria</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as any)}
                    className="w-full bg-[#07090f] border border-[#282d42] px-3 py-2 rounded text-slate-100 focus:border-emerald-400 focus:outline-none"
                  >
                    <option value="Attacker">Ataque (Attacker)</option>
                    <option value="Defender">Defesa (Defender)</option>
                    <option value="Booster">Booster / Utilitário</option>
                    <option value="Black ICE">Black ICE Autônomo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Slots</label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={customSlots}
                    onChange={(e) => setCustomSlots(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#07090f] border border-[#282d42] px-3 py-2 rounded text-slate-100 focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Fórmula Dano</label>
                  <input
                    type="text"
                    value={customDamage}
                    onChange={(e) => setCustomDamage(e.target.value)}
                    placeholder="Ex: 3d6, 2d6"
                    className="w-full bg-[#07090f] border border-[#282d42] px-3 py-2 rounded text-red-400 font-bold focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">REZ HP (Black ICE)</label>
                  <input
                    type="number"
                    value={customRezHp}
                    onChange={(e) => setCustomRezHp(parseInt(e.target.value) || 0)}
                    placeholder="Ex: 15"
                    className="w-full bg-[#07090f] border border-[#282d42] px-3 py-2 rounded text-slate-100 focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Efeito do Hack</label>
                <textarea
                  rows={2}
                  value={customEffect}
                  onChange={(e) => setCustomEffect(e.target.value)}
                  placeholder="Descreva a função, dano, bônus ou condições infligidas..."
                  className="w-full bg-[#07090f] border border-[#282d42] px-3 py-2 rounded text-slate-100 focus:border-emerald-400 focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProgramModal(false)}
                  className="flex-1 py-2 rounded bg-slate-800 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded bg-emerald-500 text-black font-orbitron font-bold uppercase hover:bg-emerald-400"
                >
                  Salvar Hack
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
