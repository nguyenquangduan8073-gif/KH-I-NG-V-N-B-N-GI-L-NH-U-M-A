import React from 'react';
import { PairData } from '../types/game';
import { Sparkles, CheckCircle2, Lock } from 'lucide-react';

interface WinterArtCanvasProps {
  pairs: PairData[];
  matchedPairIds: number[];
  latestMatchedId: number | null;
}

export const WinterArtCanvas: React.FC<WinterArtCanvasProps> = ({
  pairs,
  matchedPairIds,
  latestMatchedId,
}) => {
  const progress = matchedPairIds.length;
  const isComplete = progress === 5;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/90 shadow-2xl backdrop-blur-md flex flex-col h-full">
      {/* Header bar of canvas */}
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 bg-slate-950/40">
        <div className="flex items-center gap-2">
          <Sparkles className={`w-4 h-4 ${isComplete ? 'text-amber-400 animate-spin' : 'text-sky-400'}`} />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Bức tranh kí ức · Phố chợ đầu đông
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">
            Tiến độ phục hồi:
          </span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isComplete ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'}`}>
            {progress} / 5 Mảnh ghép
          </span>
        </div>
      </div>

      {/* Visual Canvas Scene */}
      <div className="relative flex-1 min-h-[220px] overflow-hidden bg-gradient-to-b from-[#0b1329] via-[#111f3d] to-[#1e293b] p-3 flex flex-col justify-between transition-colors duration-1000">
        {/* Dynamic Warmth Light Overlay that intensifies as more pieces are unlocked */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
          style={{
            background: 'radial-gradient(ellipse at 50% 60%, rgba(245, 158, 11, 0.28) 0%, rgba(217, 119, 6, 0.12) 50%, transparent 80%)',
            opacity: progress / 5,
          }}
        />

        {/* Cold Mist / Breeze Overlay (Fades out as progress increases) */}
        <div
          className="absolute inset-0 pointer-events-none animate-winter-breeze"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(148, 163, 184, 0.08) 50%, transparent 100%)',
            opacity: Math.max(0.1, 1 - progress * 0.2),
          }}
        />

        {/* 2.5D Stylized Storybook Vector Landscape */}
        <div className="relative w-full h-36 flex items-end justify-center select-none">
          <svg
            viewBox="0 0 600 200"
            className="w-full h-full drop-shadow-lg"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isComplete ? '#451a03' : '#0f172a'} />
                <stop offset="100%" stopColor={isComplete ? '#78350f' : '#1e293b'} />
              </linearGradient>

              <linearGradient id="warmRoof" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>

              <linearGradient id="coldRoof" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
            </defs>

            {/* Background Mountains & Distant Haze */}
            <path
              d="M0 160 Q 150 110, 300 150 T 600 130 L 600 200 L 0 200 Z"
              fill={matchedPairIds.includes(1) ? '#292524' : '#1e293b'}
              opacity="0.6"
            />

            {/* Winter Street Houses Silhouette */}
            {/* House 1: Left */}
            <g opacity={matchedPairIds.includes(1) ? '1' : '0.4'} className="transition-opacity duration-700">
              <polygon points="40,110 90,60 140,110" fill={matchedPairIds.includes(1) ? 'url(#warmRoof)' : 'url(#coldRoof)'} />
              <rect x="55" y="110" width="70" height="70" fill={matchedPairIds.includes(1) ? '#fef3c7' : '#334155'} />
              <rect x="80" y="135" width="20" height="45" fill={matchedPairIds.includes(1) ? '#78350f' : '#0f172a'} />
              <rect x="62" y="120" width="12" height="15" fill={matchedPairIds.includes(1) ? '#fde047' : '#1e293b'} />
            </g>

            {/* House 2: Center Left - Bé Hiên's booth corner */}
            <g opacity={matchedPairIds.includes(2) ? '1' : '0.4'} className="transition-opacity duration-700">
              <polygon points="130,120 190,75 250,120" fill={matchedPairIds.includes(2) ? 'url(#warmRoof)' : 'url(#coldRoof)'} />
              <rect x="145" y="120" width="90" height="60" fill={matchedPairIds.includes(2) ? '#fde68a' : '#334155'} />
              {/* Wooden pole and shanty stall */}
              <line x1="210" y1="120" x2="210" y2="180" stroke={matchedPairIds.includes(2) ? '#b45309' : '#475569'} strokeWidth="5" />
              {/* Figure of little Hiên */}
              <circle cx="218" cy="148" r="6" fill={matchedPairIds.includes(2) ? '#ea580c' : '#64748b'} />
              <path d="M214 154 L222 154 L220 175 L216 175 Z" fill={matchedPairIds.includes(2) ? '#c2410c' : '#475569'} />
            </g>

            {/* Center: Sơn & Lan giving the coat */}
            <g opacity={matchedPairIds.includes(3) ? '1' : '0.4'} className="transition-opacity duration-700">
              <polygon points="240,105 310,50 380,105" fill={matchedPairIds.includes(3) ? 'url(#warmRoof)' : 'url(#coldRoof)'} />
              <rect x="255" y="105" width="110" height="75" fill={matchedPairIds.includes(3) ? '#fef9c3' : '#1e293b'} />
              {/* Warm windows */}
              <rect x="270" y="120" width="18" height="20" fill={matchedPairIds.includes(3) ? '#facc15' : '#334155'} />
              <rect x="330" y="120" width="18" height="20" fill={matchedPairIds.includes(3) ? '#facc15' : '#334155'} />
              {/* Golden Hearth light */}
              {matchedPairIds.includes(3) && (
                <circle cx="310" cy="145" r="28" fill="#f59e0b" opacity="0.3" filter="blur(8px)" />
              )}
              {/* Little coats figures */}
              <circle cx="300" cy="148" r="6" fill={matchedPairIds.includes(3) ? '#2563eb' : '#64748b'} />
              <circle cx="315" cy="148" r="6" fill={matchedPairIds.includes(3) ? '#db2777' : '#64748b'} />
            </g>

            {/* House 4: Lane way where they run to reclaim coat */}
            <g opacity={matchedPairIds.includes(4) ? '1' : '0.4'} className="transition-opacity duration-700">
              <polygon points="370,115 430,70 490,115" fill={matchedPairIds.includes(4) ? 'url(#warmRoof)' : 'url(#coldRoof)'} />
              <rect x="385" y="115" width="90" height="65" fill={matchedPairIds.includes(4) ? '#fde68a' : '#334155'} />
              <path d="M420 180 Q 435 150, 445 180" fill={matchedPairIds.includes(4) ? '#b45309' : '#1e293b'} />
            </g>

            {/* House 5: Mother's cozy hearth */}
            <g opacity={matchedPairIds.includes(5) ? '1' : '0.4'} className="transition-opacity duration-700">
              <polygon points="480,110 540,65 600,110" fill={matchedPairIds.includes(5) ? 'url(#warmRoof)' : 'url(#coldRoof)'} />
              <rect x="495" y="110" width="90" height="70" fill={matchedPairIds.includes(5) ? '#fef3c7' : '#1e293b'} />
              <circle cx="540" cy="135" r="8" fill={matchedPairIds.includes(5) ? '#eab308' : '#334155'} />
            </g>

            {/* Cobblestone Market Floor */}
            <rect x="0" y="178" width="600" height="22" fill={isComplete ? '#451a03' : '#1e293b'} />
            <line x1="0" y1="178" x2="600" y2="178" stroke={isComplete ? '#f59e0b' : '#475569'} strokeWidth="2" />
          </svg>
        </div>

        {/* 5 Narrative Milestones Mini-Grid */}
        <div className="grid grid-cols-5 gap-1.5 pt-2 border-t border-slate-800/80">
          {pairs.map((pair) => {
            const isUnlocked = matchedPairIds.includes(pair.id);
            const isJustUnlocked = latestMatchedId === pair.id;

            return (
              <div
                key={pair.id}
                className={`flex flex-col p-2 rounded-lg text-left transition-all duration-500 border ${
                  isUnlocked
                    ? isJustUnlocked
                      ? 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-lg shadow-amber-500/20 scale-102'
                      : 'bg-slate-800/90 border-amber-500/40 text-slate-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold font-mono">0{pair.id}</span>
                  {isUnlocked ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  ) : (
                    <Lock className="w-3 h-3 text-slate-600 shrink-0" />
                  )}
                </div>
                <div className="text-[11px] font-semibold leading-tight line-clamp-1">
                  {pair.name}
                </div>
                <div className="text-[9px] text-slate-400 mt-0.5 line-clamp-1">
                  {isUnlocked ? pair.sceneTheme : 'Chưa mở khóa'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
