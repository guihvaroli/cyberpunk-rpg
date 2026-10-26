import React, { useState, useMemo } from 'react';
import { CharacterSheet, RollBreakdown, StatKey } from '../types/character';
import { OFFICIAL_SKILLS, SKILL_CATEGORIES } from '../data/skillsData';
import { calculateEffectiveStats, calculateMaxHp, calculateSeriouslyWoundedThreshold, rollD10Exploding } from '../utils/calculations';
import { sounds } from '../utils/audio';
import { 
  Search, 
  Dices, 
  Plus, 
  Minus, 
  Filter, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  HelpCircle
} from 'lucide-react';

interface PageSkillsProps {
  character: CharacterSheet;
  onUpdateCharacter: (updater: (prev: CharacterSheet) => CharacterSheet) => void;
  onTriggerSkillRoll: (roll: RollBreakdown) => void;
}

export const PageSkills: React.FC<PageSkillsProps> = ({
  character,
  onUpdateCharacter,
  onTriggerSkillRoll,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStat, setSelectedStat] = useState<string>('ALL');
  const [onlyTrained, setOnlyTrained] = useState<boolean>(false);
  const [applyWoundedPenalty, setApplyWoundedPenalty] = useState<boolean>(true);

  // Calculate effective stats
  const effectiveStats = useMemo(() => calculateEffectiveStats(character), [character]);
  const maxHp = calculateMaxHp(effectiveStats.BODY, character.stats.WILL);
  const seriouslyWoundedThreshold = calculateSeriouslyWoundedThreshold(maxHp);
  const isSeriouslyWounded = character.hpCurrent <= seriouslyWoundedThreshold;

  // Filter skills
  const filteredSkills = useMemo(() => {
    return OFFICIAL_SKILLS.filter((skill) => {
      const level = character.skills[skill.name] || 0;

      // Filter by category
      if (selectedCategory !== 'ALL' && skill.category !== selectedCategory) {
        return false;
      }

      // Filter by stat
      if (selectedStat !== 'ALL' && skill.stat !== selectedStat) {
        return false;
      }

      // Filter by trained
      if (onlyTrained && level <= 0) {
        return false;
      }

      // Filter by search query
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesName = skill.name.toLowerCase().includes(query);
        const matchesCat = skill.category.toLowerCase().includes(query);
        const matchesStat = skill.stat.toLowerCase().includes(query);
        const matchesDesc = skill.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesCat && !matchesStat && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [character.skills, selectedCategory, selectedStat, onlyTrained, searchTerm]);

  // Adjust skill level
  const handleLevelChange = (skillName: string, delta: number) => {
    sounds.playClick();
    onUpdateCharacter((prev) => {
      const currentLevel = prev.skills[skillName] || 0;
      const newLevel = Math.min(10, Math.max(0, currentLevel + delta));
      return {
        ...prev,
        skills: {
          ...prev.skills,
          [skillName]: newLevel,
        },
      };
    });
  };

  // Roll skill check
  const handleRollSkill = (skill: typeof OFFICIAL_SKILLS[0]) => {
    sounds.playDiceRoll();
    const statVal = effectiveStats[skill.stat] || 0;
    const skillLvl = character.skills[skill.name] || 0;
    const baseValue = statVal + skillLvl;

    const penaltyActive = isSeriouslyWounded && applyWoundedPenalty;
    const roll = rollD10Exploding(
      skill.name,
      baseValue,
      skill.stat,
      statVal,
      skillLvl,
      penaltyActive
    );

    if (roll.isCritSuccess) {
      setTimeout(() => sounds.playCritSuccess(), 250);
    } else if (roll.isCritFumble) {
      setTimeout(() => sounds.playCritFumble(), 250);
    }

    onTriggerSkillRoll(roll);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Filter Controls */}
      <div className="bg-[#12131a] border border-[#232738] p-4 rounded-lg cyber-chamfer space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#232738] pb-3">
          <div>
            <h2 className="text-xl font-bold font-orbitron text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span className="text-yellow-400">SKILLS MATRIX</span> // MATRIZ DE PERÍCIAS
            </h2>
            <p className="text-xs font-mono text-slate-400">
              Cálculo automatizado: BASE = STAT Efetivo + Nível da Perícia.
            </p>
          </div>

          {/* Seriously Wounded notice */}
          {isSeriouslyWounded && (
            <div className="flex items-center gap-2 bg-red-950/70 border border-red-500/80 px-3 py-1 rounded text-red-300 font-mono text-xs">
              <AlertTriangle size={15} className="text-red-400 animate-bounce" />
              <span>FERIMENTO GRAVE ATIVO (-2 EM AÇÕES)</span>
              <label className="flex items-center gap-1 ml-2 cursor-pointer text-[11px] text-slate-300">
                <input
                  type="checkbox"
                  checked={applyWoundedPenalty}
                  onChange={(e) => setApplyWoundedPenalty(e.target.checked)}
                  className="rounded text-red-500 bg-black border-red-500"
                />
                Aplicar na rolagem
              </label>
            </div>
          )}
        </div>

        {/* Search & Quick Filters Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Search Input (5 cols) */}
          <div className="md:col-span-5 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar perícia, stat ou descrição..."
              className="w-full bg-[#0a0a0f] border border-[#232738] pl-9 pr-3 py-2 rounded text-sm font-mono text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-white"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Stat Select Filter (3 cols) */}
          <div className="md:col-span-3">
            <select
              value={selectedStat}
              onChange={(e) => setSelectedStat(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-[#232738] px-3 py-2 rounded text-xs font-mono text-slate-200 focus:border-cyan-400 focus:outline-none"
            >
              <option value="ALL">TODOS OS ATRIBUTOS</option>
              <option value="INT">INT (Inteligência)</option>
              <option value="REF">REF (Reflexos)</option>
              <option value="DEX">DEX (Destreza)</option>
              <option value="TECH">TECH (Técnica)</option>
              <option value="COOL">COOL (Autocontrole)</option>
              <option value="WILL">WILL (Vontade)</option>
              <option value="EMP">EMP (Empatia)</option>
            </select>
          </div>

          {/* Trained Only Toggle (4 cols) */}
          <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-3">
            <button
              onClick={() => { sounds.playClick(); setOnlyTrained(!onlyTrained); }}
              className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 border transition-all ${
                onlyTrained
                  ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300 font-bold'
                  : 'bg-[#0c0d14] border-[#232738] text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 size={14} className={onlyTrained ? 'text-yellow-400' : 'text-slate-500'} />
              Apenas Treinadas (LVL &gt; 0)
            </button>
            <div className="text-xs font-mono text-slate-500">
              {filteredSkills.length} perícias
            </div>
          </div>
        </div>

        {/* Category Horizontal Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            onClick={() => { sounds.playClick(); setSelectedCategory('ALL'); }}
            className={`px-3 py-1 text-xs font-orbitron font-bold rounded uppercase whitespace-nowrap transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-cyan-400 text-black shadow-neon-cyan'
                : 'bg-[#0c0d14] text-slate-400 hover:text-slate-200 border border-[#232738]'
            }`}
          >
            Todas
          </button>
          {SKILL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { sounds.playClick(); setSelectedCategory(cat); }}
              className={`px-2.5 py-1 text-xs font-mono uppercase whitespace-nowrap transition-all rounded border ${
                selectedCategory === cat
                  ? 'bg-yellow-400 text-black border-yellow-400 font-bold shadow-neon-yellow'
                  : 'bg-[#0c0d14] text-slate-400 hover:text-slate-200 border-[#232738]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredSkills.map((skill) => {
          const level = character.skills[skill.name] || 0;
          const statValue = effectiveStats[skill.stat] || 0;
          const baseValue = statValue + level;

          return (
            <div
              key={skill.name}
              className={`bg-[#12131a] border rounded p-3 transition-all duration-200 flex flex-col justify-between group hover:border-cyan-500/60 ${
                level > 0 ? 'border-[#262c42]' : 'border-[#1b1f2e] opacity-85'
              }`}
            >
              {/* Top line: Name & Category */}
              <div>
                <div className="flex items-start justify-between gap-1">
                  <div className="font-bold text-sm text-slate-100 flex items-center gap-1.5 flex-wrap">
                    <span>{skill.name}</span>
                    {skill.isDoubleCost && (
                      <span className="text-[10px] font-mono px-1 rounded bg-amber-950/80 text-yellow-300 border border-yellow-500/40">
                        x2
                      </span>
                    )}
                  </div>

                  {/* Stat badge with effective stat */}
                  <div className="flex-shrink-0">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#0a0a0f] border border-[#2b334d] text-cyan-300 font-bold">
                      {skill.stat} {statValue}
                    </span>
                  </div>
                </div>

                {skill.description && (
                  <p className="text-[11px] font-mono text-slate-400 mt-1 line-clamp-1 group-hover:line-clamp-2 transition-all">
                    {skill.description}
                  </p>
                )}
              </div>

              {/* Bottom line: Level controls, BASE, and 1D10 Roll button */}
              <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-[#1a1e2b]">
                
                {/* Level Controls */}
                <div className="flex items-center gap-1 bg-[#0a0a0f] p-1 rounded border border-[#202538]">
                  <button
                    disabled={level <= 0}
                    onClick={() => handleLevelChange(skill.name, -1)}
                    className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Diminuir nível"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-6 text-center text-xs font-mono font-bold text-slate-200">
                    {level}
                  </span>
                  <button
                    disabled={level >= 10}
                    onClick={() => handleLevelChange(skill.name, 1)}
                    className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Aumentar nível"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {/* Calculated BASE */}
                <div className="text-center font-mono">
                  <div className="text-[9px] text-slate-500 uppercase">BASE</div>
                  <div className="text-base font-black font-orbitron text-yellow-400">
                    {baseValue}
                  </div>
                </div>

                {/* 1D10 ROLL BUTTON */}
                <button
                  onClick={() => handleRollSkill(skill)}
                  className="px-3 py-1.5 rounded bg-cyan-400 hover:bg-cyan-300 text-black font-orbitron text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm hover:shadow-neon-cyan"
                  title="Rolar 1d10 + BASE"
                >
                  <Dices size={14} />
                  <span>1d10</span>
                </button>

              </div>
            </div>
          );
        })}
      </div>

      {filteredSkills.length === 0 && (
        <div className="p-12 text-center bg-[#12131a] border border-[#232738] rounded-lg">
          <p className="font-mono text-sm text-slate-400">
            Nenhuma perícia encontrada com os filtros selecionados.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedCategory('ALL'); setSelectedStat('ALL'); setOnlyTrained(false); }}
            className="mt-3 px-3 py-1.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs border border-cyan-500/40 hover:bg-cyan-500/30"
          >
            Redefinir Filtros
          </button>
        </div>
      )}
    </div>
  );
};
