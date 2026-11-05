import React from 'react';
import { GameMode, TeamScore } from '../types/game';
import {
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  Settings,
  Users,
  Award,
  ChevronRight,
  PlusCircle,
} from 'lucide-react';

interface ScoreboardBarProps {
  mode: GameMode;
  onToggleMode: (mode: GameMode) => void;
  teams: TeamScore[];
  currentTeamIndex: number;
  onNextTeam: () => void;
  onAddBonusPoints: (teamId: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onRestart: () => void;
  onOpenTeacherSettings: () => void;
}

export const ScoreboardBar: React.FC<ScoreboardBarProps> = ({
  mode,
  onToggleMode,
  teams,
  currentTeamIndex,
  onNextTeam,
  onAddBonusPoints,
  isMuted,
  onToggleMute,
  isFullscreen,
  onToggleFullscreen,
  onRestart,
  onOpenTeacherSettings,
}) => {
  return (
    <div className="w-full bg-[#fbf6e8]/90 border border-[#d6be8c]/90 rounded-2xl shadow-lg backdrop-blur-md px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-stone-800">
      {/* Left: Mode Switcher & 4-Team Scores */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Mode Selector Segmented Tabs */}
        <div className="flex items-center p-1 bg-[#ede0c2]/80 rounded-xl border border-[#d8c399]">
          <button
            onClick={() => onToggleMode('EXPLORATION')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 font-serif-literary ${
              mode === 'EXPLORATION'
                ? 'bg-[#8c5a2b] text-white shadow-md'
                : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Khám phá chung</span>
          </button>
          <button
            onClick={() => onToggleMode('COMPETITION')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 font-serif-literary ${
              mode === 'COMPETITION'
                ? 'bg-[#8c5a2b] text-white shadow-md'
                : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Thi đấu 4 tổ</span>
          </button>
        </div>

        {/* When in Competition Mode: 4 Team score badges */}
        {mode === 'COMPETITION' && (
          <div className="flex items-center gap-2 flex-wrap">
            {teams.map((team, idx) => {
              const isCurrentTurn = idx === currentTeamIndex;
              return (
                <div
                  key={team.id}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border transition-all ${
                    isCurrentTurn
                      ? 'bg-amber-100 border-amber-600 ring-2 ring-amber-500/50 text-amber-950 font-bold shadow-sm'
                      : 'bg-white/70 border-[#dac39b] text-stone-700'
                  }`}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full ring-1 ring-black/10"
                    style={{ backgroundColor: team.color }}
                  />
                  <span className="text-xs font-serif-literary">{team.name}</span>
                  <span className="font-mono text-xs font-bold text-amber-800">
                    {team.score}đ
                  </span>

                  {/* Teacher Bonus Button (+5 points) */}
                  <button
                    onClick={() => onAddBonusPoints(team.id)}
                    title="GV thưởng +5 điểm phát biểu xuất sắc"
                    className="text-stone-500 hover:text-emerald-700 p-0.5 rounded cursor-pointer transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}

            {/* Next Team button */}
            <button
              onClick={onNextTeam}
              className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-lg bg-stone-200/80 hover:bg-stone-300 text-stone-800 border border-stone-300 cursor-pointer transition-colors"
              title="Chuyển lượt sang tổ tiếp theo"
            >
              <span>Lượt tiếp</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Right: Quick Utilities */}
      <div className="flex items-center gap-2">
        {/* Teacher Edit Button */}
        <button
          onClick={onOpenTeacherSettings}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-white/80 hover:bg-white text-stone-800 border border-[#d6be8c] shadow-sm transition-all cursor-pointer font-serif-literary"
          title="Soạn thảo câu chữ 5 cặp thẻ"
        >
          <Settings className="w-3.5 h-3.5 text-amber-700" />
          <span className="hidden sm:inline">Soạn thẻ GV</span>
        </button>

        {/* Audio Mute Toggle (Nhạc nền 30% & Âm thanh) */}
        <button
          onClick={onToggleMute}
          className="p-1.5 text-xs rounded-xl bg-white/80 hover:bg-white text-stone-800 border border-[#d6be8c] shadow-sm transition-colors cursor-pointer"
          title={isMuted ? 'Bật nhạc nền (30%) & âm thanh' : 'Tắt nhạc nền & âm thanh'}
          aria-label={isMuted ? 'Bật nhạc nền & âm thanh' : 'Tắt nhạc nền & âm thanh'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-rose-600" />
          ) : (
            <Volume2 className="w-4 h-4 text-emerald-700" />
          )}
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          className="p-1.5 text-xs rounded-xl bg-white/80 hover:bg-white text-stone-800 border border-[#d6be8c] shadow-sm transition-colors cursor-pointer"
          title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình trình chiếu'}
          aria-label={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4 text-amber-700" />
          ) : (
            <Maximize2 className="w-4 h-4 text-stone-700" />
          )}
        </button>

        {/* Restart / Shuffle */}
        <button
          onClick={onRestart}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-[#8c5a2b] hover:bg-[#73471f] text-white shadow-sm transition-colors cursor-pointer font-serif-literary"
          title="Xáo trộn lại các thẻ"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Chơi lại</span>
        </button>
      </div>
    </div>
  );
};
