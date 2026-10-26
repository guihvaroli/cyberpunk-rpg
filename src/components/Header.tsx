import React, { useRef } from 'react';
import { CharacterSheet } from '../types/character';
import { calculateEffectiveStats, calculateHumanityAndEmp, calculateMaxHp } from '../utils/calculations';
import { sounds } from '../utils/audio';
import { 
  Download, 
  Upload, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Tv, 
  Heart, 
  Zap, 
  Coins, 
  Shield, 
  Cpu, 
  User, 
  Activity,
  Layers
} from 'lucide-react';

export type ActiveView = 'main' | 'skills' | 'ripperdoc';

interface HeaderProps {
  character: CharacterSheet;
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  onExportJson: () => void;
  onImportJson: (json: string) => void;
  onResetCharacter: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  scanlinesEnabled: boolean;
  onToggleScanlines: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  character,
  activeView,
  onSelectView,
  onExportJson,
  onImportJson,
  onResetCharacter,
  soundEnabled,
  onToggleSound,
  scanlinesEnabled,
  onToggleScanlines,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const effectiveStats = calculateEffectiveStats(character);
  const humanity = calculateHumanityAndEmp(character);
  const maxHp = calculateMaxHp(effectiveStats.BODY, character.stats.WILL);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportJson(content);
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0f]/95 border-b border-[#232738] backdrop-blur-md shadow-2xl">
      {/* Top Banner: Logo, Character Handle, Quick Indicators & Tools */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand & Character Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#12131a] border-2 border-yellow-400 cyber-chamfer flex items-center justify-center font-orbitron font-black text-cyan-400 text-lg shadow-neon-yellow">
            CP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-orbitron font-black text-sm tracking-wider text-yellow-400 uppercase">
                CYBERPUNK RED
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                2077 ED.
              </span>
            </div>
            <div className="font-mono text-xs text-slate-400 flex items-center gap-2">
              <span className="text-white font-bold">{character.handle || 'DESCONHECIDO'}</span>
              <span>•</span>
              <span className="text-yellow-400">{character.role} (Rank {character.roleAbilityRank})</span>
            </div>
          </div>
        </div>

        {/* Quick HUD Indicators (HP, Humanity, EB, SP) */}
        <div className="hidden sm:flex items-center gap-3 bg-[#10121b] border border-[#232738] px-3 py-1.5 rounded-lg font-mono text-xs">
          
          {/* Quick HP */}
          <div className="flex items-center gap-1.5 border-r border-[#202538] pr-3" title="Pontos de Vida">
            <Heart size={14} className={character.hpCurrent <= Math.ceil(maxHp / 2) ? 'text-red-500 animate-pulse' : 'text-green-400'} />
            <span className="text-slate-400">HP:</span>
            <span className={`font-bold ${character.hpCurrent <= Math.ceil(maxHp / 2) ? 'text-red-400' : 'text-slate-200'}`}>
              {character.hpCurrent}/{maxHp}
            </span>
          </div>

          {/* Quick Humanity & EMP */}
          <div className="flex items-center gap-1.5 border-r border-[#202538] pr-3" title="Humanidade e Empatia">
            <Cpu size={14} className={humanity.isBorderline || humanity.isCyberpsycho ? 'text-red-400 animate-pulse' : 'text-cyan-400'} />
            <span className="text-slate-400">HUM:</span>
            <span className={`font-bold ${humanity.isBorderline ? 'text-yellow-400' : humanity.isCyberpsycho ? 'text-red-500' : 'text-cyan-300'}`}>
              {humanity.currentHumanity}
            </span>
            <span className="text-[10px] text-slate-500">(EMP {humanity.currentEmp})</span>
          </div>

          {/* Quick SP */}
          <div className="flex items-center gap-1.5 border-r border-[#202538] pr-3" title="Blindagem de Cabeça e Corpo">
            <Shield size={14} className="text-yellow-400" />
            <span className="text-slate-400">SP:</span>
            <span className="text-slate-200 font-bold">
              C:{character.armor.head.spCurrent} / T:{character.armor.body.spCurrent}
            </span>
          </div>

          {/* Quick Eurobucks */}
          <div className="flex items-center gap-1.5" title="Saldo de Eurobucks">
            <Coins size={14} className="text-yellow-400" />
            <span className="text-yellow-400 font-bold">
              {character.eurobucks.toLocaleString()} eb
            </span>
          </div>

        </div>

        {/* Toolbar: Export, Import, Sound, CRT, Reset */}
        <div className="flex items-center gap-2">
          
          {/* Sound FX Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-1.5 rounded border transition-all ${
              soundEnabled
                ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20'
                : 'bg-[#12131a] border-[#232738] text-slate-500 hover:text-slate-300'
            }`}
            title={soundEnabled ? 'Áudio Sci-Fi Ativado' : 'Áudio Desativado'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* CRT / Scanlines Toggle */}
          <button
            onClick={onToggleScanlines}
            className={`p-1.5 rounded border transition-all ${
              scanlinesEnabled
                ? 'bg-yellow-400/10 border-yellow-400/40 text-yellow-300 hover:bg-yellow-400/20'
                : 'bg-[#12131a] border-[#232738] text-slate-500 hover:text-slate-300'
            }`}
            title={scanlinesEnabled ? 'Filtro CRT/Scanlines Ativado' : 'Scanlines Desativadas'}
          >
            <Tv size={16} />
          </button>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          {/* Import JSON */}
          <button
            onClick={() => { sounds.playClick(); fileInputRef.current?.click(); }}
            className="px-2.5 py-1.5 rounded bg-[#12141f] border border-[#262c42] hover:border-cyan-400 text-slate-300 hover:text-white font-mono text-xs flex items-center gap-1.5 transition-colors"
            title="Importar Ficha (.json)"
          >
            <Upload size={14} className="text-cyan-400" />
            <span className="hidden md:inline">Importar</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={() => { sounds.playClick(); onExportJson(); }}
            className="px-2.5 py-1.5 rounded bg-[#12141f] border border-[#262c42] hover:border-yellow-400 text-slate-300 hover:text-white font-mono text-xs flex items-center gap-1.5 transition-colors"
            title="Exportar Ficha (.json)"
          >
            <Download size={14} className="text-yellow-400" />
            <span className="hidden md:inline">Exportar</span>
          </button>

          {/* Reset Sheet */}
          <button
            onClick={() => { sounds.playClick(); onResetCharacter(); }}
            className="p-1.5 rounded bg-[#12141f] border border-[#262c42] hover:border-red-500 text-slate-500 hover:text-red-400 transition-colors"
            title="Resetar para ficha padrão (V)"
          >
            <RotateCcw size={15} />
          </button>

        </div>

      </div>

      {/* Navigation Bar (The 3 Views) */}
      <div className="border-t border-[#1c2030] bg-[#0c0d14]">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2">
          
          {/* VIEW 1: Principal */}
          <button
            onClick={() => { sounds.playClick(); onSelectView('main'); }}
            className={`py-2.5 px-4 font-orbitron text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 ${
              activeView === 'main'
                ? 'border-yellow-400 text-yellow-300 bg-yellow-400/5 shadow-[0_2px_8px_rgba(252,238,10,0.2)]'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <User size={15} className={activeView === 'main' ? 'text-yellow-400' : 'text-slate-500'} />
            <span>Página 1: Principal & Combate</span>
          </button>

          {/* VIEW 2: Perícias */}
          <button
            onClick={() => { sounds.playClick(); onSelectView('skills'); }}
            className={`py-2.5 px-4 font-orbitron text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 ${
              activeView === 'skills'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-400/5 shadow-[0_2px_8px_rgba(0,240,255,0.2)]'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Activity size={15} className={activeView === 'skills' ? 'text-cyan-400' : 'text-slate-500'} />
            <span>Página 2: Perícias (Skills Matrix)</span>
          </button>

          {/* VIEW 3: Ripperdoc */}
          <button
            onClick={() => { sounds.playClick(); onSelectView('ripperdoc'); }}
            className={`py-2.5 px-4 font-orbitron text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 ${
              activeView === 'ripperdoc'
                ? 'border-red-500 text-red-300 bg-red-500/5 shadow-[0_2px_8px_rgba(255,0,60,0.2)]'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Cpu size={15} className={activeView === 'ripperdoc' ? 'text-red-400' : 'text-slate-500'} />
            <span className="flex items-center gap-1.5">
              <span>Página 3: Ripperdoc (Cyberware)</span>
              {humanity.isBorderline && (
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping inline-block" />
              )}
              {humanity.isCyberpsycho && (
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
              )}
            </span>
          </button>

        </div>
      </div>
    </header>
  );
};
