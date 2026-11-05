import React from 'react';
import { PairData } from '../types/game';
import { Sparkles, Check, Lock, HelpCircle, MessageSquare } from 'lucide-react';

interface MemoryParchmentPanelProps {
  pairs: PairData[];
  matchedPairIds: number[];
  latestMatchedId: number | null;
  aiMessage: string;
  isAiLoading: boolean;
  onRequestHint: () => void;
  hasUnmatched: boolean;
}

export const MemoryParchmentPanel: React.FC<MemoryParchmentPanelProps> = ({
  pairs,
  matchedPairIds,
  latestMatchedId,
  aiMessage,
  isAiLoading,
  onRequestHint,
  hasUnmatched,
}) => {
  const progress = matchedPairIds.length;
  const isComplete = progress === 5;

  return (
    <div className="relative h-full w-full rounded-[28px] bg-gradient-to-b from-[#fefbf2]/95 via-[#fbf5e6]/95 to-[#f6ebd1]/95 border-2 border-[#d4b982]/60 shadow-2xl backdrop-blur-sm p-4 md:p-5 flex flex-col justify-between overflow-hidden text-stone-800">
      {/* Decorative antique corner flourishes */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#b58e4c]/50 rounded-tl pointer-events-none" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#b58e4c]/50 rounded-tr pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#b58e4c]/50 rounded-bl pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#b58e4c]/50 rounded-br pointer-events-none" />

      {/* Header: Title and Progress */}
      <div className="border-b border-[#e5d3ab] pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg select-none">📜</span>
            <div>
              <h2 className="text-sm md:text-base font-bold font-serif-literary text-amber-950 tracking-wide">
                Kí Ức Phố Chợ Mùa Đông
              </h2>
              <p className="text-[11px] text-stone-600 font-sans-ui">
                Bảng ghi chép 5 mảnh ghép văn học
              </p>
            </div>
          </div>

          {/* Progress Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f1e0be] border border-[#d8be89] text-amber-950 font-bold text-xs font-mono shadow-sm">
            <Sparkles className={`w-3.5 h-3.5 ${isComplete ? 'text-amber-600 animate-spin' : 'text-amber-700'}`} />
            <span>{progress}/5 ĐÃ TỎA SÁNG</span>
          </div>
        </div>
      </div>

      {/* 5 Story Milestones List */}
      <div className="my-2.5 flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
        {pairs.map((pair) => {
          const isUnlocked = matchedPairIds.includes(pair.id);
          const isJustUnlocked = latestMatchedId === pair.id;

          return (
            <div
              key={pair.id}
              className={`relative p-2.5 rounded-xl border transition-all duration-300 ${
                isUnlocked
                  ? isJustUnlocked
                    ? 'bg-amber-100/90 border-amber-500 shadow-md shadow-amber-500/15 scale-[1.01]'
                    : 'bg-white/80 border-[#dfcaa0] shadow-sm'
                  : 'bg-[#f4ebe0]/60 border-[#e3d7c5] opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {/* Number Badge or Seal */}
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold font-mono ${
                      isUnlocked
                        ? 'bg-amber-700 text-amber-50 shadow-sm'
                        : 'bg-stone-300 text-stone-600'
                    }`}
                  >
                    0{pair.id}
                  </div>
                  <h3
                    className={`text-xs md:text-sm font-bold font-serif-literary ${
                      isUnlocked ? 'text-amber-950' : 'text-stone-600'
                    }`}
                  >
                    {pair.name}
                  </h3>
                </div>

                {/* Status indicator */}
                {isUnlocked ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300/80 shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Mở khóa</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-stone-500 bg-stone-200/60 px-2 py-0.5 rounded-full shrink-0">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Chờ mở</span>
                  </span>
                )}
              </div>

              {/* Detail snippet when unlocked */}
              {isUnlocked && (
                <div className="mt-1.5 pt-1.5 border-t border-[#ebdcc1] text-[11px] text-stone-700 font-serif-literary leading-relaxed">
                  <p className="line-clamp-2 italic">{pair.detailCard}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Librarian / Storyteller Commentary Box at Bottom of Parchment */}
      <div className="mt-1 pt-2.5 border-t border-[#e5d3ab] bg-amber-50/70 -mx-1 -mb-1 p-3 rounded-2xl border border-amber-200/80 shadow-inner">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-base select-none">🦉</span>
            <span className="text-xs font-bold text-amber-950 font-serif-literary">
              Lời Bình Thủ Thư Mùa Đông
            </span>
          </div>

          {hasUnmatched && (
            <button
              onClick={onRequestHint}
              disabled={isAiLoading}
              className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-lg bg-[#faeed4] hover:bg-[#f5e2bf] text-amber-900 border border-[#d6be8c] transition-colors cursor-pointer disabled:opacity-50"
              title="Xin gợi ý từ Thủ thư"
            >
              <HelpCircle className="w-3 h-3" />
              <span>Gợi ý</span>
            </button>
          )}
        </div>

        {isAiLoading ? (
          <div className="flex items-center gap-2 text-stone-500 text-xs py-1 italic">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            <span>Thủ thư đang ngẫm nghĩ...</span>
          </div>
        ) : (
          <div className="flex items-start gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
            <p className="font-serif-literary text-xs md:text-[13px] text-stone-800 leading-relaxed italic">
              &ldquo;{aiMessage}&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
