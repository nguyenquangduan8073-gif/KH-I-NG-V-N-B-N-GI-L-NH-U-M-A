import React, { useState, useEffect } from 'react';
import { Sparkles, HelpCircle, MessageSquare } from 'lucide-react';

interface AiStorytellerProps {
  message: string;
  isLoading: boolean;
  type: 'intro' | 'match' | 'mismatch' | 'victory';
  onRequestHint: () => void;
  hasUnmatched: boolean;
}

export const AiStoryteller: React.FC<AiStorytellerProps> = ({
  message,
  isLoading,
  type,
  onRequestHint,
  hasUnmatched,
}) => {
  const [displayedText, setDisplayedText] = useState('');

  // Smooth typewriter reveal effect for commentary text
  useEffect(() => {
    setDisplayedText('');
    let idx = 0;
    const speed = 18; // ms per char

    const interval = setInterval(() => {
      if (idx <= message.length) {
        setDisplayedText(message.slice(0, idx));
        idx++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [message]);

  const getBorderColor = () => {
    switch (type) {
      case 'match':
        return 'border-amber-400/80 shadow-amber-500/20';
      case 'mismatch':
        return 'border-rose-400/50 shadow-rose-500/10';
      case 'victory':
        return 'border-amber-300 shadow-amber-500/30';
      default:
        return 'border-sky-500/40 shadow-sky-500/10';
    }
  };

  return (
    <div
      className={`rounded-2xl border bg-slate-900/90 shadow-xl backdrop-blur-md p-4 transition-all duration-300 flex flex-col justify-between ${getBorderColor()}`}
    >
      {/* Header with Persona Avatar and Identity */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-2.5">
        <div className="flex items-center gap-2.5">
          {/* Owl / Winter Librarian Avatar */}
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-300 text-slate-950 shadow-md">
            <span className="text-xl" role="img" aria-label="Thủ thư Mùa Đông">
              🦉
            </span>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-slate-100">Thủ Thư Kí Ức</h3>
              <span className="text-[10px] font-medium bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30">
                Gemini AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Đồng hành & Dẫn dắt truyện</p>
          </div>
        </div>

        {/* Hint Request Button */}
        {hasUnmatched && (
          <button
            onClick={onRequestHint}
            disabled={isLoading}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 text-amber-300 hover:bg-slate-700 hover:text-amber-200 border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            title="Nhận gợi ý từ Thủ thư"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Xin gợi ý</span>
          </button>
        )}
      </div>

      {/* Narrative Message Body with Speech Bubble Style */}
      <div className="relative min-h-[90px] bg-slate-950/50 rounded-xl p-3 border border-slate-800/80 flex flex-col justify-center">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 text-slate-400 py-3">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span className="text-xs font-medium italic">Thủ thư đang lật lại trang kí ức...</span>
          </div>
        ) : (
          <div className="relative flex items-start gap-2.5">
            <MessageSquare className="w-4 h-4 text-amber-400/80 shrink-0 mt-0.5" />
            <p className="font-serif-literary text-sm text-slate-200 leading-relaxed">
              {displayedText}
              {displayedText.length < message.length && (
                <span className="inline-block w-1.5 h-4 ml-0.5 bg-amber-400 animate-pulse align-middle" />
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
