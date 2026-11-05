import React, { useEffect, useState } from 'react';
import { CardItem } from '../types/game';
import { BookOpen, Quote, CheckCircle2, XCircle, Clock, FastForward, Sparkles, X } from 'lucide-react';

interface MagnifiedCardSpotlightProps {
  cards: CardItem[];
  allCards: CardItem[];
  matchedPairIds: number[];
  isMatch: boolean | null; // null if 1 card, true if match, false if mismatch
  totalDurationMs?: number;
  onSelectSecondCard: (card: CardItem) => void;
  onTimerComplete: () => void;
  onCloseEarly?: () => void;
}

export const MagnifiedCardSpotlight: React.FC<MagnifiedCardSpotlightProps> = ({
  cards,
  allCards,
  matchedPairIds,
  isMatch,
  totalDurationMs = 3800,
  onSelectSecondCard,
  onTimerComplete,
  onCloseEarly,
}) => {
  const [timeLeft, setTimeLeft] = useState(totalDurationMs);
  const [isClosing, setIsClosing] = useState(false);

  // If 2 cards are selected, run the countdown timer to auto-shrink
  useEffect(() => {
    if (cards.length !== 2) {
      setTimeLeft(totalDurationMs);
      return;
    }

    setTimeLeft(totalDurationMs);
    const intervalTime = 50;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= intervalTime) {
          clearInterval(timer);
          triggerClose();
          return 0;
        }
        return prev - intervalTime;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [cards, totalDurationMs]);

  const triggerClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onTimerComplete();
    }, 280);
  };

  if (cards.length === 0) return null;

  const progressPercent = cards.length === 2 ? (timeLeft / totalDurationMs) * 100 : 100;

  // Filter available cards for picking the second card
  const availableSecondCards = allCards.filter(
    (c) => c.id !== cards[0]?.id && !matchedPairIds.includes(c.pairId)
  );

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-2 sm:p-4 bg-slate-950/65 backdrop-blur-[3px] rounded-3xl transition-opacity duration-300">
      {/* TOP FLOATING NOTIFICATION & CONTROL BAR */}
      <div
        className={`mb-2 sm:mb-3 px-4 py-2 rounded-2xl border shadow-xl flex items-center justify-between gap-3 sm:gap-4 transition-all duration-300 w-full max-w-[680px] ${
          isClosing ? 'animate-card-shrink-out' : 'animate-card-zoom-in'
        } ${
          isMatch === true
            ? 'bg-[#fefce8] border-amber-400 text-amber-950 ring-2 ring-amber-400/50'
            : isMatch === false
            ? 'bg-[#fff1f2] border-rose-400 text-rose-950 ring-2 ring-rose-400/40'
            : 'bg-[#fffdf7] border-amber-800/30 text-amber-950'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {isMatch === true ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-600 animate-bounce shrink-0" />
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-emerald-800 truncate">
                Kí ức trùng khớp! (+10 Điểm)
              </span>
            </>
          ) : isMatch === false ? (
            <>
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-rose-800 truncate">
                Chưa trùng khớp · Đang ghi nhớ để thử lại
              </span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-amber-900 truncate">
                Đã mở Thẻ Dọc #{cards[0].id} · Chọn thẻ thứ hai để ghép cặp
              </span>
            </>
          )}
        </div>

        {/* Action Controls & Countdown */}
        <div className="flex items-center gap-2 shrink-0">
          {cards.length === 2 && (
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/10 text-xs font-mono font-bold text-amber-950">
              <Clock className="w-3.5 h-3.5" />
              <span>{(timeLeft / 1000).toFixed(1)}s</span>
            </div>
          )}

          {cards.length === 2 ? (
            <button
              onClick={triggerClose}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-900/15 hover:bg-amber-900/25 text-amber-950 transition-colors cursor-pointer"
              title="Thu nhỏ thẻ về vị trí cũ ngay"
            >
              <span>Thu nhỏ ngay</span>
              <FastForward className="w-3 h-3" />
            </button>
          ) : (
            <button
              onClick={onCloseEarly}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-900/10 hover:bg-amber-900/20 text-amber-950 transition-colors cursor-pointer"
              title="Đóng thẻ này và chọn lại"
            >
              <X className="w-3.5 h-3.5" />
              <span>Đóng lại</span>
            </button>
          )}
        </div>
      </div>

      {/* Countdown Timer Line (When 2 cards are being compared) */}
      {cards.length === 2 && (
        <div className="w-full max-w-[540px] h-1.5 bg-black/20 rounded-full overflow-hidden mb-2.5">
          <div
            className={`h-full transition-all duration-75 rounded-full ${
              isMatch === true ? 'bg-emerald-500' : isMatch === false ? 'bg-rose-500' : 'bg-amber-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* 
        VERTICAL CARDS DISPLAY:
        Shows 1 or 2 vertical cards (Thẻ Dọc), occupying ~1/2 of the board area.
      */}
      <div
        className={`flex items-center justify-center gap-3 sm:gap-5 w-full max-w-full overflow-x-auto py-1 ${
          isClosing ? 'animate-card-shrink-out' : 'animate-card-zoom-in'
        }`}
      >
        {cards.map((card, idx) => (
          <div
            key={card.id}
            className={`relative flex flex-col justify-between w-[250px] sm:w-[275px] md:w-[305px] h-[370px] sm:h-[415px] md:h-[455px] rounded-3xl border-3 shadow-2xl p-4 sm:p-5 transition-all duration-300 select-none ${
              isMatch === true
                ? 'bg-gradient-to-b from-[#fffbeb] via-[#fefce8] to-[#fef08a] border-amber-400 shadow-amber-500/30 ring-2 ring-amber-400/60'
                : isMatch === false
                ? 'bg-gradient-to-b from-[#fff1f2] via-[#ffe4e6] to-[#fecdd3] border-rose-400 shadow-rose-500/20'
                : 'bg-gradient-to-b from-[#fffdfa] via-[#fdfbf7] to-[#f5eee4] border-amber-600/70 shadow-2xl ring-1 ring-amber-500/30'
            }`}
          >
            {/* Traditional Inset Border Line */}
            <div className="absolute inset-2 border border-amber-900/15 rounded-2xl pointer-events-none" />

            {/* VERTICAL CARD TOP HEADER */}
            <div className="relative z-10 flex items-center justify-between border-b border-amber-900/15 pb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-xl font-mono text-sm font-extrabold shadow-sm ${
                    card.type === 'TITLE'
                      ? 'bg-amber-600 text-white'
                      : 'bg-sky-700 text-white'
                  }`}
                >
                  {card.id < 10 ? `0${card.id}` : card.id}
                </div>
                <div>
                  <span
                    className={`text-[10px] sm:text-xs font-extrabold uppercase tracking-wider block ${
                      card.type === 'TITLE' ? 'text-amber-800' : 'text-sky-800'
                    }`}
                  >
                    {card.type === 'TITLE' ? 'Sự việc / Nhân vật' : 'Chi tiết văn bản'}
                  </span>
                  <span className="text-[10px] text-amber-900/60 font-semibold">
                    Thẻ dọc #{idx + 1}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {card.type === 'TITLE' ? (
                  <BookOpen className="w-4 h-4 text-amber-700" />
                ) : (
                  <Quote className="w-4 h-4 text-sky-700" />
                )}
                <span className="text-xs font-mono font-bold text-amber-900">
                  Cặp #{card.pairId}
                </span>
              </div>
            </div>

            {/* VERTICAL CARD CENTER BODY (LITERARY TEXT) */}
            <div className="relative z-10 flex-1 flex flex-col justify-center my-auto py-2 px-1 overflow-y-auto scrollbar-thin">
              <div className="text-amber-800/20 text-2xl font-serif-literary leading-none text-left mb-1 select-none">
                “
              </div>

              <p
                className={`font-serif-literary leading-relaxed text-slate-900 font-semibold px-1 ${
                  card.type === 'TITLE'
                    ? 'text-base sm:text-lg md:text-xl text-center text-amber-950 font-bold'
                    : 'text-xs sm:text-sm md:text-base text-left text-slate-800'
                }`}
              >
                {card.content}
              </p>

              <div className="text-amber-800/20 text-2xl font-serif-literary leading-none text-right mt-1 select-none">
                ”
              </div>
            </div>

            {/* VERTICAL CARD FOOTER */}
            <div className="relative z-10 pt-2 border-t border-amber-900/15 flex items-center justify-between text-xs">
              <div className="truncate max-w-[170px]">
                <span className="text-[9px] uppercase text-amber-900/60 font-bold block">
                  Chủ đề kí ức
                </span>
                <span className="text-xs font-extrabold text-amber-950 truncate block">
                  {card.pairName}
                </span>
              </div>

              {isMatch === true ? (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Khớp</span>
                </div>
              ) : isMatch === false ? (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold shadow-sm">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Sai</span>
                </div>
              ) : (
                <div className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold">
                  Đang mở
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 
        INTERACTIVE 2ND CARD SELECTOR:
        When only 1 card is opened, explicitly render the available cards list
        right below the magnified card so the user can immediately select Card 2!
      */}
      {cards.length === 1 && (
        <div className="mt-3 w-full max-w-[620px] p-2.5 sm:p-3 rounded-2xl bg-[#fffdf7]/95 border-2 border-amber-600/50 shadow-2xl backdrop-blur-md flex flex-col items-center gap-2 animate-card-zoom-in">
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-amber-950">
            <span>👉 Mời chọn tiếp thẻ thứ hai để đối chiếu:</span>
          </div>

          {/* Quick-Pick Card Buttons (1 to 10) */}
          <div className="flex items-center justify-center gap-2 flex-wrap w-full">
            {availableSecondCards.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelectSecondCard(c)}
                className="group flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-600 hover:text-white border-2 border-amber-500/70 text-amber-950 font-bold text-xs sm:text-sm shadow-sm transition-all transform hover:scale-105 cursor-pointer active:scale-95"
                title={`Chọn thẻ số ${c.id}`}
              >
                <span className="font-mono font-extrabold">#{c.id < 10 ? `0${c.id}` : c.id}</span>
                <span className="text-[10px] opacity-70 group-hover:opacity-100 hidden sm:inline">
                  Lật thẻ
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Guide text when comparing 2 cards */}
      {cards.length === 2 && (
        <div className="mt-2 text-center text-xs font-medium text-amber-100/90 drop-shadow">
          {isMatch === true
            ? 'Chính xác! Thẻ dọc sẽ tự động thu nhỏ về vị trí ban đầu và mở khóa mảnh kí ức.'
            : 'Hết thời gian đếm ngược, hai thẻ dọc sẽ tự động thu nhỏ về vị trí ban đầu.'}
        </div>
      )}
    </div>
  );
};
