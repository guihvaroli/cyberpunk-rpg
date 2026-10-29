import React from 'react';
import { CyberwareItem, CyberwareLocation } from '../types/character';
import { BODY_REGIONS } from '../data/cyberwareCatalog';
import { 
  Brain, 
  Eye, 
  Headphones, 
  HeartPulse, 
  ShieldAlert, 
  Paintbrush, 
  Cog, 
  Cpu, 
  Zap 
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface CyberBodySvgProps {
  selectedLocation: CyberwareLocation | null;
  onSelectLocation: (loc: CyberwareLocation) => void;
  cyberware: CyberwareItem[];
}

export const CyberBodySvg: React.FC<CyberBodySvgProps> = ({
  selectedLocation,
  onSelectLocation,
  cyberware,
}) => {
  // Count installed implants per location
  const getCount = (loc: CyberwareLocation) => {
    return cyberware.filter((c) => c.location === loc).length;
  };

  const handleClick = (loc: CyberwareLocation) => {
    sounds.playClick();
    onSelectLocation(loc);
  };

  const isSelected = (loc: CyberwareLocation) => selectedLocation === loc;

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center p-2 space-y-4">
      
      {/* ================= 1. BOTÕES EXTERNOS (FORA DA IMAGEM DO CORPO): FASHIONWARE & BORGWARE ================= */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 bg-[#0d0f17] border border-[#23283d] p-3 rounded-lg cyber-chamfer shadow-lg">
        <div className="font-mono text-xs text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-slate-300 font-bold uppercase tracking-wider">CROMO ESPECIAL & ESTRUTURAL (FORA DO DIAGRAMA ANATÔMICO):</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Fashionware: Pincel Rosa */}
          <button
            onClick={() => handleClick('fashionware')}
            className={`px-4 py-2 rounded cyber-chamfer border transition-all duration-300 flex items-center gap-2.5 font-orbitron text-xs font-bold tracking-wide ${
              isSelected('fashionware')
                ? 'bg-pink-950/80 border-pink-400 text-pink-300 shadow-[0_0_15px_rgba(244,114,182,0.4)] ring-1 ring-pink-400'
                : 'bg-[#15121e] border-pink-600/50 text-pink-400 hover:border-pink-400 hover:bg-pink-950/40'
            }`}
            title="Fashionware: Biomonitor, Chemskin, EMP Threading, Light Tattoo, Shift Tacts, Skinwatch, Techhair (0 HL)"
          >
            <div className={`p-1.5 rounded ${isSelected('fashionware') ? 'bg-pink-500 text-white shadow-[0_0_10px_#ec4899]' : 'bg-pink-500/20 text-pink-400'}`}>
              <Paintbrush size={16} className="animate-bounce" style={{ animationDuration: '3s' }} />
            </div>
            <div className="text-left">
              <div className="text-pink-300 font-black">FASHIONWARE (0 HL)</div>
              <div className="text-[10px] font-mono text-pink-400/80 font-normal">
                {getCount('fashionware')}/{BODY_REGIONS.fashionware.maxSlots} Slots • Estética
              </div>
            </div>
          </button>

          {/* Borgware: Engrenagem Roxa */}
          <button
            onClick={() => handleClick('borgware')}
            className={`px-4 py-2 rounded cyber-chamfer border transition-all duration-300 flex items-center gap-2.5 font-orbitron text-xs font-bold tracking-wide ${
              isSelected('borgware')
                ? 'bg-purple-950/80 border-purple-400 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)] ring-1 ring-purple-400'
                : 'bg-[#141122] border-purple-600/50 text-purple-400 hover:border-purple-400 hover:bg-purple-950/40'
            }`}
            title="Borgware: Linear Frame Beta/Sigma, Artificial Shoulder Mount, MultiOptic Mount, Sensor Array"
          >
            <div className={`p-1.5 rounded ${isSelected('borgware') ? 'bg-purple-600 text-white shadow-[0_0_10px_#a855f7]' : 'bg-purple-500/20 text-purple-400'}`}>
              <Cog size={16} className="animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <div className="text-left">
              <div className="text-purple-300 font-black">BORGWARE</div>
              <div className="text-[10px] font-mono text-purple-400/80 font-normal">
                {getCount('borgware')}/{BODY_REGIONS.borgware.maxSlots} Slots • Cromo Pesado
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* ================= 2. DIAGRAMA BIOMÉTRICO CENTRAL COM O CORPO ================= */}
      <div className="relative w-full aspect-[4/3] max-h-[640px] bg-[#0c0d14] border border-[#1e2233] cyber-chamfer rounded-lg overflow-hidden flex items-center justify-center p-2 shadow-2xl">
        
        {/* Subtle grid and radar background */}
        <div className="absolute inset-0 cyber-grid-pattern opacity-40 pointer-events-none" />
        <div className="absolute w-[500px] h-[500px] rounded-full border border-cyan-500/10 pointer-events-none animate-spin" style={{ animationDuration: '60s' }} />
        <div className="absolute w-[360px] h-[360px] rounded-full border border-dashed border-yellow-400/15 pointer-events-none animate-spin" style={{ animationDuration: '40s', animationDirection: 'reverse' }} />
        
        {/* Corner HUD labels */}
        <div className="absolute top-3 left-4 font-mono text-[10px] text-cyan-400/70 tracking-widest uppercase flex items-center gap-1.5 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
          SYSTEM: ARASAKA BIOMETRICS v2.077 // DIAGRAMA ANATÔMICO
        </div>
        <div className="absolute top-3 right-4 font-mono text-[10px] text-yellow-400/70 tracking-widest uppercase pointer-events-none">
          ID: NIGHT-CITY-RIPPERDOC
        </div>
        <div className="absolute bottom-3 left-4 font-mono text-[10px] text-slate-500 tracking-wider pointer-events-none">
          CALIBRAÇÃO DE CROMO // 8 TIPOS DE CIBERNÉTICA
        </div>
        <div className="absolute bottom-3 right-4 font-mono text-[10px] text-cyan-400/80 tracking-wider pointer-events-none">
          TOTAL IMPLANTES INSTALADOS: {cyberware.length}
        </div>

        {/* Central Cyborg Silhouette SVG */}
        <svg
          viewBox="0 0 800 680"
          className="w-full h-full max-h-[600px] drop-shadow-[0_0_15px_rgba(0,240,255,0.15)] select-none"
        >
          <defs>
            <linearGradient id="cyberGlowCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0080FF" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="cyberGlowYellow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FCEE0A" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FF8800" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e2438" />
              <stop offset="50%" stopColor="#141824" />
              <stop offset="100%" stopColor="#0d1017" />
            </linearGradient>
            <filter id="neonFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Central Anatomy Guide Lines */}
          <line x1="400" y1="40" x2="400" y2="640" stroke="#00F0FF" strokeWidth="1" strokeDasharray="3 6" opacity="0.3" />

          {/* ================= CYBORG SILHOUETTE ================= */}
          <g transform="translate(0, 0)">
            {/* Head & Neck */}
            <path
              d="M375,100 L425,100 L435,130 L420,165 L405,175 L395,175 L380,165 L365,130 Z"
              fill="url(#bodyGradient)"
              stroke="#00F0FF"
              strokeWidth="1.5"
              opacity="0.85"
            />
            {/* Cranium / Neuralware Area (Topo da Cabeça) */}
            <path
              d="M380,105 Q400,90 420,105 Q430,120 425,135 L375,135 Q370,120 380,105 Z"
              fill={isSelected('neuralware') ? '#FCEE0A33' : '#00F0FF15'}
              stroke={isSelected('neuralware') ? '#FCEE0A' : '#00F0FF'}
              strokeWidth={isSelected('neuralware') ? '2.5' : '1.5'}
              className="cursor-pointer transition-all duration-300 hover:fill-yellow-400/20"
              onClick={() => handleClick('neuralware')}
            />
            
            {/* Cyber Eyes (Olhos) */}
            <g
              className="cursor-pointer group"
              onClick={() => handleClick('cyberoptics')}
            >
              <circle 
                cx="390" 
                cy="128" 
                r={isSelected('cyberoptics') ? 5 : 4} 
                fill={isSelected('cyberoptics') ? '#FCEE0A' : '#00F0FF'} 
                className="animate-pulse" 
              />
              <circle 
                cx="410" 
                cy="128" 
                r={isSelected('cyberoptics') ? 5 : 4} 
                fill={isSelected('cyberoptics') ? '#FCEE0A' : '#00F0FF'} 
                className="animate-pulse" 
              />
            </g>

            {/* Cyber Ears (Ouvidos) */}
            <g
              className="cursor-pointer group"
              onClick={() => handleClick('cyberaudio')}
            >
              <circle 
                cx="365" 
                cy="135" 
                r={isSelected('cyberaudio') ? 4 : 3} 
                fill={isSelected('cyberaudio') ? '#FCEE0A' : '#00F0FF'} 
              />
              <circle 
                cx="435" 
                cy="135" 
                r={isSelected('cyberaudio') ? 4 : 3} 
                fill={isSelected('cyberaudio') ? '#FCEE0A' : '#00F0FF'} 
              />
            </g>

            {/* Neck */}
            <path d="M390,175 L390,195 L410,195 L410,175 Z" fill="#181e2b" stroke="#00F0FF" strokeWidth="1" opacity="0.6" />

            {/* Torso & Chest Plates */}
            <path
              d="M360,195 L440,195 L460,240 L450,320 L425,350 L375,350 L350,320 L340,240 Z"
              fill="url(#bodyGradient)"
              stroke="#00F0FF"
              strokeWidth="2"
              opacity="0.9"
            />

            {/* Internal Body Cyberware (Centro do Boneco / Peito) */}
            <g
              className="cursor-pointer group"
              onClick={() => handleClick('internal')}
            >
              <path
                d="M375,215 L425,215 L430,265 L400,295 L370,265 Z"
                fill={isSelected('internal') ? '#FCEE0A33' : '#FF003C15'}
                stroke={isSelected('internal') ? '#FCEE0A' : '#FF003C'}
                strokeWidth={isSelected('internal') ? '2.5' : '1.5'}
                strokeDasharray={isSelected('internal') ? 'none' : '4 2'}
                className="transition-all duration-300 group-hover:fill-red-500/30"
              />
              {/* Core Heart Reactor / Biomonitor */}
              <circle
                cx="400"
                cy="250"
                r="12"
                fill={isSelected('internal') ? '#FF003C' : '#00F0FF'}
                opacity="0.7"
                className="animate-ping"
                style={{ animationDuration: '3s' }}
              />
              <circle
                cx="400"
                cy="250"
                r="6"
                fill={isSelected('internal') ? '#FCEE0A' : '#FFFFFF'}
              />
            </g>

            {/* Shoulders */}
            <circle cx="340" cy="210" r="14" fill="#181e2b" stroke="#00F0FF" strokeWidth="1.5" />
            <circle cx="460" cy="210" r="14" fill="#181e2b" stroke="#00F0FF" strokeWidth="1.5" />

            {/* Braço Esquerdo (Cyberarm - Lado Esquerdo da Imagem) */}
            <g
              className="cursor-pointer group"
              onClick={() => handleClick('cyberarm')}
            >
              <path
                d="M330,220 L310,290 L300,380 L315,385 L328,295 L345,225 Z"
                fill={isSelected('cyberarm') ? '#FCEE0A33' : 'url(#bodyGradient)'}
                stroke={isSelected('cyberarm') ? '#FCEE0A' : '#00F0FF'}
                strokeWidth={isSelected('cyberarm') ? '2.5' : '1.5'}
                className="transition-all duration-300 group-hover:stroke-yellow-400"
              />
              {/* Hand */}
              <polygon points="295,385 315,385 318,415 292,415" fill="#1e2438" stroke="#00F0FF" strokeWidth="1" />
              {/* Blade circuit line */}
              <line x1="310" y1="300" x2="305" y2="370" stroke="#FF003C" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
            </g>

            {/* Braço Direito (External Body Cyberware - Lado Direito da Imagem) */}
            <g
              className="cursor-pointer group"
              onClick={() => handleClick('external')}
            >
              <path
                d="M470,220 L490,290 L500,380 L485,385 L472,295 L455,225 Z"
                fill={isSelected('external') ? '#FCEE0A33' : 'url(#bodyGradient)'}
                stroke={isSelected('external') ? '#FCEE0A' : '#00F0FF'}
                strokeWidth={isSelected('external') ? '2.5' : '1.5'}
                className="transition-all duration-300 group-hover:stroke-yellow-400"
              />
              {/* Hand */}
              <polygon points="485,385 505,385 508,415 482,415" fill="#1e2438" stroke="#00F0FF" strokeWidth="1" />
              {/* Subdermal mesh indicator */}
              <line x1="490" y1="300" x2="495" y2="370" stroke="#00F0FF" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
            </g>

            {/* Pelvis */}
            <polygon points="370,350 430,350 420,390 380,390" fill="#141824" stroke="#00F0FF" strokeWidth="1.5" />

            {/* Perna Esquerda (Cyberleg - Lado Esquerdo da Imagem) */}
            <g
              className="cursor-pointer group"
              onClick={() => handleClick('cyberleg')}
            >
              <path
                d="M375,390 L360,490 L350,590 L380,590 L395,490 L400,390 Z"
                fill={isSelected('cyberleg') ? '#FCEE0A33' : 'url(#bodyGradient)'}
                stroke={isSelected('cyberleg') ? '#FCEE0A' : '#00F0FF'}
                strokeWidth={isSelected('cyberleg') ? '2.5' : '1.5'}
                className="transition-all duration-300 group-hover:stroke-yellow-400"
              />
              {/* Foot */}
              <polygon points="345,590 380,590 385,615 335,615" fill="#181e2b" stroke="#00F0FF" strokeWidth="1" />
              {/* Hydraulic piston indicator */}
              <line x1="375" y1="410" x2="368" y2="480" stroke="#00F0FF" strokeWidth="2" strokeDasharray="4 2" />
            </g>

            {/* Perna Direita (Complementar) */}
            <g className="cursor-pointer group" onClick={() => handleClick('cyberleg')}>
              <path
                d="M425,390 L440,490 L450,590 L420,590 L405,490 L400,390 Z"
                fill={isSelected('cyberleg') ? '#FCEE0A22' : 'url(#bodyGradient)'}
                stroke={isSelected('cyberleg') ? '#FCEE0A' : '#00F0FF'}
                strokeWidth="1.5"
                opacity="0.75"
              />
              <polygon points="420,590 455,590 465,615 415,615" fill="#181e2b" stroke="#00F0FF" strokeWidth="1" />
            </g>
          </g>

          {/* ================= CONNECTOR LINES & TARGET NODES (EXATAMENTE COMO PEDIDO) ================= */}

          {/* 1. NEURALWARE: No topo da cabeça */}
          <g>
            <polyline
              points="400,100 400,65"
              fill="none"
              stroke={isSelected('neuralware') ? '#FCEE0A' : '#00F0FF'}
              strokeWidth={isSelected('neuralware') ? '2.5' : '1.5'}
              strokeDasharray={isSelected('neuralware') ? 'none' : '4 3'}
            />
            <circle cx="400" cy="100" r="4" fill="#FCEE0A" />
            <circle cx="400" cy="65" r="4" fill="#00F0FF" />
          </g>

          {/* 2. CYBEROPTICS: Nos olhos do lado esquerdo da imagem */}
          <g>
            <polyline
              points="390,128 300,128 210,128"
              fill="none"
              stroke={isSelected('cyberoptics') ? '#FCEE0A' : '#00F0FF'}
              strokeWidth={isSelected('cyberoptics') ? '2.5' : '1.5'}
              strokeDasharray={isSelected('cyberoptics') ? 'none' : '4 2'}
            />
            <circle cx="390" cy="128" r="3" fill="#00F0FF" />
            <circle cx="210" cy="128" r="4" fill="#FCEE0A" />
          </g>

          {/* 3. CYBERAUDIO: Na orelha do lado direito da imagem */}
          <g>
            <polyline
              points="435,135 520,135 590,135"
              fill="none"
              stroke={isSelected('cyberaudio') ? '#FCEE0A' : '#00F0FF'}
              strokeWidth={isSelected('cyberaudio') ? '2.5' : '1.5'}
              strokeDasharray={isSelected('cyberaudio') ? 'none' : '4 2'}
            />
            <circle cx="435" cy="135" r="3" fill="#00F0FF" />
            <circle cx="590" cy="135" r="4" fill="#FCEE0A" />
          </g>

          {/* 4. INTERNAL BODY CYBERWARE: Apontando para o centro do boneco */}
          <g>
            <polyline
              points="400,250 490,250 590,250"
              fill="none"
              stroke={isSelected('internal') ? '#FCEE0A' : '#FF003C'}
              strokeWidth={isSelected('internal') ? '2.5' : '1.5'}
              strokeDasharray={isSelected('internal') ? 'none' : '4 2'}
            />
            <circle cx="400" cy="250" r="4" fill="#FF003C" />
            <circle cx="590" cy="250" r="4" fill="#FCEE0A" />
          </g>

          {/* 5. EXTERNAL BODY CYBERWARE: Apontando para o braço direito */}
          <g>
            <polyline
              points="485,340 540,340 590,360"
              fill="none"
              stroke={isSelected('external') ? '#FCEE0A' : '#00F0FF'}
              strokeWidth={isSelected('external') ? '2.5' : '1.5'}
              strokeDasharray={isSelected('external') ? 'none' : '4 2'}
            />
            <circle cx="485" cy="340" r="3" fill="#00F0FF" />
            <circle cx="590" cy="360" r="4" fill="#FCEE0A" />
          </g>

          {/* 6. CYBERARM: Apontando para o braço esquerdo */}
          <g>
            <polyline
              points="310,330 250,330 200,330"
              fill="none"
              stroke={isSelected('cyberarm') ? '#FCEE0A' : '#00F0FF'}
              strokeWidth={isSelected('cyberarm') ? '2.5' : '1.5'}
              strokeDasharray={isSelected('cyberarm') ? 'none' : '4 2'}
            />
            <circle cx="310" cy="330" r="3" fill="#FF003C" />
            <circle cx="200" cy="330" r="4" fill="#FCEE0A" />
          </g>

          {/* 7. CYBERLEG: Apontando para a perna esquerda */}
          <g>
            <polyline
              points="360,510 280,510 200,510"
              fill="none"
              stroke={isSelected('cyberleg') ? '#FCEE0A' : '#00F0FF'}
              strokeWidth={isSelected('cyberleg') ? '2.5' : '1.5'}
              strokeDasharray={isSelected('cyberleg') ? 'none' : '4 2'}
            />
            <circle cx="360" cy="510" r="3" fill="#00F0FF" />
            <circle cx="200" cy="510" r="4" fill="#FCEE0A" />
          </g>
        </svg>

        {/* ================= FLOATING INTERACTIVE HUD BUTTONS (OVERLAY) ================= */}

        {/* 1. NEURALWARE: No topo da cabeça */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <button
            onClick={() => handleClick('neuralware')}
            className={`group text-left px-3.5 py-2 cyber-chamfer border transition-all duration-200 backdrop-blur-md flex items-center gap-2.5 ${
              isSelected('neuralware')
                ? 'bg-yellow-400/25 border-yellow-400 text-yellow-300 shadow-[0_0_15px_rgba(252,238,10,0.4)]'
                : 'bg-[#12141f]/90 border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:bg-[#1a1e2e]'
            }`}
          >
            <div className={`p-1.5 rounded ${isSelected('neuralware') ? 'bg-yellow-400 text-black' : 'bg-cyan-500/20 text-cyan-400'}`}>
              <Brain size={16} />
            </div>
            <div>
              <div className="text-[11px] font-bold tracking-wider font-orbitron uppercase">1. Neuralware (Topo da Cabeça)</div>
              <div className="text-[10px] font-mono text-slate-400 flex items-center gap-2">
                <span>Slots: {getCount('neuralware')}/{BODY_REGIONS.neuralware.maxSlots}</span>
                <span className="text-yellow-400 font-bold">Neuroport 2077</span>
              </div>
            </div>
          </button>
        </div>

        {/* 2. CYBEROPTICS: Nos olhos do lado esquerdo da imagem */}
        <div className="absolute top-24 left-2 md:left-6 z-10">
          <button
            onClick={() => handleClick('cyberoptics')}
            className={`group text-left px-3 py-2 cyber-chamfer border transition-all duration-200 backdrop-blur-md flex items-center gap-2.5 ${
              isSelected('cyberoptics')
                ? 'bg-yellow-400/25 border-yellow-400 text-yellow-300 shadow-[0_0_15px_rgba(252,238,10,0.4)]'
                : 'bg-[#12141f]/90 border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:bg-[#1a1e2e]'
            }`}
          >
            <div className={`p-1.5 rounded ${isSelected('cyberoptics') ? 'bg-yellow-400 text-black' : 'bg-cyan-500/20 text-cyan-400'}`}>
              <Eye size={15} />
            </div>
            <div>
              <div className="text-[11px] font-bold font-orbitron uppercase">2. Cyberoptics (Olhos)</div>
              <div className="text-[10px] font-mono text-slate-400">Slots: {getCount('cyberoptics')}/{BODY_REGIONS.cyberoptics.maxSlots}</div>
            </div>
          </button>
        </div>

        {/* 3. CYBERAUDIO: Na orelha do lado direito da imagem */}
        <div className="absolute top-24 right-2 md:right-6 z-10">
          <button
            onClick={() => handleClick('cyberaudio')}
            className={`group text-left px-3 py-2 cyber-chamfer border transition-all duration-200 backdrop-blur-md flex items-center gap-2.5 ${
              isSelected('cyberaudio')
                ? 'bg-yellow-400/25 border-yellow-400 text-yellow-300 shadow-[0_0_15px_rgba(252,238,10,0.4)]'
                : 'bg-[#12141f]/90 border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:bg-[#1a1e2e]'
            }`}
          >
            <div className={`p-1.5 rounded ${isSelected('cyberaudio') ? 'bg-yellow-400 text-black' : 'bg-cyan-500/20 text-cyan-400'}`}>
              <Headphones size={15} />
            </div>
            <div>
              <div className="text-[11px] font-bold font-orbitron uppercase">3. Cyberaudio (Orelha)</div>
              <div className="text-[10px] font-mono text-slate-400">Slots: {getCount('cyberaudio')}/{BODY_REGIONS.cyberaudio.maxSlots}</div>
            </div>
          </button>
        </div>

        {/* 4. INTERNAL BODY CYBERWARE: Apontando para o centro do boneco */}
        <div className="absolute top-52 right-2 md:right-6 z-10">
          <button
            onClick={() => handleClick('internal')}
            className={`group text-left px-3 py-2 cyber-chamfer border transition-all duration-200 backdrop-blur-md flex items-center gap-2.5 ${
              isSelected('internal')
                ? 'bg-yellow-400/25 border-yellow-400 text-yellow-300 shadow-[0_0_15px_rgba(252,238,10,0.4)]'
                : 'bg-[#12141f]/90 border-red-500/40 text-red-300 hover:border-red-400 hover:bg-[#1a1e2e]'
            }`}
          >
            <div className={`p-1.5 rounded ${isSelected('internal') ? 'bg-yellow-400 text-black' : 'bg-red-500/20 text-red-400'}`}>
              <HeartPulse size={16} />
            </div>
            <div>
              <div className="text-[11px] font-bold font-orbitron uppercase">4. Internal Cyberware (Centro)</div>
              <div className="text-[10px] font-mono text-slate-400">Slots: {getCount('internal')}/{BODY_REGIONS.internal.maxSlots}</div>
            </div>
          </button>
        </div>

        {/* 5. EXTERNAL BODY CYBERWARE: Apontando para o braço direito */}
        <div className="absolute bottom-44 right-2 md:right-6 z-10">
          <button
            onClick={() => handleClick('external')}
            className={`group text-left px-3 py-2 cyber-chamfer border transition-all duration-200 backdrop-blur-md flex items-center gap-2.5 ${
              isSelected('external')
                ? 'bg-yellow-400/25 border-yellow-400 text-yellow-300 shadow-[0_0_15px_rgba(252,238,10,0.4)]'
                : 'bg-[#12141f]/90 border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:bg-[#1a1e2e]'
            }`}
          >
            <div className={`p-1.5 rounded ${isSelected('external') ? 'bg-yellow-400 text-black' : 'bg-cyan-500/20 text-cyan-400'}`}>
              <ShieldAlert size={15} />
            </div>
            <div>
              <div className="text-[11px] font-bold font-orbitron uppercase">5. External Cyberware (Braço Dir.)</div>
              <div className="text-[10px] font-mono text-slate-400">Slots: {getCount('external')}/{BODY_REGIONS.external.maxSlots}</div>
            </div>
          </button>
        </div>

        {/* 6. CYBERARM: Apontando para o braço esquerdo */}
        <div className="absolute top-72 left-2 md:left-6 z-10">
          <button
            onClick={() => handleClick('cyberarm')}
            className={`group text-left px-3 py-2 cyber-chamfer border transition-all duration-200 backdrop-blur-md flex items-center gap-2.5 ${
              isSelected('cyberarm')
                ? 'bg-yellow-400/25 border-yellow-400 text-yellow-300 shadow-[0_0_15px_rgba(252,238,10,0.4)]'
                : 'bg-[#12141f]/90 border-red-500/40 text-red-300 hover:border-red-400 hover:bg-[#1a1e2e]'
            }`}
          >
            <div className={`p-1.5 rounded ${isSelected('cyberarm') ? 'bg-yellow-400 text-black' : 'bg-red-500/20 text-red-400'}`}>
              <Cpu size={15} />
            </div>
            <div>
              <div className="text-[11px] font-bold font-orbitron uppercase">6. Cyberarm (Braço Esq.)</div>
              <div className="text-[10px] font-mono text-slate-400">Slots: {getCount('cyberarm')}/{BODY_REGIONS.cyberarm.maxSlots}</div>
            </div>
          </button>
        </div>

        {/* 7. CYBERLEG: Apontando para a perna esquerda */}
        <div className="absolute bottom-16 left-2 md:left-6 z-10">
          <button
            onClick={() => handleClick('cyberleg')}
            className={`group text-left px-3 py-2 cyber-chamfer border transition-all duration-200 backdrop-blur-md flex items-center gap-2.5 ${
              isSelected('cyberleg')
                ? 'bg-yellow-400/25 border-yellow-400 text-yellow-300 shadow-[0_0_15px_rgba(252,238,10,0.4)]'
                : 'bg-[#12141f]/90 border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:bg-[#1a1e2e]'
            }`}
          >
            <div className={`p-1.5 rounded ${isSelected('cyberleg') ? 'bg-yellow-400 text-black' : 'bg-cyan-500/20 text-cyan-400'}`}>
              <Zap size={15} />
            </div>
            <div>
              <div className="text-[11px] font-bold font-orbitron uppercase">7. Cyberleg (Perna Esq.)</div>
              <div className="text-[10px] font-mono text-slate-400">Slots: {getCount('cyberleg')}/{BODY_REGIONS.cyberleg.maxSlots}</div>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};
