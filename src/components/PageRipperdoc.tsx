import React, { useState } from 'react';
import { CharacterSheet, CyberwareItem, CyberwareLocation } from '../types/character';
import { BODY_REGIONS, PRESET_CYBERWARE } from '../data/cyberwareCatalog';
import { calculateHumanityAndEmp } from '../utils/calculations';
import { CyberBodySvg } from './CyberBodySvg';
import { sounds } from '../utils/audio';
import { 
  X, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  ShieldAlert, 
  Cpu, 
  Coins, 
  Sparkles, 
  Info,
  Wrench,
  CheckCircle2
} from 'lucide-react';

interface PageRipperdocProps {
  character: CharacterSheet;
  onUpdateCharacter: (updater: (prev: CharacterSheet) => CharacterSheet) => void;
}

export const PageRipperdoc: React.FC<PageRipperdocProps> = ({
  character,
  onUpdateCharacter,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<CyberwareLocation | null>('neuralware');
  const [activeTab, setActiveTab] = useState<'catalog' | 'custom'>('catalog');

  // Custom cyberware form state
  const [customName, setCustomName] = useState('');
  const [customHL, setCustomHL] = useState<number>(7);
  const [customCost, setCustomCost] = useState<number>(500);
  const [customSlots, setCustomSlots] = useState<number>(1);
  const [customDesc, setCustomDesc] = useState('');

  const humanityStats = calculateHumanityAndEmp(character);
  const selectedRegion = selectedLocation ? BODY_REGIONS[selectedLocation] : null;

  // Filter cyberware installed in selected region
  const installedInRegion = character.cyberware.filter(
    (c) => c.location === selectedLocation
  );

  const usedSlotsInRegion = installedInRegion.reduce(
    (acc, curr) => acc + (curr.slots || 0),
    0
  );

  const maxSlotsInRegion = selectedRegion ? selectedRegion.maxSlots : 0;
  const freeSlotsInRegion = Math.max(0, maxSlotsInRegion - usedSlotsInRegion);

  // Available presets for this region
  const availablePresets = PRESET_CYBERWARE.filter(
    (p) => p.location === selectedLocation
  );

  // Install preset
  const handleInstallPreset = (preset: typeof PRESET_CYBERWARE[0]) => {
    if (preset.slots > freeSlotsInRegion && preset.slots > 0) {
      alert(`Espaço insuficiente! Este implante precisa de ${preset.slots} slot(s), mas restam apenas ${freeSlotsInRegion}.`);
      return;
    }

    sounds.playEquipCyberware();
    const newItem: CyberwareItem = {
      ...preset,
      id: 'cw-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    };

    onUpdateCharacter((prev) => ({
      ...prev,
      cyberware: [...prev.cyberware, newItem],
      // Optionally deduct Eurobucks if character has enough
      eurobucks: Math.max(0, prev.eurobucks - preset.costEb),
    }));
  };

  // Install custom cyberware
  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !selectedLocation) return;

    if (customSlots > freeSlotsInRegion && customSlots > 0) {
      alert(`Espaço insuficiente! Faltam slots livres nesta região.`);
      return;
    }

    sounds.playEquipCyberware();
    const newItem: CyberwareItem = {
      id: 'cw-custom-' + Date.now(),
      name: customName.trim(),
      location: selectedLocation,
      hl: Number(customHL) || 0,
      costEb: Number(customCost) || 0,
      slots: Number(customSlots) || 1,
      description: customDesc.trim() || 'Implante customizado de Night City.',
      isCustom: true,
    };

    onUpdateCharacter((prev) => ({
      ...prev,
      cyberware: [...prev.cyberware, newItem],
      eurobucks: Math.max(0, prev.eurobucks - (Number(customCost) || 0)),
    }));

    // Reset form
    setCustomName('');
    setCustomDesc('');
    setCustomHL(4);
    setCustomCost(500);
    setCustomSlots(1);
  };

  // Remove cyberware
  const handleRemoveCyberware = (id: string, name: string) => {
    if (confirm(`Desinstalar "${name}" na clínica do Ripperdoc? A Humanidade associada será restaurada.`)) {
      sounds.playClick();
      onUpdateCharacter((prev) => ({
        ...prev,
        cyberware: prev.cyberware.filter((c) => c.id !== id),
      }));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ================= 1. PAINEL DE HUMANIDADE E EMPATIA (TOPO) ================= */}
      <section className="bg-[#12131a] border border-[#232738] p-5 rounded-lg cyber-chamfer relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header line */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#232738] pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Cpu size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold font-orbitron tracking-wider text-slate-100 uppercase flex items-center gap-2">
                Clínica de Cromo // Ripperdoc OS 2077
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-400 border border-yellow-400/40">
                  SINCRONIA NEURAL
                </span>
              </h2>
              <p className="text-xs font-mono text-slate-400">
                Monitore a carga sináptica, perda de humanidade (HL) e gerencie implantes cibernéticos.
              </p>
            </div>
          </div>

          {/* Quick summary badges */}
          <div className="flex items-center gap-3">
            <div className="bg-[#0c0d14] px-3 py-1.5 rounded border border-[#282d42] font-mono text-xs flex items-center gap-2">
              <Coins size={14} className="text-yellow-400" />
              <span className="text-slate-400">Saldo:</span>
              <span className="text-yellow-400 font-bold">{character.eurobucks.toLocaleString()} eb</span>
            </div>
            <div className="bg-[#0c0d14] px-3 py-1.5 rounded border border-[#282d42] font-mono text-xs flex items-center gap-2">
              <Sparkles size={14} className="text-cyan-400" />
              <span className="text-slate-400">Implantes:</span>
              <span className="text-cyan-300 font-bold">{character.cyberware.length}</span>
            </div>
          </div>
        </div>

        {/* Humanity & EMP Gauges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          
          {/* Card: Humanidade Inicial */}
          <div className="bg-[#0a0a0f] p-3.5 rounded border border-[#1e2333] flex flex-col justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Humanidade Base</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black font-orbitron text-slate-200">{humanityStats.initialHumanity}</span>
              <span className="text-xs font-mono text-slate-500">(EMP Base {character.stats.EMP_BASE} × 10)</span>
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-2">Capacidade biológica inalterada</div>
          </div>

          {/* Card: Perda Total de HL */}
          <div className="bg-[#0a0a0f] p-3.5 rounded border border-[#1e2333] flex flex-col justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Perda de Humanidade (HL)</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black font-orbitron text-red-400">-{humanityStats.totalHL}</span>
              <span className="text-xs font-mono text-slate-500">Cromo instalado</span>
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-2">Carga no córtex pré-frontal</div>
          </div>

          {/* Card: Humanidade Atual */}
          <div className={`p-3.5 rounded border flex flex-col justify-between ${
            humanityStats.isCyberpsycho 
              ? 'bg-red-950/40 border-red-500/80 shadow-neon-red animate-pulse'
              : humanityStats.isBorderline
              ? 'bg-amber-950/30 border-yellow-500/70 shadow-neon-yellow'
              : 'bg-[#0a0a0f] border-cyan-500/50 shadow-neon-cyan'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-300 uppercase tracking-wider">Humanidade Atual</span>
              {humanityStats.isCyberpsycho && (
                <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-red-600 text-white animate-bounce">
                  MAX-TAC ALERTA
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-3xl font-black font-orbitron ${
                humanityStats.isCyberpsycho ? 'text-red-500' : humanityStats.isBorderline ? 'text-yellow-400' : 'text-cyan-400'
              }`}>
                {humanityStats.currentHumanity}
              </span>
              <span className="text-xs font-mono text-slate-400">/ {humanityStats.initialHumanity}</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  humanityStats.isCyberpsycho ? 'bg-red-600' : humanityStats.isBorderline ? 'bg-yellow-400' : 'bg-cyan-400'
                }`}
                style={{ width: `${Math.min(100, (humanityStats.currentHumanity / humanityStats.initialHumanity) * 100)}%` }}
              />
            </div>
          </div>

          {/* Card: EMP Efetivo */}
          <div className="bg-[#0a0a0f] p-3.5 rounded border border-[#1e2333] flex flex-col justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">EMP Atual (Efetivo)</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-3xl font-black font-orbitron ${humanityStats.currentEmp <= 1 ? 'text-red-400' : 'text-slate-100'}`}>
                {humanityStats.currentEmp}
              </span>
              <span className="text-xs font-mono text-slate-500">
                (⌊Humanidade / 10⌋)
              </span>
            </div>
            <div className="text-[10px] font-mono text-cyan-400/80 mt-2">
              Sincronizado c/ Perícias Sociais
            </div>
          </div>

        </div>

        {/* Cyberpsychosis Warning Alert Banner */}
        {humanityStats.isCyberpsycho && (
          <div className="mt-4 p-3 rounded bg-red-950/80 border-2 border-red-500 text-red-200 flex items-center gap-3 animate-pulse">
            <ShieldAlert size={28} className="text-red-500 flex-shrink-0 animate-bounce" />
            <div>
              <div className="font-orbitron font-black text-sm text-red-400 uppercase tracking-widest">
                [ALERTA CRÍTICO: CIBERPSICOSE MANIFESTA // NÍVEL ZERO]
              </div>
              <div className="text-xs font-mono text-red-200">
                Humanidade esgotada. O personagem perdeu a conexão com a empatia humana e torna-se um NPC hostil ou sob intervenção imediata da Divisão Max-Tac de Night City.
              </div>
            </div>
          </div>
        )}

        {humanityStats.isBorderline && !humanityStats.isCyberpsycho && (
          <div className="mt-4 p-3 rounded bg-amber-950/60 border border-yellow-500/80 text-yellow-200 flex items-center gap-3">
            <AlertTriangle size={24} className="text-yellow-400 flex-shrink-0" />
            <div>
              <div className="font-orbitron font-bold text-xs text-yellow-400 uppercase tracking-wider">
                [AVISO TÁTICO: RISCO DE CIBERPSICOSE (HUMANIDADE &lt; 20)]
              </div>
              <div className="text-xs font-mono text-yellow-200/90">
                Sintomas de desconexão psicológica, espasmos neurais e instabilidade emocional. Recomenda-se terapia neural ou desinstalação de cromo com um Ripperdoc.
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ================= 2. DIAGRAMA SVG & PAINEL LATERAL ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* SVG Diagram Area (8 cols) */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col items-center">
          <CyberBodySvg
            selectedLocation={selectedLocation}
            onSelectLocation={(loc) => setSelectedLocation(loc)}
            cyberware={character.cyberware}
          />
          <div className="text-center font-mono text-xs text-slate-500 mt-2 flex items-center justify-center gap-2">
            <Info size={14} className="text-cyan-400" />
            Clique nas partes do corpo ou nos botões HUD para inspecionar e gerenciar os slots.
          </div>
        </div>

        {/* Drawer / Management Panel (5 cols) */}
        <div className="lg:col-span-5 xl:col-span-5 bg-[#12131a] border border-[#232738] rounded-lg cyber-chamfer p-5 shadow-2xl relative">
          
          {selectedRegion ? (
            <div className="space-y-4">
              {/* Region Header */}
              <div className="flex items-start justify-between border-b border-[#232738] pb-3">
                <div>
                  <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border inline-block mb-1 ${
                    selectedRegion.location === 'fashionware' ? 'bg-pink-950/70 border-pink-500/50 text-pink-300 font-bold' :
                    selectedRegion.location === 'borgware' ? 'bg-purple-950/70 border-purple-500/50 text-purple-300 font-bold' :
                    'bg-yellow-400/10 border-yellow-400/30 text-yellow-400'
                  }`}>
                    {selectedRegion.categoryName}
                  </span>
                  <h3 className="text-lg font-bold font-orbitron text-slate-100 uppercase">
                    {selectedRegion.title}
                  </h3>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">
                    {selectedRegion.description}
                  </p>
                </div>
                {/* Free / Used Slots Gauge */}
                <div className="text-right">
                  <div className="text-xs font-mono text-slate-400">SLOTS</div>
                  <div className="text-base font-bold font-orbitron">
                    <span className={freeSlotsInRegion === 0 ? 'text-red-400' : 'text-cyan-400'}>
                      {usedSlotsInRegion}
                    </span>
                    <span className="text-slate-500"> / {selectedRegion.maxSlots}</span>
                  </div>
                </div>
              </div>

              {/* Slot Visual Indicators */}
              <div className="flex gap-1.5 py-1">
                {Array.from({ length: selectedRegion.maxSlots }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 flex-1 rounded-sm transition-all duration-300 ${
                      idx < usedSlotsInRegion
                        ? 'bg-yellow-400 shadow-[0_0_6px_rgba(252,238,10,0.5)]'
                        : 'bg-[#1e2333] border border-[#2d334a]'
                    }`}
                    title={`Slot ${idx + 1}: ${idx < usedSlotsInRegion ? 'Ocupado' : 'Livre'}`}
                  />
                ))}
              </div>

              {/* Installed Cyberware List */}
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Implantes Instalados ({installedInRegion.length})</span>
                  <span className="text-[11px] text-slate-500">HL Total: {installedInRegion.reduce((a, b) => a + b.hl, 0)}</span>
                </div>

                {installedInRegion.length === 0 ? (
                  <div className="p-4 rounded border border-dashed border-[#232738] text-center font-mono text-xs text-slate-500">
                    Nenhum implante instalado nesta região corporal.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {installedInRegion.map((item) => (
                      <div
                        key={item.id}
                        className="bg-[#0a0a0f] border border-[#1f2436] hover:border-cyan-500/40 p-2.5 rounded transition-all duration-200 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-bold text-sm text-slate-200 flex items-center gap-1.5">
                              {item.name}
                              {item.isDefault && (
                                <span className="text-[9px] font-mono px-1 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-500/30">
                                  PADRÃO 2077
                                </span>
                              )}
                              {item.isCustom && (
                                <span className="text-[9px] font-mono px-1 rounded bg-purple-900/60 text-purple-300 border border-purple-500/30">
                                  CUSTOM
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400 mt-0.5 line-clamp-2">
                              {item.description}
                            </div>
                          </div>

                          {!item.isDefault && (
                            <button
                              onClick={() => handleRemoveCyberware(item.id, item.name)}
                              className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-red-500/10 transition-colors"
                              title="Desinstalar implante"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-2 font-mono text-[11px] text-slate-400 pt-1 border-t border-[#191d2c]">
                          <span className="text-red-400">HL: {item.hl}</span>
                          <span className="text-yellow-400">{item.costEb.toLocaleString()} eb</span>
                          <span className="text-cyan-400">{item.slots} {item.slots === 1 ? 'Slot' : 'Slots'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tabs: Catálogo ou Custom */}
              <div className="pt-2 border-t border-[#232738]">
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => { sounds.playClick(); setActiveTab('catalog'); }}
                    className={`flex-1 py-1.5 px-3 text-xs font-orbitron font-bold uppercase transition-all rounded ${
                      activeTab === 'catalog'
                        ? 'bg-yellow-400 text-black shadow-neon-yellow'
                        : 'bg-[#151724] text-slate-400 hover:text-white'
                    }`}
                  >
                    Catálogo 2077 / RED
                  </button>
                  <button
                    onClick={() => { sounds.playClick(); setActiveTab('custom'); }}
                    className={`flex-1 py-1.5 px-3 text-xs font-orbitron font-bold uppercase transition-all rounded ${
                      activeTab === 'custom'
                        ? 'bg-cyan-400 text-black shadow-neon-cyan'
                        : 'bg-[#151724] text-slate-400 hover:text-white'
                    }`}
                  >
                    Customizado
                  </button>
                </div>

                {/* Tab: Catálogo */}
                {activeTab === 'catalog' && (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {availablePresets.length === 0 ? (
                      <div className="text-center font-mono text-xs text-slate-500 py-4">
                        Nenhum modelo pré-cadastrado exclusivo para esta região. Use a aba "Customizado" para criar.
                      </div>
                    ) : (
                      availablePresets.map((preset, idx) => {
                        const alreadyInstalled = installedInRegion.some(
                          (c) => c.name === preset.name
                        );
                        const canInstall = freeSlotsInRegion >= preset.slots && !alreadyInstalled;

                        return (
                          <div
                            key={idx}
                            className="bg-[#0e1017] border border-[#1e2333] hover:border-yellow-400/40 p-2.5 rounded transition-all flex flex-col justify-between gap-2"
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-sm text-slate-100">{preset.name}</span>
                                <span className="text-xs font-mono font-bold text-yellow-400">
                                  {preset.costEb > 0 ? `${preset.costEb} eb` : 'GRÁTIS'}
                                </span>
                              </div>
                              <p className="text-[11px] font-mono text-slate-400 mt-1">
                                {preset.description}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-[#181c28]">
                              <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
                                <span className="text-red-400">HL: {preset.hl}</span>
                                <span className="text-cyan-400">{preset.slots} {preset.slots === 1 ? 'Slot' : 'Slots'}</span>
                              </div>

                              <button
                                disabled={!canInstall}
                                onClick={() => handleInstallPreset(preset)}
                                className={`px-2.5 py-1 text-xs font-mono font-bold uppercase rounded transition-all flex items-center gap-1 ${
                                  alreadyInstalled
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    : canInstall
                                    ? 'bg-yellow-400 text-black hover:bg-yellow-300 shadow-sm'
                                    : 'bg-red-950/40 text-red-400 border border-red-800/40 cursor-not-allowed'
                                }`}
                              >
                                {alreadyInstalled ? (
                                  <>
                                    <CheckCircle2 size={12} /> Instalado
                                  </>
                                ) : canInstall ? (
                                  <>
                                    <Plus size={12} /> Instalar
                                  </>
                                ) : (
                                  'Sem Slots'
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* Tab: Custom Cyberware Form */}
                {activeTab === 'custom' && (
                  <form onSubmit={handleAddCustom} className="space-y-3 bg-[#0e1017] p-3 rounded border border-[#1e2333]">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        Nome do Implante
                      </label>
                      <input
                        type="text"
                        required
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="Ex: Lâmina Térmica Experimental"
                        className="w-full bg-[#08090d] border border-[#282d42] px-2.5 py-1.5 rounded text-sm text-slate-100 font-mono focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Perda HL
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="28"
                          value={customHL}
                          onChange={(e) => setCustomHL(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-[#08090d] border border-[#282d42] px-2 py-1 rounded text-sm text-red-400 font-mono text-center focus:border-cyan-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Custo (eb)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={customCost}
                          onChange={(e) => setCustomCost(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-[#08090d] border border-[#282d42] px-2 py-1 rounded text-sm text-yellow-400 font-mono text-center focus:border-cyan-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Slots
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="4"
                          value={customSlots}
                          onChange={(e) => setCustomSlots(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full bg-[#08090d] border border-[#282d42] px-2 py-1 rounded text-sm text-cyan-400 font-mono text-center focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        Descrição do Efeito
                      </label>
                      <textarea
                        rows={2}
                        value={customDesc}
                        onChange={(e) => setCustomDesc(e.target.value)}
                        placeholder="Efeitos no combate, bônus em testes ou regras especiais..."
                        className="w-full bg-[#08090d] border border-[#282d42] px-2.5 py-1.5 rounded text-xs text-slate-200 font-mono focus:border-cyan-400 focus:outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={freeSlotsInRegion < customSlots}
                      className={`w-full py-2 rounded text-xs font-orbitron font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 ${
                        freeSlotsInRegion >= customSlots
                          ? 'bg-cyan-400 text-black hover:bg-cyan-300 shadow-neon-cyan'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Wrench size={14} /> Salvar e Instalar Cromo
                    </button>
                  </form>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500 font-mono">
              Selecione uma região corporal no diagrama ao lado.
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
