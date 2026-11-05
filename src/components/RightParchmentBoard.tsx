import React, { useState, useEffect } from 'react';
import { PairData } from '../types/game';
import { Sparkles, HelpCircle, CheckCircle2, Lock, MessageSquare } from 'lucide-react';

interface RightParchmentBoardProps {
  pairs: PairData[];
  matchedPairIds: number[];
  latestMatchedId: number | null;
  aiMessage: string;
  isAiLoading: boolean;
  aiType: 'intro' | 'match' | 'mismatch' | 'victory';
  onRequestHint: () => void;
  onOpenConclusion: () => void;
}

export const RightParchmentBoard: React.FC<RightParchmentBoardProps> = ({
  pairs,
  matchedPairIds,
  latestMatchedId,
  aiMessage,
  isAiLoading,
  aiType,
  onRequestHint,
  onOpenConclusion,
}) => {
  const [displayedText, setDisplayedText] = useState('');

  // Typewriter effect
  useEffect(() => {
    setDisplayedText('');
    let idx = 0;
    const speed = 16;
    const interval = setInterval(() => {
      if (idx <= aiMessage.length) {
        setDisplayedText(aiMessage.slice(0, idx));
        idx++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [aiMessage]);

  const progress = matchedPairIds.length;
  const isComplete = progress === 5;

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 sm:p-4 rounded-3xl bg-[#fffdf7]/95 border-2 border-amber-900/20 shadow-2xl backdrop-blur-md text-amber-950">
      {/* SECTION 1: AI Storyteller / Thủ thư Mùa Đông */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between border-b border-amber-900/15 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-400 text-slate-950 flex items-center justify-center text-lg shadow-sm">
              🦉
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                  Thủ Thư Kí Ức
                </h3>
                <span className="text-[9px] font-bold bg-amber-200/80 text-amber-900 px-1.5 py-0.2 rounded border border-amber-300">
                  Gemini AI
                </span>
              </div>
              <p className="text-[10px] text-amber-800/70">Đồng hành & dẫn dắt câu chuyện</p>
            </div>
          </div>

          {!isComplete && (
            <button
              onClick={onRequestHint}
              disabled={isAiLoading}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300/80 transition-colors cursor-pointer disabled:opacity-50"
              title="Xin gợi ý từ Thủ thư"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
              <span>Gợi ý</span>
            </button>
          )}
        </div>

        {/* AI Dialogue Bubble */}
        <div
          className={`relative min-h-[96px] p-3 rounded-2xl border transition-all ${
            aiType === 'match'
              ? 'bg-amber-50 border-amber-300 shadow-sm'
              : aiType === 'mismatch'
              ? 'bg-rose-50/60 border-rose-200'
              : 'bg-[#faf6ee] border-amber-200/80'
          }`}
        >
          {isAiLoading ? (
            <div className="flex items-center justify-center gap-2 text-amber-800/70 py-4">
              <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
              <span className="text-xs font-medium italic">Thủ thư đang suy ngẫm...</span>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
              <p className="font-serif-literary text-xs md:text-sm text-slate-800 leading-relaxed">
                {displayedText}
                {displayedText.length < aiMessage.length && (
                  <span className="inline-block w-1 h-3.5 ml-0.5 bg-amber-600 animate-pulse align-middle" />
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: 5 Narrative Memory Puzzle Pieces */}
      <div className="space-y-2 pt-2 border-t border-amber-900/15">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
              5 Mảnh Ghép Kí Ức
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            {progress} / 5
          </span>
        </div>

        {/* List of 5 Pieces */}
        <div className="space-y-1.5">
          {pairs.map((pair) => {
            const isUnlocked = matchedPairIds.includes(pair.id);
            const isJustUnlocked = latestMatchedId === pair.id;

            return (
              <div
                key={pair.id}
                className={`flex items-center justify-between p-2 rounded-xl border transition-all duration-300 ${
                  isUnlocked
                    ? isJustUnlocked
                      ? 'bg-amber-100/90 border-amber-500 shadow-sm ring-1 ring-amber-400 scale-[1.01]'
                      : 'bg-amber-50/80 border-amber-300/80 text-amber-950'
                    : 'bg-[#faf6ee]/70 border-amber-900/10 text-amber-900/50'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold shrink-0 ${
                      isUnlocked
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'bg-amber-900/10 text-amber-900/60'
                    }`}
                  >
                    0{pair.id}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate leading-tight">
                      {pair.name}
                    </div>
                    <div className="text-[10px] text-amber-900/70 truncate">
                      {isUnlocked ? pair.sceneTheme : 'Chưa khôi phục'}
                    </div>
                  </div>
                </div>

                {isUnlocked ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-1.5" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-amber-900/40 shrink-0 ml-1.5" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Victory / Transition CTA when 5/5 complete */}
      {isComplete && (
        <div className="pt-2">
          <button
            onClick={onOpenConclusion}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-600/30 transition-all cursor-pointer animate-bounce"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>MỞ KHÓA DẪN NHẬP TIẾT 2</span>
          </button>
        </div>
      )}
    </div>
  );
};
