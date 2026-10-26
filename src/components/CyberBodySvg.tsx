import React from 'react';
import { CyberwareItem, CyberwareLocation } from '../types/character';
import { BODY_REGIONS } from '../data/cyberwareCatalog';
import { Brain, Eye, Headphones, HeartPulse, ShieldAlert, Zap, Cpu, Activity } from 'lucide-react';
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
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-4">
      {/* Sci-Fi Background Tech Rings & Scan Effect */}
      <div className="relative w-full aspect-[4/3] max-h-[620px] bg-[#0c0d14] border border-[#1e2233] cyber-chamfer rounded-lg overflow-hidden flex items-center justify-center p-2 shadow-2xl">
        
        {/* Subtle grid and radar circles */}
        <div className="absolute inset-0 cyber-grid-pattern opacity-40 pointer-events-none" />
        <div className="absolute w-[500px] h-[500px] rounded-full border border-cyan-500/10 pointer-events-none animate-spin" style={{ animationDuration: '60s' }} />
        <div className="absolute w-[360px] h-[360px] rounded-full border border-dashed border-yellow-400/15 pointer-events-none animate-spin" style={{ animationDuration: '40s', animationDirection: 'reverse' }} />
        
        {/* Corner HUD labels */}
        <div className="absolute top-3 left-4 font-mono text-[10px] text-cyan-400/70 tracking-widest uppercase flex items-center gap-1.5 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
          SYSTEM: NEUROLINK HUD v2.077 // DIAGRAMA BIOMÉTRICO
        </div>
        <div className="absolute top-3 right-4 font-mono text-[10px] text-yellow-400/70 tracking-widest uppercase pointer-events-none">
          SEC-ID: 77-ARASAKA-BIO
        </div>
        <div className="absolute bottom-3 left-4 font-mono text-[10px] text-slate-500 tracking-wider pointer-events-none">
          CALIBRAÇÃO DE CROMO // RIPPERDOC OPERACIONAL
        </div>
        <div className="absolute bottom-3 right-4 font-mono text-[10px] text-cyan-400/80 tracking-wider pointer-events-none">
          TOTAL IMPLANTES: {cyberware.length}
        </div>

        {/* Central Stylized Cyborg Silhouette SVG */}
        <svg
          viewBox="0 0 800 680"
          className="w-full h-full max-h-[580px] drop-shadow-[0_0_15px_rgba(0,240,255,0.15)] select-none"
        >
          <defs>
            {/* Glowing neon gradients */}
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

          {/* ================= CYBORG BODY SILHOUETTE ================= */}
          <g transform="translate(0, 0)">
            {/* Head & Neck */}
            <path
              d="M375,100 L425,100 L435,130 L420,165 L405,175 L395,175 L380,165 L365,130 Z"
              fill="url(#bodyGradient)"
              stroke="#00F0FF"
              strokeWidth="1.5"
              opacity="0.85"
            />
            {/* Cranium / Brain area glow */}
            <path
              d="M380,105 Q400,90 420,105 Q430,120 425,135 L375,135 Q370,120 380,105 Z"
              fill={isSelected('neuralware') ? '#FCEE0A33' : '#00F0FF15'}
              stroke={isSelected('neuralware') ? '#FCEE0A' : '#00F0FF'}
              strokeWidth={isSelected('neuralware') ? '2' : '1'}
              className="cursor-pointer transition-all duration-300"
              onClick={() => handleClick('neuralware')}
            />
            {/* Cyber eyes */}
            <circle cx="390" cy="128" r="4" fill="#00F0FF" className="animate-pulse" />
            <circle cx="410" cy="128" r="4" fill="#00F0FF" className="animate-pulse" />

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
            {/* Ribs & Internal Cyberware Core */}
            <path
              d="M375,215 L425,215 L430,265 L400,295 L370,265 Z"
              fill={isSelected('internal') ? '#FCEE0A22' : '#00F0FF10'}
              stroke={isSelected('internal') ? '#FCEE0A' : '#00F0FF'}
              strokeWidth={isSelected('internal') ? '2' : '1'}
              strokeDasharray={isSelected('internal') ? 'none' : '4 2'}
              className="cursor-pointer transition-all duration-300"
              onClick={() => handleClick('internal')}
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
              fill="#FFFFFF"
            />

            {/* Spine & Borgware Center Column */}
            <line x1="400" y1="215" x2="400" y2="350" stroke="#FCEE0A" strokeWidth="3" opacity="0.6" strokeDasharray="6 4" />

            {/* Shoulders */}
            <circle cx="340" cy="210" r="14" fill="#181e2b" stroke="#00F0FF" strokeWidth="1.5" />
            <circle cx="460" cy="210" r="14" fill="#181e2b" stroke="#00F0FF" strokeWidth="1.5" />

            {/* Left Arm (Viewer's Left = Character's Right Arm) */}
            <g
              className="cursor-pointer group"
              onClick={() => handleClick('cyberarm_right')}
            >
              <path
                d="M330,220 L310,290 L300,380 L315,385 L328,295 L345,225 Z"
                fill={isSelected('cyberarm_right') ? '#FCEE0A22' : 'url(#bodyGradient)'}
                stroke={isSelected('cyberarm_right') ? '#FCEE0A' : '#00F0FF'}
                strokeWidth={isSelected('cyberarm_right') ? '2' : '1.5'}
                className="transition-all duration-300 group-hover:stroke-yellow-400"
              />
              {/* Hand */}
              <polygon points="295,385 315,385 318,415 292,415" fill="#1e2438" stroke="#00F0FF" strokeWidth="1" />
              {/* Blade circuit line */}
              <line x1="310" y1="300" x2="305" y2="370" stroke="#FF003C" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
            </g>

            {/* Right Arm (Viewer's Right = Character's Left Arm) */}
            <g
              className="cursor-pointer group"
              onClick={() => handleClick('cyberarm_left')}
            >
              <path
                d="M470,220 L490,290 L500,380 L485,385 L472,295 L455,225 Z"
                fill={isSelected('cyberarm_left') ? '#FCEE0A22' : 'url(#bodyGradient)'}
                stroke={isSelected('cyberarm_left') ? '#FCEE0A' : '#00F0FF'}
                strokeWidth={isSelected('cyberarm_left') ? '2' : '1.5'}
                className="transition-all duration-300 group-hover:stroke-yellow-400"
              />
              {/* Hand */}
              <polygon points="485,385 505,385 508,415 482,415" fill="#1e2438" stroke="#00F0FF" strokeWidth="1" />
              {/* Blade circuit line */}
              <line x1="490" y1="300" x2="495" y2="370" stroke="#FF003C" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
            </g>

            {/* Pelvis */}
            <polygon points="370,350 430,350 420,390 380,390" fill="#141824" stroke="#00F0FF" strokeWidth="1.5" />

            {/* Left Leg (Viewer's Left = Character's Right Leg) */}
            <g
              className="cursor-pointer group"
              onClick={() => handleClick('cyberleg_right')}
            >
              <path
                d="M375,390 L360,490 L350,590 L380,590 L395,490 L400,390 Z"
                fill={isSelected('cyberleg_right') ? '#FCEE0A22' : 'url(#bodyGradient)'}
                stroke={isSelected('cyberleg_right') ? '#FCEE0A' : '#00F0FF'}
                strokeWidth={isSelected('cyberleg_right') ? '2' : '1.5'}
                className="transition-all duration-300 group-hover:stroke-yellow-400"
              />
              {/* Foot */}
              <polygon points="345,590 380,590 385,615 335,615" fill="#181e2b" stroke="#00F0FF" strokeWidth="1" />
              {/* Hydraulic piston indicator */}
              <line x1="375" y1="410" x2="368" y2="480" stroke="#00F0FF" strokeWidth="2" strokeDasharray="4 2" />
            </g>

            {/* Right Leg (Viewer's Right = Character's Left Leg) */}
            <g
              className="cursor-pointer group"
              onClick={() => handleClick('cyberleg_left')}
            >
              <path
                d="M425,390 L440,490 L450,590 L420,590 L405,490 L400,390 Z"
                fill={isSelected('cyberleg_left') ? '#FCEE0A22' : 'url(#bodyGradient)'}
                stroke={isSelected('cyberleg_left') ? '#FCEE0A' : '#00F0FF'}
                strokeWidth={isSelected('cyberleg_left') ? '2' : '1.5'}
                className="transition-all duration-300 group-hover:stroke-yellow-400"
              />
              {/* Foot */}
              <polygon points="420,590 455,590 465,615 415,615" fill="#181e2b" stroke="#00F0FF" strokeWidth="1" />
              {/* Hydraulic piston indicator */}
              <line x1="425" y1="410" x2="432" y2="480" stroke="#00F0FF" strokeWidth="2" strokeDasharray="4 2" />
            </g>
          </g>

          {/* ================= CONNECTOR LINES & TARGET NODES ================= */}

          {/* 1. NEURALWARE & NEUROPORT (Top Center / Left) */}
          <g>
            <polyline
              points="400,105 400,60 270,60"
              fill="none"
              stroke={isSelected('neuralware') ? '#FCEE0A' : '#00F0FF'}
              strokeWidth={isSelected('neuralware') ? '2' : '1'}
              strokeDasharray={isSelected('neuralware') ? 'none' : '4 3'}
            />
            <circle cx="400" cy="105" r="4" fill="#FCEE0A" />
            <circle cx="270" cy="60" r="4" fill="#00F0FF" />
          </g>

          {/* 2. CYBEROPTICS (Top Right) */}
          <g>
            <polyline
              points="410,128 470,128 530,95"
              fill="none"
              stroke={isSelected('cyberoptics_right') || isSelected('cyberoptics_left') ? '#FCEE0A' : '#00F0FF'}
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <circle cx="410" cy="128" r="3" fill="#00F0FF" />
            <circle cx="530" cy="95" r="4" fill="#00F0FF" />
          </g>

          {/* 3. CYBERAUDIO (Middle Left) */}
          <g>
            <polyline
              points="370,140 330,140 250,150"
              fill="none"
              stroke={isSelected('cyberaudio') ? '#FCEE0A' : '#00F0FF'}
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <circle cx="370" cy="140" r="3" fill="#00F0FF" />
            <circle cx="250" cy="150" r="4" fill="#00F0FF" />
          </g>

          {/* 4. INTERNAL CYBERWARE (Center Torso Right) */}
          <g>
            <polyline
              points="400,250 460,250 550,220"
              fill="none"
              stroke={isSelected('internal') ? '#FCEE0A' : '#00F0FF'}
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <circle cx="400" cy="250" r="4" fill="#FF003C" />
            <circle cx="550" cy="220" r="4" fill="#00F0FF" />
          </g>

          {/* 5. EXTERNAL & FASHIONWARE (Torso Left) */}
          <g>
            <polyline
              points="360,280 300,280 230,260"
              fill="none"
              stroke={isSelected('external') || isSelected('fashionware') ? '#FCEE0A' : '#00F0FF'}
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <circle cx="360" cy="280" r="3" fill="#00F0FF" />
            <circle cx="230" cy="260" r="4" fill="#00F0FF" />
          </g>

          {/* 6. CYBERARMS (Left & Right Arms) */}
          <g>
            {/* Right Arm */}
            <polyline
              points="305,330 260,330 210,360"
              fill="none"
              stroke={isSelected('cyberarm_right') ? '#FCEE0A' : '#00F0FF'}
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <circle cx="305" cy="330" r="3" fill="#FF003C" />
            <circle cx="210" cy="360" r="4" fill="#00F0FF" />

            {/* Left Arm */}
            <polyline
              points="495,330 540,330 590,340"
              fill="none"
              stroke={isSelected('cyberarm_left') ? '#FCEE0A' : '#00F0FF'}
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <circle cx="495" cy="330" r="3" fill="#FF003C" />
            <circle cx="590" cy="340" r="4" fill="#00F0FF" />
          </g>

          {/* 7. CYBERLEGS (Left & Right Legs) */}
          <g>
            {/* Right Leg */}
            <polyline
              points="360,510 300,510 220,500"
              fill="none"
              stroke={isSelected('cyberleg_right') ? '#FCEE0A' : '#00F0FF'}
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <circle cx="360" cy="510" r="3" fill="#00F0FF" />
            <circle cx="220" cy="500" r="4" fill="#00F0FF" />

            {/* Left Leg */}
            <polyline
              points="440,510 500,510 580,480"
              fill="none"
              stroke={isSelected('cyberleg_left') ? '#FCEE0A' : '#00F0FF'}
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <circle cx="440" cy="510" r="3" fill="#00F0FF" />
            <circle cx="580" cy="480" r="4" fill="#00F0FF" />
          </g>

          {/* 8. BORGWARE (Spine / Base) */}
          <g>
            <polyline
              points="400,350 400,430 540,430 600,410"
              fill="none"
              stroke={isSelected('borgware') ? '#FCEE0A' : '#00F0FF'}
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <circle cx="400" cy="350" r="4" fill="#FCEE0A" />
            <circle cx="600" cy="410" r="4" fill="#FCEE0A" />
          </g>
        </svg>

        {/* ================= FLOATING INTERACTIVE HUD BUTTONS (OVERLAY) ================= */}

        {/* 1. NEURALWARE & NEUROPORT */}
        <div className="absolute top-8 left-4 md:left-8 z-10">
          <button
            onClick={() => handleClick('neuralware')}
            className={`group text-left px-3 py-2 cyber-chamfer border transition-all duration-200 backdrop-blur-md flex items-center gap-2.5 ${
              isSelected('neuralware')
                ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300 shadow-neon-yellow'
                : 'bg-[#12141f]/90 border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:bg-[#1a1e2e]'
            }`}
          >
            <div className={`p-1.5 rounded ${isSelected('neuralware') ? 'bg-yellow-400 text-black' : 'bg-cyan-500/20 text-cyan-400'}`}>
              <Brain size={16} />
            </div>
            <div>
              <div className="text-[11px] font-bold tracking-wider font-orbitron uppercase">1. Neuralware & Neuroport</div>
              <div className="text-[10px] font-mono text-slate-400 flex items-center gap-2">
                <span>Slots: {getCount('neuralware')}/{BODY_REGIONS.neuralware.maxSlots}</span>
                <span className="text-yellow-400 font-bold">2077 Standard</span>
              </div>
            </div>
          </button>
        </div>

        {/* 2. CYBEROPTICS (OD & OE) */}
        <div className="absolute top-14 right-4 md:right-8 z-10 flex flex-col gap-1.5">
          <button
            onClick={() => handleClick('cyberoptics_right')}
            className={`group text-left px-3 py-1.5 cyber-chamfer border transition-all duration-200 backdrop-blur-md flex items-center gap-2 ${
              isSelected('cyberoptics_right')
                ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300 shadow-neon-yellow'
                : 'bg-[#12141f]/90 border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:bg-[#1a1e2e]'
            }`}
          >
            <Eye size={14} className={isSelected('cyberoptics_right') ? 'text-yellow-400' : 'text-cyan-400'} />
            <div>
              <div className="text-[10px] font-bold font-orbitron uppercase">2. Ótica Direita (OD)</div>
              <div className="text-[9px] font-mono text-slate-400">{getCount('cyberoptics_right')}/3 Slots</div>
            </div>
          </button>
          <button
            onClick={() => handleClick('cyberoptics_left')}
            className={`group text-left px-3 py-1.5 cyber-chamfer border transition-all duration-200 backdrop-blur-md flex items-center gap-2 ${
              isSelected('cyberoptics_left')
                ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300 shadow-neon-yellow'
                : 'bg-[#12141f]/90 border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:bg-[#1a1e2e]'
            }`}
          >
            <Eye size={14} className={isSelected('cyberoptics_left') ? 'text-yellow-400' : 'text-cyan-400'} />
            <div>
              <div className="text-[10px] font-bold font-orbitron uppercase">2. Ótica Esquerda (OE)</div>
              <div className="text-[9px] font-mono text-slate-400">{getCount('cyberoptics_left')}/3 Slots</div>
            </div>
          </button>
        </div>

        {/* 3. CYBERAUDIO */}
        <div className="absolute top-36 left-2 md:left-6 z-10">
          <button
            onClick={() => handleClick('cyberaudio')}
            className={`group text-left px-3 py-2 cyber-chamfer border transition-all duration-200 backdrop-blur-md flex items-center gap-2 ${
              isSelected('cyberaudio')
                ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300 shadow-neon-yellow'
                : 'bg-[#12141f]/90 border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:bg-[#1a1e2e]'
            }`}
          >
            <div className={`p-1.5 rounded ${isSelected('cyberaudio') ? 'bg-yellow-400 text-black' : 'bg-cyan-500/20 text-cyan-400'}`}>
              <Headphones size={15} />
            </div>
            <div>
              <div className="text-[11px] font-bold font-orbitron uppercase">3. Cyberaudio Suite</div>
              <div className="text-[10px] font-mono text-slate-400">Slots: {getCount('cyberaudio')}/3</div>
            </div>
          </button>
        </div>

        {/* 4. INTERNAL CYBERWARE */}
        <div className="absolute top-44 right-2 md:right-8 z-10">
          <button
            onClick={() => handleClick('internal')}
            className={`group text-left px-3 py-2 cyber-chamfer border transition-all duration-200 backdrop-blur-md flex items-center gap-2.5 ${
              isSelected('internal')
                ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300 shadow-neon-yellow'
                : 'bg-[#12141f]/90 border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:bg-[#1a1e2e]'
            }`}
          >
            <div className={`p-1.5 rounded ${isSelected('internal') ? 'bg-yellow-400 text-black' : 'bg-red-500/20 text-red-400'}`}>
              <HeartPulse size={16} />
            </div>
            <div>
              <div className="text-[11px] font-bold font-orbitron uppercase">4. Torso Interno</div>
              <div className="text-[10px] font-mono text-slate-400">Slots: {getCount('internal')}/7</div>
            </div>
          </button>
        </div>

        {/* 5. EXTERNAL & FASHIONWARE */}
        <div className="absolute top-56 left-2 md:left-6 z-10 flex flex-col gap-1.5">
          <button
            onClick={() => handleClick('external')}
            className={`group text-left px-3 py-1.5 cyber-chamfer border transition-all duration-200 backdrop-blur-md flex items-center gap-2 ${
              isSelected('external')
                ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300 shadow-neon-yellow'
                : 'bg-[#12141f]/90 border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:bg-[#1a1e2e]'
            }`}
          >
            <ShieldAlert size={14} className={isSelected('external') ? 'text-yellow-400' : 'text-cyan-400'} />
            <div>
              <div className="text-[10px] font-bold font-orbitron uppercase">5. Pele / Blindagem</div>
              <div className="text-[9px] font-mono text-slate-400">{getCount('external')}/7 Slots</div>
            </div>
          </button>
          <button
            onClick={() => handleClick('fashionware')}
            className={`group text-left px-3 py-1.5 cyber-chamfer border transition-all duration-200 backdrop-blur-md flex items-center gap-2 ${
              isSelected('fashionware')
                ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300 shadow-neon-yellow'
                : 'bg-[#12141f]/90 border-purple-500/40 text-purple-300 hover:border-purple-400 hover:bg-[#1a1e2e]'
            }`}
          >
            <Zap size={14} className={isSelected('fashionware') ? 'text-yellow-400' : 'text-purple-400'} />
            <div>
              <div className="text-[10px] font-bold font-orbitron uppercase">5. Fashionware (0 HL)</div>
              <div className="text-[9px] font-mono text-slate-400">{getCount('fashionware')}/7 Slots</div>
            </div>
          </button>
        </div>

        {/* 6. CYBERARMS (Right & Left) */}
        <div className="absolute bottom-32 left-2 md:left-6 z-10">
          <button
            onClick={() => handleClick('cyberarm_right')}
            className={`group text-left px-2.5 py-1.5 cyber-chamfer border transition-all duration-200 backdrop-blur-md flex items-center gap-2 ${
              isSelected('cyberarm_right')
                ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300 shadow-neon-yellow'
                : 'bg-[#12141f]/90 border-red-500/40 text-red-300 hover:border-red-400 hover:bg-[#1a1e2e]'
            }`}
          >
            <Cpu size={14} className="text-red-400" />
            <div>
              <div className="text-[10px] font-bold font-orbitron uppercase">6. Braço Dir. (4 Slots)</div>
              <div className="text-[9px] font-mono text-slate-400">{getCount('cyberarm_right')} instalados</div>
            </div>
          </button>
        </div>

        <div className="absolute bottom-36 right-2 md:right-8 z-10">
          <button
            onClick={() => handleClick('cyberarm_left')}
            className={`group text-left px-2.5 py-1.5 cyber-chamfer border transition-all duration-200 backdrop-blur-md flex items-center gap-2 ${
              isSelected('cyberarm_left')
                ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300 shadow-neon-yellow'
                : 'bg-[#12141f]/90 border-red-500/40 text-red-300 hover:border-red-400 hover:bg-[#1a1e2e]'
            }`}
          >
            <Cpu size={14} className="text-red-400" />
            <div>
              <div className="text-[10px] font-bold font-orbitron uppercase">6. Braço Esq. (4 Slots)</div>
              <div className="text-[9px] font-mono text-slate-400">{getCount('cyberarm_left')} instalados</div>
            </div>
          </button>
        </div>

        {/* 7. CYBERLEGS (Right & Left) */}
        <div className="absolute bottom-12 left-2 md:left-8 z-10">
          <button
            onClick={() => handleClick('cyberleg_right')}
            className={`group text-left px-2.5 py-1.5 cyber-chamfer border transition-all duration-200 backdrop-blur-md flex items-center gap-2 ${
              isSelected('cyberleg_right')
                ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300 shadow-neon-yellow'
                : 'bg-[#12141f]/90 border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:bg-[#1a1e2e]'
            }`}
          >
            <Zap size={14} className="text-cyan-400" />
            <div>
              <div className="text-[10px] font-bold font-orbitron uppercase">7. Perna Dir. (3 Slots)</div>
              <div className="text-[9px] font-mono text-slate-400">{getCount('cyberleg_right')} instalados</div>
            </div>
          </button>
        </div>

        <div className="absolute bottom-12 right-2 md:right-8 z-10">
          <button
            onClick={() => handleClick('cyberleg_left')}
            className={`group text-left px-2.5 py-1.5 cyber-chamfer border transition-all duration-200 backdrop-blur-md flex items-center gap-2 ${
              isSelected('cyberleg_left')
                ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300 shadow-neon-yellow'
                : 'bg-[#12141f]/90 border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:bg-[#1a1e2e]'
            }`}
          >
            <Zap size={14} className="text-cyan-400" />
            <div>
              <div className="text-[10px] font-bold font-orbitron uppercase">7. Perna Esq. (3 Slots)</div>
              <div className="text-[9px] font-mono text-slate-400">{getCount('cyberleg_left')} instalados</div>
            </div>
          </button>
        </div>

        {/* 8. BORGWARE (Center Bottom Right) */}
        <div className="absolute bottom-24 right-2 md:right-16 z-10">
          <button
            onClick={() => handleClick('borgware')}
            className={`group text-left px-3 py-1.5 cyber-chamfer border transition-all duration-200 backdrop-blur-md flex items-center gap-2 ${
              isSelected('borgware')
                ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300 shadow-neon-yellow'
                : 'bg-[#12141f]/90 border-yellow-500/40 text-yellow-300 hover:border-yellow-400 hover:bg-[#1a1e2e]'
            }`}
          >
            <Activity size={14} className="text-yellow-400" />
            <div>
              <div className="text-[10px] font-bold font-orbitron uppercase">8. Borgware (Estrutura)</div>
              <div className="text-[9px] font-mono text-slate-400">{getCount('borgware')}/4 Slots</div>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};
