import React, { useState, useEffect } from 'react';
import { CharacterSheet, RollBreakdown } from './types/character';
import { DEFAULT_CHARACTER } from './data/defaultCharacter';
import { DamageRollResult } from './utils/calculations';
import { sounds } from './utils/audio';
import { Header, ActiveView } from './components/Header';
import { PageMain } from './components/PageMain';
import { PageSkills } from './components/PageSkills';
import { PageRipperdoc } from './components/PageRipperdoc';
import { DiceRollModal } from './components/DiceRollModal';

const STORAGE_KEY = 'CYBERPUNK_RED_2077_SHEET';
const SCANLINES_KEY = 'CYBERPUNK_SCANLINES_ENABLED';

export function App() {
  // Load character from localStorage or fallback to default
  const [character, setCharacter] = useState<CharacterSheet>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure critical fields exist
        if (parsed && parsed.stats && parsed.skills) {
          if (parsed.stats.LUCK_MAX === undefined && parsed.stats.LUCK !== undefined) {
            parsed.stats.LUCK_MAX = parsed.stats.LUCK;
            parsed.stats.LUCK_CURRENT = parsed.stats.LUCK;
          } else if (parsed.stats.LUCK_MAX === undefined) {
            parsed.stats.LUCK_MAX = 6;
            parsed.stats.LUCK_CURRENT = parsed.stats.LUCK_CURRENT ?? 6;
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Falha ao carregar ficha salva:', e);
    }
    return DEFAULT_CHARACTER;
  });

  // Current view
  const [activeView, setActiveView] = useState<ActiveView>('main');

  // Audio & visual settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(sounds.enabled);
  const [scanlinesEnabled, setScanlinesEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(SCANLINES_KEY);
    return saved !== null ? saved === 'true' : true;
  });

  // Modal roll states
  const [activeSkillRoll, setActiveSkillRoll] = useState<RollBreakdown | null>(null);
  const [activeDamageRoll, setActiveDamageRoll] = useState<DamageRollResult | null>(null);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(character));
    } catch (e) {
      console.error('Falha ao salvar no localStorage:', e);
    }
  }, [character]);

  // Toggle Sound
  const handleToggleSound = () => {
    const newState = sounds.toggleSound();
    setSoundEnabled(newState);
  };

  // Toggle Scanlines
  const handleToggleScanlines = () => {
    sounds.playClick();
    setScanlinesEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(SCANLINES_KEY, String(next));
      return next;
    });
  };

  // Export JSON
  const handleExportJson = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(character, null, 2));
      const downloadAnchor = document.createElement('a');
      const filename = `cyberpunk_sheet_${(character.handle || 'character').toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`;
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', filename);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      sounds.playCritSuccess();
    } catch (e) {
      alert('Erro ao exportar arquivo JSON: ' + e);
    }
  };

  // Import JSON
  const handleImportJson = (jsonContent: string) => {
    try {
      const parsed = JSON.parse(jsonContent);
      if (!parsed || !parsed.stats || !parsed.role) {
        throw new Error('Arquivo JSON inválido para Cyberpunk RED.');
      }
      setCharacter(parsed);
      sounds.playCritSuccess();
      alert(`Ficha de "${parsed.handle || 'Personagem'}" carregada com sucesso!`);
    } catch (err: unknown) {
      sounds.playCritFumble();
      const message = err instanceof Error ? err.message : String(err);
      alert('Erro ao importar JSON: ' + message);
    }
  };

  // Reset to default
  const handleResetCharacter = () => {
    if (confirm('Deseja resetar a ficha para o personagem padrão (V - Solo)? Quaisquer alterações não salvas em arquivo serão perdidas.')) {
      sounds.playClick();
      setCharacter(DEFAULT_CHARACTER);
    }
  };

  return (
    <div className={`min-h-screen bg-[#0a0a0f] text-slate-100 flex flex-col ${scanlinesEnabled ? 'scanlines' : ''}`}>
      
      {/* Fixed Cyberpunk Header */}
      <Header
        character={character}
        activeView={activeView}
        onSelectView={setActiveView}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onResetCharacter={handleResetCharacter}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        scanlinesEnabled={scanlinesEnabled}
        onToggleScanlines={handleToggleScanlines}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activeView === 'main' && (
          <PageMain
            character={character}
            onUpdateCharacter={setCharacter}
            onTriggerDamageRoll={setActiveDamageRoll}
          />
        )}

        {activeView === 'skills' && (
          <PageSkills
            character={character}
            onUpdateCharacter={setCharacter}
            onTriggerSkillRoll={setActiveSkillRoll}
          />
        )}

        {activeView === 'ripperdoc' && (
          <PageRipperdoc
            character={character}
            onUpdateCharacter={setCharacter}
          />
        )}
      </main>

      {/* Cyberpunk Footer */}
      <footer className="border-t border-[#1a1e2d] bg-[#07080b] py-4 text-center font-mono text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-slate-400">CYBERPUNK RED (EDIÇÃO 2077) // FICHA AUTOMATIZADA</span>
          </div>
          <div>
            DATABASE HOSTED BY <span className="text-yellow-400 font-bold">AFTERLIFE NETWORKS</span> • NIGHT CITY
          </div>
          <div className="text-[10px] text-slate-600">
            AUTO-SAVE LOCALSTORAGE ATIVO
          </div>
        </div>
      </footer>

      {/* Dice Roll Modal / Toast */}
      <DiceRollModal
        skillRoll={activeSkillRoll}
        damageRoll={activeDamageRoll}
        onClose={() => {
          setActiveSkillRoll(null);
          setActiveDamageRoll(null);
        }}
        onRerollSkill={
          activeSkillRoll
            ? () => {
                // Reroll same skill logic handled inside PageSkills or re-trigger here
                const d10 = Math.floor(Math.random() * 10) + 1;
                setActiveSkillRoll((prev) => {
                  if (!prev) return null;
                  const roll = {
                    ...prev,
                    d10Roll: d10,
                    explodedRolls: d10 === 10 ? [Math.floor(Math.random() * 10) + 1] : [],
                    fumbledRoll: d10 === 1 ? Math.floor(Math.random() * 10) + 1 : 0,
                    total: prev.baseValue + d10 + (d10 === 10 ? 5 : 0) - (d10 === 1 ? 3 : 0) - prev.seriouslyWoundedPenalty,
                    isCritSuccess: d10 === 10,
                    isCritFumble: d10 === 1,
                    timestamp: Date.now(),
                  };
                  return roll;
                });
              }
            : undefined
        }
      />

    </div>
  );
}

export default App;
