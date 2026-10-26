import React, { useState } from 'react';
import type { CharacterSheet, CriticalInjury, RoleName, Weapon } from '../types/character';
import { ROLE_ABILITIES, calculateEffectiveStats, calculateHumanityAndEmp, calculateMaxHp, calculateSeriouslyWoundedThreshold, rollDamage } from '../utils/calculations';
import type { DamageRollResult } from '../utils/calculations';
import { sounds } from '../utils/audio';
import { 
  Heart, 
  Shield, 
  Skull, 
  Plus, 
  Minus, 
  Trash2, 
  Flame, 
  AlertTriangle, 
  RotateCcw,
  Sword,
  Wrench,
  ChevronDown
} from 'lucide-react';

interface PageMainProps {
  character: CharacterSheet;
  onUpdateCharacter: (updater: (prev: CharacterSheet) => CharacterSheet) => void;
  onTriggerDamageRoll: (roll: DamageRollResult) => void;
}

interface StatItem {
  key: keyof CharacterSheet['stats'];
  label: string;
  desc: string;
  baseVal: number;
  effVal: number;
  isLuck?: boolean;
  isEmp?: boolean;
}

const CRITICAL_INJURY_PRESETS = [
  { name: 'Fratura Exposta no Braço', location: 'Braço', effect: 'Incapaz de segurar armas pesadas com duas mãos ou manipular objetos pesados.' },
  { name: 'Concussão Severa', location: 'Cabeça', effect: '-2 em todos os testes mentais e Percepção até cirurgia/estabilização.' },
  { name: 'Fragmento Metálico Alojado', location: 'Torso', effect: 'Ao realizar ação de movimento duplo ou esforço físico, sofre 2 de dano direto no HP.' },
  { name: 'Corte Arterial Aberto', location: 'Perna', effect: 'Sangramento: sofre 2 pontos de dano direto a cada turno no combate.' },
  { name: 'Curto-Circuito em Cromo', location: 'Cibernético', effect: 'Implante inoperante até reparo de Cybertech (DV 13).' },
  { name: 'Vício Sintético em Black Lace', location: 'Químico', effect: 'Exige dose diária; na abstinência sofre -2 em COOL e WILL e paranoia.' },
];

export const PageMain: React.FC<PageMainProps> = ({
  character,
  onUpdateCharacter,
  onTriggerDamageRoll,
}) => {
  const effectiveStats = calculateEffectiveStats(character);
  const humanity = calculateHumanityAndEmp(character);
  const maxHp = calculateMaxHp(effectiveStats.BODY, character.stats.WILL);
  const seriouslyWoundedThreshold = calculateSeriouslyWoundedThreshold(maxHp);
  const isSeriouslyWounded = character.hpCurrent <= seriouslyWoundedThreshold;
  const isAtZeroHp = character.hpCurrent <= 0;

  // New Weapon form state
  const [showAddWeaponModal, setShowAddWeaponModal] = useState(false);
  const [newWeaponName, setNewWeaponName] = useState('');
  const [newWeaponType, setNewWeaponType] = useState<Weapon['type']>('Pistol');
  const [newWeaponDamage, setNewWeaponDamage] = useState('3d6');
  const [newWeaponAmmo, setNewWeaponAmmo] = useState(10);
  const [newWeaponRof, setNewWeaponRof] = useState(2);
  const [newWeaponNotes, setNewWeaponNotes] = useState('');

  // Critical injury custom form
  const [showAddInjuryModal, setShowAddInjuryModal] = useState(false);
  const [newInjuryName, setNewInjuryName] = useState('');
  const [newInjuryLocation, setNewInjuryLocation] = useState('Torso');
  const [newInjuryEffect, setNewInjuryEffect] = useState('');

  // Handle Role Change
  const handleRoleChange = (newRole: RoleName) => {
    sounds.playClick();
    const ability = ROLE_ABILITIES[newRole];
    onUpdateCharacter((prev) => ({
      ...prev,
      role: newRole,
      roleAbilityName: ability.name,
    }));
  };

  // Adjust Stats
  const handleStatChange = (key: keyof typeof character.stats, val: number) => {
    sounds.playClick();
    onUpdateCharacter((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        [key]: Math.max(1, Math.min(10, val)),
      },
    }));
  };

  // Luck Controls
  const handleLuckCurrentChange = (delta: number) => {
    sounds.playClick();
    onUpdateCharacter((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        LUCK_CURRENT: Math.max(0, Math.min(prev.stats.LUCK_MAX, prev.stats.LUCK_CURRENT + delta)),
      },
    }));
  };

  const handleLuckMaxChange = (delta: number) => {
    sounds.playClick();
    onUpdateCharacter((prev) => {
      const newMax = Math.max(1, Math.min(10, prev.stats.LUCK_MAX + delta));
      const newCurrent = prev.stats.LUCK_CURRENT > newMax
        ? newMax
        : prev.stats.LUCK_CURRENT === prev.stats.LUCK_MAX
        ? newMax
        : prev.stats.LUCK_CURRENT;
      return {
        ...prev,
        stats: {
          ...prev.stats,
          LUCK_MAX: newMax,
          LUCK_CURRENT: newCurrent,
        },
      };
    });
  };

  const handleLuckReset = () => {
    sounds.playClick();
    onUpdateCharacter((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        LUCK_CURRENT: prev.stats.LUCK_MAX,
      },
    }));
  };

  // HP Controls
  const handleHpChange = (delta: number) => {
    sounds.playClick();
    onUpdateCharacter((prev) => ({
      ...prev,
      hpCurrent: Math.max(0, Math.min(maxHp, prev.hpCurrent + delta)),
    }));
  };

  // Armor ablation (-1 SP)
  const handleAblateArmor = (piece: 'head' | 'body') => {
    sounds.playAblateArmor();
    onUpdateCharacter((prev) => ({
      ...prev,
      armor: {
        ...prev.armor,
        [piece]: {
          ...prev.armor[piece],
          spCurrent: Math.max(0, prev.armor[piece].spCurrent - 1),
        },
      },
    }));
  };

  // Armor repair
  const handleRepairArmor = (piece: 'head' | 'body') => {
    sounds.playClick();
    onUpdateCharacter((prev) => ({
      ...prev,
      armor: {
        ...prev.armor,
        [piece]: {
          ...prev.armor[piece],
          spCurrent: prev.armor[piece].spMax,
        },
      },
    }));
  };

  // Weapon ammo actions
  const handleFireWeapon = (id: string, amount: number = 1) => {
    sounds.playClick();
    onUpdateCharacter((prev) => ({
      ...prev,
      weapons: prev.weapons.map((w) => {
        if (w.id === id) {
          return {
            ...w,
            ammoCurrent: Math.max(0, w.ammoCurrent - amount),
          };
        }
        return w;
      }),
    }));
  };

  const handleReloadWeapon = (id: string) => {
    sounds.playClick();
    onUpdateCharacter((prev) => ({
      ...prev,
      weapons: prev.weapons.map((w) => {
        if (w.id === id) {
          return {
            ...w,
            ammoCurrent: w.ammoMax,
          };
        }
        return w;
      }),
    }));
  };

  // Weapon damage roll
  const handleRollWeaponDamage = (weapon: Weapon) => {
    sounds.playDiceRoll();
    const result = rollDamage(weapon.name, weapon.damage);
    if (result.isCriticalInjury) {
      setTimeout(() => sounds.playCritSuccess(), 250);
    }
    onTriggerDamageRoll(result);
  };

  // Add Weapon
  const handleAddWeapon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeaponName.trim()) return;

    sounds.playClick();
    const newWeapon: Weapon = {
      id: 'w-' + Date.now(),
      name: newWeaponName.trim(),
      type: newWeaponType,
      damage: newWeaponDamage.trim() || '3d6',
      ammoCurrent: newWeaponAmmo,
      ammoMax: newWeaponAmmo,
      rof: newWeaponRof,
      notes: newWeaponNotes.trim(),
      equipped: true,
    };

    onUpdateCharacter((prev) => ({
      ...prev,
      weapons: [...prev.weapons, newWeapon],
    }));

    // Reset
    setNewWeaponName('');
    setNewWeaponNotes('');
    setShowAddWeaponModal(false);
  };

  // Remove Weapon
  const handleRemoveWeapon = (id: string) => {
    sounds.playClick();
    onUpdateCharacter((prev) => ({
      ...prev,
      weapons: prev.weapons.filter((w) => w.id !== id),
    }));
  };

  // Add Critical Injury
  const handleAddInjury = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInjuryName.trim()) return;

    sounds.playClick();
    const newInjury: CriticalInjury = {
      id: 'inj-' + Date.now(),
      name: newInjuryName.trim(),
      location: newInjuryLocation.trim(),
      effect: newInjuryEffect.trim() || 'Penalidade tática de combate.',
      treated: false,
    };

    onUpdateCharacter((prev) => ({
      ...prev,
      criticalInjuries: [...prev.criticalInjuries, newInjury],
    }));

    setNewInjuryName('');
    setNewInjuryEffect('');
    setShowAddInjuryModal(false);
  };

  const handleAddPresetInjury = (preset: typeof CRITICAL_INJURY_PRESETS[0]) => {
    sounds.playClick();
    const newInjury: CriticalInjury = {
      id: 'inj-' + Date.now(),
      name: preset.name,
      location: preset.location,
      effect: preset.effect,
      treated: false,
    };

    onUpdateCharacter((prev) => ({
      ...prev,
      criticalInjuries: [...prev.criticalInjuries, newInjury],
    }));
    setShowAddInjuryModal(false);
  };

  const handleRemoveInjury = (id: string) => {
    sounds.playClick();
    onUpdateCharacter((prev) => ({
      ...prev,
      criticalInjuries: prev.criticalInjuries.filter((i) => i.id !== id),
    }));
  };

  // Death Save roll
  const handleRollDeathSave = () => {
    sounds.playDiceRoll();
    const d10 = Math.floor(Math.random() * 10) + 1;
    const penalty = character.deathSavePenalty || 0;
    const rollTotal = d10 + penalty;
    const targetBody = effectiveStats.BODY;

    if (rollTotal < targetBody) {
      sounds.playCritSuccess();
      alert(`DEATH SAVE BEM SUCEDIDO!\nRolagem: ${d10} + ${penalty} (Penalidade) = ${rollTotal} vs BODY ${targetBody}.\nO personagem sobreviveu mais um turno!`);
      // Increment penalty for next save
      onUpdateCharacter((prev) => ({
        ...prev,
        deathSavePenalty: (prev.deathSavePenalty || 0) + 1,
      }));
    } else {
      sounds.playCritFumble();
      alert(`DEATH SAVE FALHOU!\nRolagem: ${d10} + ${penalty} (Penalidade) = ${rollTotal} vs BODY ${targetBody}.\nO personagem MORREU ou necessita de intervenção médica imediata (Trauma Team / Paramedic)!`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* ================= 1. CABEÇALHO DO PERSONAGEM ================= */}
      <section className="bg-[#12131a] border border-[#232738] p-5 rounded-lg cyber-chamfer shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Handle (Nome de Rua) */}
          <div className="md:col-span-4">
            <label className="block text-[11px] font-mono text-cyan-400 uppercase tracking-widest mb-1">
              Handle (Nome de Rua)
            </label>
            <input
              type="text"
              value={character.handle}
              onChange={(e) => onUpdateCharacter((prev) => ({ ...prev, handle: e.target.value }))}
              placeholder="Ex: V, Johnny, Nomad Jack..."
              className="w-full bg-[#0a0a0f] border border-[#282d42] px-3 py-2 rounded font-orbitron font-bold text-lg text-yellow-400 focus:border-yellow-400 focus:outline-none"
            />
          </div>

          {/* Role (Função) */}
          <div className="md:col-span-3">
            <label className="block text-[11px] font-mono text-cyan-400 uppercase tracking-widest mb-1">
              Função (Role)
            </label>
            <div className="relative">
              <select
                value={character.role}
                onChange={(e) => handleRoleChange(e.target.value as RoleName)}
                className="w-full bg-[#0a0a0f] border border-[#282d42] px-3 py-2 rounded font-orbitron font-bold text-sm text-slate-100 appearance-none focus:border-cyan-400 focus:outline-none"
              >
                <option value="Solo">Solo (Combate Tático)</option>
                <option value="Netrunner">Netrunner (Invasão Virtual)</option>
                <option value="Tech">Tech (Engenharia & Cromo)</option>
                <option value="Medtech">Medtech (Medicina Avançada)</option>
                <option value="Rockerboy">Rockerboy (Carisma Musical)</option>
                <option value="Media">Media (Investigação & Notícias)</option>
                <option value="Exec">Exec (Poder Corporativo)</option>
                <option value="Lawman">Lawman (Policial & Backup)</option>
                <option value="Fixer">Fixer (Negociante do Submundo)</option>
                <option value="Nomad">Nomad (Clã das Badlands)</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Role Ability (Automática) */}
          <div className="md:col-span-3">
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-1">
              Habilidade da Função
            </label>
            <input
              type="text"
              readOnly
              value={character.roleAbilityName}
              className="w-full bg-[#08090d] border border-[#202538] px-3 py-2 rounded font-mono font-bold text-sm text-cyan-300 cursor-not-allowed"
            />
          </div>

          {/* Rank da Habilidade */}
          <div className="md:col-span-2">
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-1">
              Rank (1-10)
            </label>
            <div className="flex items-center gap-1 bg-[#0a0a0f] border border-[#282d42] p-1 rounded">
              <button
                onClick={() => {
                  sounds.playClick();
                  onUpdateCharacter((prev) => ({
                    ...prev,
                    roleAbilityRank: Math.max(1, prev.roleAbilityRank - 1),
                  }));
                }}
                className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <Minus size={14} />
              </button>
              <span className="flex-1 text-center font-orbitron font-bold text-yellow-400 text-base">
                {character.roleAbilityRank}
              </span>
              <button
                onClick={() => {
                  sounds.playClick();
                  onUpdateCharacter((prev) => ({
                    ...prev,
                    roleAbilityRank: Math.min(10, prev.roleAbilityRank + 1),
                  }));
                }}
                className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

        </div>

        {/* Second Row: Eurobucks, Reputação e Notas */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-3 pt-3 border-t border-[#1e2333]">
          <div className="md:col-span-4 flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-[11px] font-mono text-yellow-400 uppercase tracking-wider mb-0.5">
                Eurobucks (eb)
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={character.eurobucks}
                  onChange={(e) => onUpdateCharacter((prev) => ({ ...prev, eurobucks: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-[#0a0a0f] border border-[#282d42] px-3 py-1.5 rounded font-mono font-bold text-yellow-400 text-sm focus:border-yellow-400 focus:outline-none"
                />
                <button
                  onClick={() => { sounds.playClick(); onUpdateCharacter(prev => ({ ...prev, eurobucks: prev.eurobucks + 100 })); }}
                  className="px-2 py-1.5 rounded bg-yellow-400/20 text-yellow-400 text-xs font-mono border border-yellow-400/40 hover:bg-yellow-400/30"
                  title="+100 eb"
                >
                  +100
                </button>
                <button
                  onClick={() => { sounds.playClick(); onUpdateCharacter(prev => ({ ...prev, eurobucks: Math.max(0, prev.eurobucks - 100) })); }}
                  className="px-2 py-1.5 rounded bg-red-950/40 text-red-400 text-xs font-mono border border-red-500/40 hover:bg-red-950/60"
                  title="-100 eb"
                >
                  -100
                </button>
              </div>
            </div>

            <div className="w-24">
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-0.5">
                Reputação
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={character.reputation}
                onChange={(e) => onUpdateCharacter((prev) => ({ ...prev, reputation: Math.max(0, parseInt(e.target.value) || 0) }))}
                className="w-full bg-[#0a0a0f] border border-[#282d42] px-2 py-1.5 rounded font-mono font-bold text-slate-100 text-sm text-center focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-8">
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-0.5">
              Anotações Táticas / Bio
            </label>
            <input
              type="text"
              value={character.notes}
              onChange={(e) => onUpdateCharacter((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Contratos pendentes, contatos e histórico..."
              className="w-full bg-[#0a0a0f] border border-[#282d42] px-3 py-1.5 rounded font-mono text-xs text-slate-300 focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* ================= 2. BLOCO DOS 10 ATRIBUTOS (STATS) ================= */}
      <section className="bg-[#12131a] border border-[#232738] p-5 rounded-lg cyber-chamfer shadow-xl">
        <div className="flex items-center justify-between border-b border-[#232738] pb-3 mb-4">
          <div>
            <h3 className="text-lg font-bold font-orbitron text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span className="text-cyan-400">STATS</span> // 10 ATRIBUTOS FUNDAMENTAIS
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Valores base (1 a 10). Se modificado por armadura, implantes ou humanidade, o valor efetivo é destacado ao lado.
            </p>
          </div>

          {character.armor.penalty < 0 && (
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-950/60 border border-yellow-500/50 text-yellow-300">
              Penalidade de Armadura Ativa ({character.armor.penalty} em REF, DEX, MOVE)
            </span>
          )}
        </div>

        {/* 10 Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
          {(
            [
              { key: 'INT', label: 'INT', desc: 'Inteligência', baseVal: character.stats.INT, effVal: effectiveStats.INT },
              { key: 'REF', label: 'REF', desc: 'Reflexos', baseVal: character.stats.REF, effVal: effectiveStats.REF },
              { key: 'DEX', label: 'DEX', desc: 'Destreza', baseVal: character.stats.DEX, effVal: effectiveStats.DEX },
              { key: 'TECH', label: 'TECH', desc: 'Técnica', baseVal: character.stats.TECH, effVal: effectiveStats.TECH },
              { key: 'COOL', label: 'COOL', desc: 'Autocontrole', baseVal: character.stats.COOL, effVal: effectiveStats.COOL },
              { key: 'WILL', label: 'WILL', desc: 'Vontade', baseVal: character.stats.WILL, effVal: effectiveStats.WILL },
              { key: 'LUCK_MAX', label: 'LUCK', desc: 'Sorte', baseVal: character.stats.LUCK_CURRENT, effVal: character.stats.LUCK_MAX, isLuck: true },
              { key: 'MOVE', label: 'MOVE', desc: 'Movimento', baseVal: character.stats.MOVE, effVal: effectiveStats.MOVE },
              { key: 'BODY', label: 'BODY', desc: 'Constituição', baseVal: character.stats.BODY, effVal: effectiveStats.BODY },
              { key: 'EMP_BASE', label: 'EMP', desc: 'Empatia', baseVal: character.stats.EMP_BASE, effVal: effectiveStats.EMP, isEmp: true },
            ] as StatItem[]
          ).map((item) => {
            const hasMod = !item.isLuck && item.baseVal !== item.effVal;

            return (
              <div
                key={String(item.key)}
                className={`bg-[#0a0a0f] border p-2.5 rounded flex flex-col justify-between transition-all group ${
                  hasMod
                    ? item.effVal < item.baseVal
                      ? 'border-red-500/40 bg-red-950/10'
                      : 'border-yellow-400/50 bg-yellow-950/10'
                    : 'border-[#222738] hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-orbitron font-black text-sm text-cyan-300">
                    {item.label}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 uppercase">
                    {item.desc}
                  </span>
                </div>

                {/* Value Display */}
                <div className="my-2 text-center">
                  {item.isLuck ? (
                    <div className="font-orbitron font-bold">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-xl text-yellow-400" title="Sorte Atual (Disponível)">
                          {character.stats.LUCK_CURRENT}
                        </span>
                        <span className="text-xs font-mono text-slate-500">/</span>
                        <span className="text-base font-bold text-cyan-400" title="Sorte Máxima (Atributo Base)">
                          {character.stats.LUCK_MAX}
                        </span>
                      </div>
                      <div className="text-[9px] font-mono text-slate-400 flex items-center justify-center gap-1 mt-0.5">
                        <span className="text-yellow-400/80">ATUAL</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-cyan-400 font-bold">BASE</span>
                      </div>
                    </div>
                  ) : hasMod ? (
                    <div className="flex items-baseline justify-center gap-1 font-orbitron">
                      <span className={`text-2xl font-black ${item.effVal < item.baseVal ? 'text-red-400' : 'text-yellow-400'}`}>
                        {item.effVal}
                      </span>
                      <span className="text-xs line-through text-slate-500 font-mono">
                        ({item.baseVal})
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-black font-orbitron text-slate-100">
                      {item.baseVal}
                    </span>
                  )}
                </div>

                {/* Level Adjusters */}
                {!item.isEmp && !item.isLuck && (
                  <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#181d2c]">
                    <button
                      onClick={() => handleStatChange(item.key as keyof typeof character.stats, item.baseVal - 1)}
                      className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="text-[10px] font-mono text-slate-400">BASE</span>
                    <button
                      onClick={() => handleStatChange(item.key as keyof typeof character.stats, item.baseVal + 1)}
                      className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                )}

                {item.isLuck && (
                  <div className="space-y-1.5 pt-1 border-t border-[#181d2c]">
                    {/* Linha 1: Ajustar Sorte Atual (Gastar / Recuperar / Reset) */}
                    <div className="flex items-center justify-between gap-1">
                      <button
                        onClick={() => handleLuckCurrentChange(-1)}
                        className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Gastar 1 ponto de Sorte"
                      >
                        <Minus size={10} />
                      </button>
                      <button
                        onClick={handleLuckReset}
                        className="text-[9px] font-mono text-yellow-400 hover:underline uppercase font-bold"
                        title="Resetar Sorte Atual para o Máximo"
                      >
                        RESET
                      </button>
                      <button
                        onClick={() => handleLuckCurrentChange(1)}
                        className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Recuperar 1 ponto de Sorte"
                      >
                        <Plus size={10} />
                      </button>
                    </div>

                    {/* Linha 2: Ajustar Sorte Base / Máxima (1 a 10) */}
                    <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#181d2c]/60">
                      <button
                        onClick={() => handleLuckMaxChange(-1)}
                        className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
                        title="Diminuir Sorte Base / Máxima (1-10)"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase" title="Atributo Base (Máximo 1 a 10)">
                        BASE
                      </span>
                      <button
                        onClick={() => handleLuckMaxChange(1)}
                        className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
                        title="Aumentar Sorte Base / Máxima (1-10)"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>
                )}

                {item.isEmp && (
                  <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#181d2c]">
                    <button
                      onClick={() => handleStatChange('EMP_BASE', character.stats.EMP_BASE - 1)}
                      className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
                      title="Reduzir EMP Base"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="text-[10px] font-mono text-cyan-400">BASE</span>
                    <button
                      onClick={() => handleStatChange('EMP_BASE', character.stats.EMP_BASE + 1)}
                      className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
                      title="Aumentar EMP Base"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </section>

      {/* ================= 3. SAÚDE, FERIMENTO GRAVE & DEATH SAVE ================= */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Health & Status Card (7 cols) */}
        <div className="md:col-span-7 bg-[#12131a] border border-[#232738] p-5 rounded-lg cyber-chamfer space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#232738] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                <Heart size={18} />
              </div>
              <div>
                <h3 className="font-bold font-orbitron text-base text-slate-100 uppercase">
                  PONTOS DE VIDA (HP) // DERIVADOS
                </h3>
                <div className="text-[11px] font-mono text-slate-400">
                  HP Máx = 10 + (5 × ⌈(BODY {effectiveStats.BODY} + WILL {character.stats.WILL}) / 2⌉) = <span className="text-cyan-400 font-bold">{maxHp}</span>
                </div>
              </div>
            </div>

            {/* Seriously Wounded Badge */}
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 block">FERIMENTO GRAVE</span>
              <span className="text-xs font-mono font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-500/40">
                ≤ {seriouslyWoundedThreshold} HP
              </span>
            </div>
          </div>

          {/* Interactive HP Health Bar */}
          <div>
            <div className="flex items-baseline justify-between mb-1.5 font-orbitron">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-mono text-slate-400 uppercase">HP ATUAL</span>
                <span className={`text-4xl font-black ${
                  isAtZeroHp ? 'text-red-600 animate-pulse' : isSeriouslyWounded ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {character.hpCurrent}
                </span>
                <span className="text-sm font-mono text-slate-500">/ {maxHp}</span>
              </div>

              {/* Status Pill */}
              <div>
                {isAtZeroHp ? (
                  <span className="px-2.5 py-1 rounded bg-red-600 text-white font-mono text-xs font-black animate-bounce flex items-center gap-1">
                    <Skull size={14} /> NO LIMIAR DA MORTE (0 HP)
                  </span>
                ) : isSeriouslyWounded ? (
                  <span className="px-2 py-0.5 rounded bg-yellow-400 text-black font-mono text-xs font-bold flex items-center gap-1">
                    <AlertTriangle size={14} /> FERIMENTO GRAVE (-2 EM AÇÕES)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/40 font-mono text-xs">
                    OPERACIONAL ESTÁVEL
                  </span>
                )}
              </div>
            </div>

            {/* Health Progress Bar */}
            <div className="w-full h-5 bg-[#0a0a0f] border border-[#232738] rounded-sm overflow-hidden p-0.5 relative">
              <div
                className={`h-full transition-all duration-300 ${
                  isAtZeroHp
                    ? 'bg-red-600'
                    : isSeriouslyWounded
                    ? 'bg-gradient-to-r from-red-600 to-yellow-400'
                    : 'bg-gradient-to-r from-yellow-400 to-green-400'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, (character.hpCurrent / maxHp) * 100))}%` }}
              />
              {/* Threshold indicator mark */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 shadow-[0_0_4px_#ff003c]"
                style={{ left: `${(seriouslyWoundedThreshold / maxHp) * 100}%` }}
                title={`Limiar de Ferimento Grave: ${seriouslyWoundedThreshold} HP`}
              />
            </div>
          </div>

          {/* Quick HP Adjustment Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-mono text-slate-400 mr-1">Dano / Cura:</span>
            <button
              onClick={() => handleHpChange(-1)}
              className="px-2.5 py-1 rounded bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-mono font-bold"
            >
              -1 HP
            </button>
            <button
              onClick={() => handleHpChange(-5)}
              className="px-2.5 py-1 rounded bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-mono font-bold"
            >
              -5 HP
            </button>
            <button
              onClick={() => handleHpChange(-10)}
              className="px-2.5 py-1 rounded bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-mono font-bold"
            >
              -10 HP
            </button>
            <button
              onClick={() => handleHpChange(1)}
              className="px-2.5 py-1 rounded bg-green-950/60 hover:bg-green-900 border border-green-500/40 text-green-300 text-xs font-mono font-bold"
            >
              +1 HP
            </button>
            <button
              onClick={() => handleHpChange(5)}
              className="px-2.5 py-1 rounded bg-green-950/60 hover:bg-green-900 border border-green-500/40 text-green-300 text-xs font-mono font-bold"
            >
              +5 HP
            </button>
            <button
              onClick={() => { sounds.playClick(); onUpdateCharacter(prev => ({ ...prev, hpCurrent: maxHp })); }}
              className="px-3 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono ml-auto"
            >
              Restaurar Total ({maxHp})
            </button>
          </div>

          {/* Prominent Red Alert if Seriously Wounded */}
          {isSeriouslyWounded && (
            <div className="p-3 rounded bg-red-950/80 border-2 border-red-500 text-red-200 flex items-center gap-3 animate-pulse">
              <Flame size={24} className="text-red-500 flex-shrink-0 animate-bounce" />
              <div>
                <div className="font-orbitron font-bold text-xs text-red-400 uppercase tracking-wider">
                  FERIMENTO GRAVE EM PROGRESSO (HP ≤ {seriouslyWoundedThreshold})
                </div>
                <div className="text-xs font-mono text-red-200">
                  O personagem sofre <strong>-2 em todas as ações</strong> (ataques, perícias, esquivas e testes de atributos).
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Death Save & Armor Block (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          
          {/* Death Save Card */}
          <div className={`p-4 rounded-lg cyber-chamfer border ${
            isAtZeroHp ? 'bg-red-950/50 border-red-500 shadow-neon-red' : 'bg-[#12131a] border-[#232738]'
          }`}>
            <div className="flex items-center justify-between border-b border-[#232738] pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Skull size={18} className={isAtZeroHp ? 'text-red-500' : 'text-slate-400'} />
                <h4 className="font-orbitron font-bold text-sm text-slate-100 uppercase">
                  DEATH SAVE (SALVAGUARDA)
                </h4>
              </div>
              <span className="text-xs font-mono text-yellow-400 font-bold">
                BODY Efetivo: {effectiveStats.BODY}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 text-xs font-mono">
              <div>
                <span className="text-slate-400 block">Penalidade Acumulada:</span>
                <span className="text-base font-bold text-red-400">
                  +{character.deathSavePenalty || 0}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateCharacter(prev => ({ ...prev, deathSavePenalty: Math.max(0, (prev.deathSavePenalty || 0) - 1) }))}
                  className="px-2 py-1 rounded bg-[#0a0a0f] border border-[#232738] text-slate-300 hover:text-white"
                  title="Diminuir penalidade"
                >
                  -1
                </button>
                <button
                  onClick={() => onUpdateCharacter(prev => ({ ...prev, deathSavePenalty: (prev.deathSavePenalty || 0) + 1 }))}
                  className="px-2 py-1 rounded bg-[#0a0a0f] border border-[#232738] text-slate-300 hover:text-white"
                  title="Aumentar penalidade"
                >
                  +1
                </button>
                <button
                  onClick={handleRollDeathSave}
                  className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-orbitron font-bold uppercase text-xs flex items-center gap-1.5 shadow-neon-red"
                  title="Rolar 1d10 + Penalidade vs BODY"
                >
                  <Skull size={14} /> Rolar Save
                </button>
              </div>
            </div>
            <p className="text-[10px] font-mono text-slate-500 mt-2">
              Se HP = 0, role no início de cada turno. Se o resultado (1d10 + penalidade) for maior ou igual ao BODY ({effectiveStats.BODY}), o personagem morre.
            </p>
          </div>

          {/* Armor Block (Head, Body, Shield & Penalty) */}
          <div className="bg-[#12131a] border border-[#232738] p-4 rounded-lg cyber-chamfer space-y-3">
            <div className="flex items-center justify-between border-b border-[#232738] pb-2">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-cyan-400" />
                <h4 className="font-orbitron font-bold text-sm text-slate-100 uppercase">
                  ARMADURA & BLINDAGEM (SP)
                </h4>
              </div>

              {/* Armor Penalty Dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-slate-400">Penalidade:</span>
                <select
                  value={character.armor.penalty}
                  onChange={(e) => {
                    sounds.playClick();
                    onUpdateCharacter((prev) => ({
                      ...prev,
                      armor: {
                        ...prev.armor,
                        penalty: parseInt(e.target.value) as 0 | -2 | -4,
                      },
                    }));
                  }}
                  className="bg-[#0a0a0f] border border-[#282d42] px-2 py-0.5 rounded text-xs font-mono text-yellow-400 focus:outline-none"
                >
                  <option value={0}>0 (Nenhuma)</option>
                  <option value={-2}>-2 (Média)</option>
                  <option value={-4}>-4 (Pesada)</option>
                </select>
              </div>
            </div>

            {/* Head Armor */}
            <div className="bg-[#0a0a0f] p-2.5 rounded border border-[#1e2333] flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-200 block">Cabeça (Head SP)</span>
                <span className="text-[10px] font-mono text-slate-400">{character.armor.head.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="font-orbitron font-bold text-center">
                  <span className="text-lg text-cyan-400">{character.armor.head.spCurrent}</span>
                  <span className="text-xs text-slate-500 font-mono"> / {character.armor.head.spMax}</span>
                </div>
                <button
                  onClick={() => handleAblateArmor('head')}
                  className="px-2 py-1 rounded bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 font-mono text-xs font-bold"
                  title="Ablatar 1 ponto de SP"
                >
                  Ablatar (-1)
                </button>
                <button
                  onClick={() => handleRepairArmor('head')}
                  className="p-1 rounded text-slate-400 hover:text-cyan-400"
                  title="Reparar armadura"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            {/* Body Armor */}
            <div className="bg-[#0a0a0f] p-2.5 rounded border border-[#1e2333] flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-200 block">Corpo (Body SP)</span>
                <span className="text-[10px] font-mono text-slate-400">{character.armor.body.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="font-orbitron font-bold text-center">
                  <span className="text-lg text-cyan-400">{character.armor.body.spCurrent}</span>
                  <span className="text-xs text-slate-500 font-mono"> / {character.armor.body.spMax}</span>
                </div>
                <button
                  onClick={() => handleAblateArmor('body')}
                  className="px-2 py-1 rounded bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 font-mono text-xs font-bold"
                  title="Ablatar 1 ponto de SP"
                >
                  Ablatar (-1)
                </button>
                <button
                  onClick={() => handleRepairArmor('body')}
                  className="p-1 rounded text-slate-400 hover:text-cyan-400"
                  title="Reparar armadura"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* ================= 4. ARSENAL (ARMAS DE COMBATE) ================= */}
      <section className="bg-[#12131a] border border-[#232738] p-5 rounded-lg cyber-chamfer shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#232738] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-yellow-400/10 border border-yellow-400/40 flex items-center justify-center text-yellow-400">
              <Sword size={18} />
            </div>
            <div>
              <h3 className="font-bold font-orbitron text-base text-slate-100 uppercase">
                ARSENAL & ARMAS DE COMBATE ({character.weapons.length})
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Dispare, recarregue munição e role dados de dano com cálculo de ferimento crítico (dois ou mais 6s).
              </p>
            </div>
          </div>

          <button
            onClick={() => { sounds.playClick(); setShowAddWeaponModal(true); }}
            className="px-3 py-1.5 rounded bg-yellow-400 hover:bg-yellow-300 text-black font-orbitron text-xs font-bold uppercase flex items-center gap-1.5 shadow-neon-yellow transition-all"
          >
            <Plus size={14} /> Adicionar Arma
          </button>
        </div>

        {/* Weapons Grid / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {character.weapons.map((w) => (
            <div
              key={w.id}
              className="bg-[#0a0a0f] border border-[#222738] hover:border-yellow-400/50 p-3 rounded flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                      {w.type} • ROF {w.rof}
                    </span>
                    <h4 className="font-bold text-sm text-slate-100 font-orbitron">
                      {w.name}
                    </h4>
                  </div>
                  <button
                    onClick={() => handleRemoveWeapon(w.id)}
                    className="text-slate-500 hover:text-red-400 p-1"
                    title="Remover arma"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {w.notes && (
                  <p className="text-[11px] font-mono text-slate-400 mt-1 line-clamp-2">
                    {w.notes}
                  </p>
                )}
              </div>

              {/* Bottom controls: Ammo & Damage Roller */}
              <div className="mt-3 pt-2 border-t border-[#181d2c] flex items-center justify-between gap-2">
                
                {/* Ammo tracker */}
                <div className="flex items-center gap-1.5">
                  <div className="font-mono text-xs">
                    <span className="text-[9px] text-slate-500 block uppercase">Munição</span>
                    <span className={`font-bold ${w.ammoCurrent === 0 ? 'text-red-500' : 'text-slate-200'}`}>
                      {w.ammoCurrent}/{w.ammoMax}
                    </span>
                  </div>

                  <button
                    disabled={w.ammoCurrent <= 0}
                    onClick={() => handleFireWeapon(w.id, 1)}
                    className="px-1.5 py-1 rounded bg-[#1c2235] hover:bg-[#27304d] text-cyan-300 font-mono text-xs border border-[#2b3552] disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Disparar 1 tiro"
                  >
                    -1
                  </button>

                  {w.ammoMax > 5 && (
                    <button
                      disabled={w.ammoCurrent < 3}
                      onClick={() => handleFireWeapon(w.id, 3)}
                      className="px-1.5 py-1 rounded bg-[#1c2235] hover:bg-[#27304d] text-yellow-300 font-mono text-xs border border-[#2b3552] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Rajada de 3 tiros"
                    >
                      -3
                    </button>
                  )}

                  <button
                    onClick={() => handleReloadWeapon(w.id)}
                    className="p-1 rounded text-slate-400 hover:text-white"
                    title="Recarregar cartucho"
                  >
                    <RotateCcw size={13} />
                  </button>
                </div>

                {/* Roll Damage Button */}
                <button
                  onClick={() => handleRollWeaponDamage(w)}
                  className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-orbitron text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm hover:shadow-neon-red transition-all"
                  title={`Rolar dano (${w.damage})`}
                >
                  <Flame size={14} />
                  <span>{w.damage}</span>
                </button>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 5. FERIMENTOS CRÍTICOS & VÍCIOS ================= */}
      <section className="bg-[#12131a] border border-[#232738] p-5 rounded-lg cyber-chamfer shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#232738] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <Skull size={18} />
            </div>
            <div>
              <h3 className="font-bold font-orbitron text-base text-slate-100 uppercase">
                FERIMENTOS CRÍTICOS & VÍCIOS ({character.criticalInjuries.length})
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Registros de sequelas balísticas, amputações e dependências químicas ativas.
              </p>
            </div>
          </div>

          <button
            onClick={() => { sounds.playClick(); setShowAddInjuryModal(true); }}
            className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-orbitron text-xs font-bold uppercase flex items-center gap-1.5 shadow-neon-red transition-all"
          >
            <Plus size={14} /> Adicionar Ferimento
          </button>
        </div>

        {character.criticalInjuries.length === 0 ? (
          <div className="p-6 rounded border border-dashed border-[#232738] text-center font-mono text-xs text-slate-500">
            Nenhum ferimento crítico ativo. Corpo biológico e cromo em integridade estrutural.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {character.criticalInjuries.map((inj) => (
              <div
                key={inj.id}
                className="bg-[#0a0a0f] border border-red-500/40 p-3 rounded flex items-start justify-between gap-3 shadow-[0_0_8px_rgba(255,0,60,0.1)]"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-red-400 font-orbitron">{inj.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                      {inj.location}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-300 mt-1">
                    {inj.effect}
                  </p>
                </div>

                <button
                  onClick={() => handleRemoveInjury(inj.id)}
                  className="text-slate-500 hover:text-green-400 p-1 text-xs font-mono flex items-center gap-1 hover:bg-green-500/10 rounded"
                  title="Tratar ferimento"
                >
                  <Wrench size={14} /> Curar
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= MODAL ADICIONAR ARMA ================= */}
      {showAddWeaponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#0e1017] border-2 border-yellow-400 cyber-chamfer p-6 relative shadow-neon-yellow">
            <h3 className="text-lg font-black font-orbitron text-yellow-400 uppercase mb-4">
              NOVA ARMA // ARSENAL
            </h3>

            <form onSubmit={handleAddWeapon} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nome da Arma</label>
                <input
                  type="text"
                  required
                  value={newWeaponName}
                  onChange={(e) => setNewWeaponName(e.target.value)}
                  placeholder="Ex: Malorian Arms 3516, Katana Térmica..."
                  className="w-full bg-[#08090d] border border-[#282d42] px-3 py-2 rounded text-slate-100 focus:border-yellow-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Tipo</label>
                  <select
                    value={newWeaponType}
                    onChange={(e) => setNewWeaponType(e.target.value as Weapon['type'])}
                    className="w-full bg-[#08090d] border border-[#282d42] px-2 py-2 rounded text-slate-100 focus:border-yellow-400 focus:outline-none"
                  >
                    <option value="Pistol">Pistola</option>
                    <option value="SMG">Submetralhadora</option>
                    <option value="Shotgun">Escopeta</option>
                    <option value="Assault Rifle">Fuzil de Assalto</option>
                    <option value="Sniper">Rifle de Precisão</option>
                    <option value="Melee">Corpo a Corpo / Lâmina</option>
                    <option value="Heavy">Pesada</option>
                    <option value="Exotic">Exótica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Fórmula de Dano</label>
                  <input
                    type="text"
                    required
                    value={newWeaponDamage}
                    onChange={(e) => setNewWeaponDamage(e.target.value)}
                    placeholder="Ex: 3d6, 4d6, 5d6, 2d6+2"
                    className="w-full bg-[#08090d] border border-[#282d42] px-3 py-2 rounded text-red-400 font-bold focus:border-yellow-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Capacidade de Munição</label>
                  <input
                    type="number"
                    min="1"
                    value={newWeaponAmmo}
                    onChange={(e) => setNewWeaponAmmo(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-[#08090d] border border-[#282d42] px-3 py-2 rounded text-slate-100 focus:border-yellow-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Taxa de Tiro (ROF)</label>
                  <select
                    value={newWeaponRof}
                    onChange={(e) => setNewWeaponRof(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#08090d] border border-[#282d42] px-2 py-2 rounded text-slate-100 focus:border-yellow-400 focus:outline-none"
                  >
                    <option value={1}>ROF 1 (1 ataque por turno)</option>
                    <option value={2}>ROF 2 (2 ataques por turno)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Notas / Qualidade</label>
                <input
                  type="text"
                  value={newWeaponNotes}
                  onChange={(e) => setNewWeaponNotes(e.target.value)}
                  placeholder="Ex: Smartlink, Ocultável, Alta Precisão..."
                  className="w-full bg-[#08090d] border border-[#282d42] px-3 py-2 rounded text-slate-100 focus:border-yellow-400 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddWeaponModal(false)}
                  className="flex-1 py-2 rounded bg-slate-800 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded bg-yellow-400 text-black font-orbitron font-bold uppercase hover:bg-yellow-300"
                >
                  Salvar Arma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL ADICIONAR FERIMENTO ================= */}
      {showAddInjuryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#0e1017] border-2 border-red-500 cyber-chamfer p-6 relative shadow-neon-red max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-black font-orbitron text-red-500 uppercase mb-3">
              REGISTRAR FERIMENTO CRÍTICO OU VÍCIO
            </h3>

            {/* Presets List */}
            <div className="mb-4">
              <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1.5">
                Escolher Preset Rápido do Livro:
              </span>
              <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto pr-1">
                {CRITICAL_INJURY_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddPresetInjury(p)}
                    className="text-left bg-[#121520] hover:bg-red-950/40 p-2 rounded border border-[#202538] hover:border-red-500/50 transition-all font-mono text-xs flex justify-between items-center"
                  >
                    <div>
                      <span className="font-bold text-slate-200">{p.name}</span>
                      <span className="text-[10px] text-slate-400 block line-clamp-1">{p.effect}</span>
                    </div>
                    <span className="text-[10px] text-red-400 font-bold ml-2">{p.location}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom form */}
            <form onSubmit={handleAddInjury} className="space-y-3 font-mono text-xs pt-3 border-t border-[#232738]">
              <span className="text-[11px] font-mono text-slate-400 uppercase block">
                Ou criar Entrada Customizada:
              </span>
              <div>
                <label className="block text-slate-400 mb-1">Nome do Ferimento / Vício</label>
                <input
                  type="text"
                  required
                  value={newInjuryName}
                  onChange={(e) => setNewInjuryName(e.target.value)}
                  placeholder="Ex: Queimadura de 3º Grau, Fratura Craniana..."
                  className="w-full bg-[#08090d] border border-[#282d42] px-3 py-2 rounded text-slate-100 focus:border-red-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Localização no Corpo</label>
                <input
                  type="text"
                  value={newInjuryLocation}
                  onChange={(e) => setNewInjuryLocation(e.target.value)}
                  placeholder="Ex: Cabeça, Torso, Braço Esquerdo, Neural..."
                  className="w-full bg-[#08090d] border border-[#282d42] px-3 py-2 rounded text-slate-100 focus:border-red-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Efeito / Penalidade</label>
                <textarea
                  rows={2}
                  value={newInjuryEffect}
                  onChange={(e) => setNewInjuryEffect(e.target.value)}
                  placeholder="Penalidade em testes, ações restritas ou regras..."
                  className="w-full bg-[#08090d] border border-[#282d42] px-3 py-2 rounded text-slate-100 focus:border-red-400 focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddInjuryModal(false)}
                  className="flex-1 py-2 rounded bg-slate-800 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded bg-red-600 text-white font-orbitron font-bold uppercase hover:bg-red-500"
                >
                  Salvar Ferimento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
