import React from 'react';
import { RollBreakdown } from '../types/character';
import { DamageRollResult } from '../utils/calculations';
import { X, Sparkles, AlertOctagon, Skull, RotateCcw } from 'lucide-react';
import { sounds } from '../utils/audio';

interface DiceRollModalProps {
  skillRoll: RollBreakdown | null;
  damageRoll: DamageRollResult | null;
  onClose: () => void;
  onRerollSkill?: () => void;
}

export const DiceRollModal: React.FC<DiceRollModalProps> = ({
  skillRoll,
  damageRoll,
  onClose,
  onRerollSkill,
}) => {
  if (!skillRoll && !damageRoll) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#0e1017] border-2 border-cyan-400 cyber-chamfer p-6 relative shadow-neon-cyan overflow-hidden"
      >
        {/* Background glow and corner decor */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        <button
          onClick={() => { sounds.playClick(); onClose(); }}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded transition-colors"
        >
          <X size={18} />
        </button>

        {/* 1. SKILL ROLL DISPLAY */}
        {skillRoll && (
          <div className="space-y-4">
            <div className="border-b border-[#1f2538] pb-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">
                  TESTE DE PERÍCIA // 1D10 HUD
                </span>
                <h3 className="text-xl font-black font-orbitron text-slate-100 uppercase">
                  {skillRoll.label}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1c2235] text-cyan-300 font-bold">
                  {skillRoll.statName}: {skillRoll.baseStat} + LVL {skillRoll.skillLevel}
                </span>
              </div>
            </div>

            {/* Critical Success / Fumble Banner */}
            {skillRoll.isCritSuccess && (
              <div className="p-2.5 rounded bg-yellow-400/20 border border-yellow-400 text-yellow-300 flex items-center gap-2 font-mono text-xs font-bold animate-pulse">
                <Sparkles size={18} className="text-yellow-400 flex-shrink-0" />
                <span>CRÍTICO EXPLOSIVO! (Rolou 10 no primeiro dado e somou dados adicionais!)</span>
              </div>
            )}

            {skillRoll.isCritFumble && (
              <div className="p-2.5 rounded bg-red-950/80 border border-red-500 text-red-300 flex items-center gap-2 font-mono text-xs font-bold">
                <AlertOctagon size={18} className="text-red-500 flex-shrink-0" />
                <span>FALHA CRÍTICA! (Rolou 1 no primeiro dado e subtraiu valor subsequente!)</span>
              </div>
            )}

            {/* Huge Total Result Box */}
            <div className="bg-[#08090d] border border-[#23293d] rounded-lg p-4 text-center relative overflow-hidden">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                RESULTADO FINAL
              </div>
              <div className={`text-5xl font-black font-orbitron my-1 tracking-tight ${
                skillRoll.isCritSuccess ? 'text-yellow-400 glow-yellow' : skillRoll.isCritFumble ? 'text-red-400 glow-red' : 'text-cyan-400 glow-cyan'
              }`}>
                {skillRoll.total}
              </div>
              <div className="text-xs font-mono text-slate-400">
                Comparar com a Dificuldade (DV) estipulada pelo Mestre
              </div>
            </div>

            {/* Breakdown Formula */}
            <div className="bg-[#121520] p-3 rounded font-mono text-xs space-y-1.5 border border-[#1b2030]">
              <div className="text-slate-400 font-bold mb-1 border-b border-[#22283d] pb-1">
                DETALHAMENTO DO CÁLCULO:
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Base ({skillRoll.statName} + Nível):</span>
                <span className="font-bold text-cyan-300">+{skillRoll.baseValue}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Dado Inicial (1d10):</span>
                <span className={`font-bold ${skillRoll.d10Roll === 10 ? 'text-yellow-400' : skillRoll.d10Roll === 1 ? 'text-red-400' : 'text-slate-100'}`}>
                  {skillRoll.d10Roll}
                </span>
              </div>

              {skillRoll.explodedRolls.length > 0 && (
                <div className="flex justify-between text-yellow-300">
                  <span>Dados Explosivos (+1d10):</span>
                  <span className="font-bold">+{skillRoll.explodedRolls.join(' + ')}</span>
                </div>
              )}

              {skillRoll.fumbledRoll > 0 && (
                <div className="flex justify-between text-red-400">
                  <span>Desastre Subtraído (-1d10):</span>
                  <span className="font-bold">-{skillRoll.fumbledRoll}</span>
                </div>
              )}

              {skillRoll.seriouslyWoundedPenalty > 0 && (
                <div className="flex justify-between text-red-400">
                  <span>Penalidade Ferimento Grave:</span>
                  <span className="font-bold">-2</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              {onRerollSkill && (
                <button
                  onClick={() => { sounds.playDiceRoll(); onRerollSkill(); }}
                  className="flex-1 py-2 px-3 rounded bg-[#1c2235] hover:bg-[#252d47] text-slate-200 font-orbitron text-xs font-bold uppercase flex items-center justify-center gap-2 border border-[#2d3652] transition-colors"
                >
                  <RotateCcw size={14} /> Rolar Novamente
                </button>
              )}
              <button
                onClick={() => { sounds.playClick(); onClose(); }}
                className="flex-1 py-2 px-3 rounded bg-cyan-400 hover:bg-cyan-300 text-black font-orbitron text-xs font-bold uppercase transition-colors shadow-neon-cyan"
              >
                Concluir
              </button>
            </div>
          </div>
        )}

        {/* 2. DAMAGE ROLL DISPLAY */}
        {damageRoll && (
          <div className="space-y-4">
            <div className="border-b border-[#1f2538] pb-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-red-400 tracking-widest uppercase">
                  ROLAGEM DE DANO // ARSENAL
                </span>
                <h3 className="text-xl font-black font-orbitron text-slate-100 uppercase">
                  {damageRoll.weaponName}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-950/60 border border-red-500/40 text-red-300 font-bold">
                  {damageRoll.damageFormula}
                </span>
              </div>
            </div>

            {damageRoll.isCriticalInjury && (
              <div className="p-3 rounded bg-red-950/90 border-2 border-red-500 text-red-200 flex items-center gap-2.5 font-mono text-xs font-bold animate-pulse">
                <Skull size={22} className="text-red-400 flex-shrink-0 animate-bounce" />
                <div>
                  <div className="text-red-400 uppercase font-orbitron">FERIMENTO CRÍTICO PROVOCADO!</div>
                  <div className="text-[11px] text-red-200">
                    Rolou {damageRoll.sixesCount} dados com valor 6! O alvo sofre dano direto de +5 HP bônus e rola na Tabela de Ferimentos Críticos!
                  </div>
                </div>
              </div>
            )}

            {/* Total Damage Display */}
            <div className="bg-[#08090d] border border-[#23293d] rounded-lg p-4 text-center">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                DANO TOTAL BRUTO
              </div>
              <div className="text-5xl font-black font-orbitron text-red-500 glow-red my-1 tracking-tight">
                {damageRoll.total}
              </div>
              <div className="text-xs font-mono text-slate-400">
                (Subtraia o SP da armadura do alvo antes de aplicar ao HP)
              </div>
            </div>

            {/* Dice Breakdown */}
            <div className="bg-[#121520] p-3 rounded font-mono text-xs space-y-2 border border-[#1b2030]">
              <div className="text-slate-400 font-bold border-b border-[#22283d] pb-1">
                DADOS INDIVIDUAIS:
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {damageRoll.diceRolls.map((d, idx) => (
                  <span
                    key={idx}
                    className={`w-9 h-9 rounded flex items-center justify-center text-sm font-black border ${
                      d === 6
                        ? 'bg-red-600/30 border-red-500 text-red-300 shadow-[0_0_8px_rgba(255,0,60,0.6)]'
                        : 'bg-[#181d2c] border-[#29324c] text-slate-200'
                    }`}
                  >
                    {d}
                  </span>
                ))}
              </div>
              {damageRoll.modifier !== 0 && (
                <div className="text-slate-400 pt-1">
                  Modificador: {damageRoll.modifier > 0 ? `+${damageRoll.modifier}` : damageRoll.modifier}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2">
              <button
                onClick={() => { sounds.playClick(); onClose(); }}
                className="w-full py-2 px-3 rounded bg-red-500 hover:bg-red-400 text-white font-orbitron text-xs font-bold uppercase transition-colors shadow-neon-red"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
