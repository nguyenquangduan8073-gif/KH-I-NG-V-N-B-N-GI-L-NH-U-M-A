import React from 'react';
import { CardItem } from '../types/game';
import { Check, BookOpen, Quote } from 'lucide-react';

interface CardTileProps {
  card: CardItem;
  isFlipped: boolean;
  isMatched: boolean;
  isSelected: boolean;
  onSelect: (card: CardItem) => void;
  disabled: boolean;
}

export const CardTile: React.FC<CardTileProps> = ({
  card,
  isFlipped,
  isMatched,
  isSelected,
  onSelect,
  disabled,
}) => {
  const [justFlipped, setJustFlipped] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const textRef = React.useRef<HTMLParagraphElement>(null);
  const [scrollDistance, setScrollDistance] = React.useState<number>(0);

  const flipped = isFlipped || isMatched;

  // Measure content overflow for upward scrolling animation
  React.useEffect(() => {
    if (flipped && containerRef.current && textRef.current) {
      // Small timeout to allow the 3D flip animation to render dimensions accurately
      const timer = setTimeout(() => {
        if (!containerRef.current || !textRef.current) return;
        const containerH = containerRef.current.clientHeight;
        const textH = textRef.current.scrollHeight;
        const diff = textH - containerH;

        if (diff > 4) {
          setScrollDistance(diff + 16);
        } else if (card.content.length > 75) {
          // Subtle upward roll for rich text
          setScrollDistance(26);
        } else {
          setScrollDistance(0);
        }
      }, 350);

      return () => clearTimeout(timer);
    } else {
      setScrollDistance(0);
    }
  }, [flipped, card.content]);

  React.useEffect(() => {
    if (isFlipped) {
      setJustFlipped(true);
      const timer = setTimeout(() => {
        setJustFlipped(false);
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [isFlipped]);

  const handleClick = () => {
    if (disabled || isFlipped || isMatched) return;
    onSelect(card);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={disabled || isMatched ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={isMatched ? `Thẻ số ${card.id} đã hoàn thành và biến mất` : `Thẻ số ${card.id}: ${flipped ? card.content : 'Chưa lật'}`}
      className={`group relative h-48 sm:h-52 md:h-56 lg:h-60 xl:h-[268px] w-full select-none outline-none rounded-2xl ${
        isMatched ? 'cursor-default pointer-events-none' : 'cursor-pointer perspective-1000 focus-visible:ring-2 focus-visible:ring-amber-500'
      }`}
    >
      {/* REALISTIC CONTACT SHADOW ON ANCIENT STONE PLAZA */}
      <div
        className={`absolute -bottom-3 left-3 right-3 h-5 rounded-full pointer-events-none transition-all duration-700 ${
          isMatched
            ? 'opacity-0 scale-50'
            : isSelected
            ? 'bg-stone-950/55 blur-[10px] translate-y-2 scale-90'
            : 'bg-stone-950/50 blur-[6px] group-hover:blur-[9px] group-hover:translate-y-1.5 group-hover:scale-95 group-hover:bg-stone-950/40'
        } ${justFlipped ? 'animate-shadow-tremor' : ''}`}
      />

      {/* 3D Card Container with Vanish Animation when matched */}
      <div
        className={`w-full h-full rounded-2xl transition-all duration-700 ${
          isMatched ? 'animate-card-vanish pointer-events-none' : ''
        }`}
      >
        <div
          className={`w-full h-full transition-transform duration-500 transform-style-3d rounded-2xl ${
            flipped ? 'rotate-y-180' : 'group-hover:scale-[1.03] group-hover:-translate-y-1.5'
          }`}
        >
        {/* CARD FRONT (Unflipped - Giấy điệp dày dặn đặt trên nền đá cổ) */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rounded-2xl border-t border-l border-r border-b-[4px] flex flex-col items-center justify-between p-4 md:p-5 transition-all duration-300 ${
            isSelected
              ? 'border-t-[#ffd980] border-l-[#f59e0b] border-r-[#f59e0b] border-b-[#b45309] bg-gradient-to-br from-[#fffdf7] via-[#fef6e2] to-[#faedd0] stone-card-depth-selected'
              : isMatched
              ? 'border-t-[#fde68a] border-l-[#d97706] border-r-[#d97706] border-b-[#92400e] bg-gradient-to-br from-[#fffdf7] via-[#faf2df] to-[#f4e4c3] stone-card-depth-matched'
              : 'border-t-[#fff5db] border-l-[#ceb079] border-r-[#ceb079] border-b-[#94743e] bg-gradient-to-br from-[#fffefc] via-[#fcf5e5] to-[#f4e5c7] stone-card-depth group-hover:stone-card-depth-hover hover:border-b-[#7d5f2f]'
          }`}
        >
          {/* Top Vintage Border Line with Antique Pin Points */}
          <div className="w-full flex justify-between items-center text-[#8c672b]">
            <span className="text-xs md:text-sm font-mono font-extrabold tracking-widest uppercase drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
              Kí ức #{card.id < 10 ? `0${card.id}` : card.id}
            </span>
            <div className="w-2 h-2 rotate-45 bg-[#b58e4c] shadow-[0_1px_1px_rgba(0,0,0,0.15)]" />
          </div>

          {/* Central Prominent Card Number with 3D Engraved Look - SCALED UP */}
          <div className="flex flex-col items-center justify-center my-auto">
            <div className="relative flex items-center justify-center w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-2xl bg-gradient-to-b from-[#fdf6e6] to-[#ecdcbe] border-t border-l border-[#fff6e0] border-r border-[#d4bb87] border-b-[3px] border-b-[#ab8d4e] shadow-[inset_0_2px_5px_rgba(0,0,0,0.08),0_3px_6px_rgba(70,40,10,0.15)] group-hover:border-amber-700 transition-colors">
              {/* Subtle vintage inner frame */}
              <div className="absolute inset-1.5 border border-dashed border-[#b8985c]/50 rounded-xl pointer-events-none" />
              <span className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-extrabold font-serif-literary text-[#523616] group-hover:text-amber-900 transition-colors drop-shadow-[0_1px_0_rgba(255,255,255,0.9)]">
                {card.id < 10 ? `0${card.id}` : card.id}
              </span>
            </div>
            <span className="text-xs md:text-sm font-serif-literary text-[#7c5e2d] mt-2 font-semibold tracking-wide drop-shadow-[0_1px_0_rgba(255,255,255,0.7)]">
              Mảnh Ghép Mùa Đông
            </span>
          </div>

          {/* Bottom vintage accent line */}
          <div className="w-full flex items-center justify-center gap-2 opacity-75">
            <div className="h-[1px] w-10 md:w-14 bg-gradient-to-r from-transparent to-[#c49e5d]" />
            <div className="text-[11px] text-[#8c672b] select-none">❄</div>
            <div className="h-[1px] w-10 md:w-14 bg-gradient-to-l from-transparent to-[#c49e5d]" />
          </div>
        </div>

        {/* CARD BACK (Flipped Content - Tối ưu diện tích hiển thị nội dung chính) */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl p-3 sm:p-3.5 md:p-4 flex flex-col justify-between border-t border-l border-r border-b-[4px] transition-all duration-300 ${
            justFlipped ? 'animate-memory-wiggle' : ''
          } ${
            isMatched
              ? 'bg-gradient-to-br from-[#fffefc] via-[#fdf6e6] to-[#f9eccf] border-t-[#fde68a] border-l-[#d97706] border-r-[#d97706] border-b-[#92400e] stone-card-depth-matched ring-2 ring-amber-400/60'
              : 'bg-gradient-to-br from-[#ffffff] via-[#fcf8ee] to-[#f5ebd3] border-t-[#fff5db] border-l-[#c9ab73] border-r-[#c9ab73] border-b-[#8c672b] stone-card-depth'
          }`}
        >
          {/* Card Back Header - Thu nhỏ gọn trong 1 dòng trên cùng */}
          <div className="flex items-center justify-between border-b border-[#dfcaa0]/70 pb-1.5 shrink-0">
            <div className="flex items-center gap-1.5 min-w-0">
              {card.type === 'TITLE' ? (
                <BookOpen className="w-3 h-3 text-amber-800 shrink-0" />
              ) : (
                <Quote className="w-3 h-3 text-stone-600 shrink-0" />
              )}
              <span
                className={`text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider truncate font-sans-ui ${
                  card.type === 'TITLE' ? 'text-amber-800' : 'text-stone-600'
                }`}
              >
                {card.type === 'TITLE' ? 'Sự việc / Nhân vật' : 'Chi tiết văn bản'}
              </span>
              <span className="text-[10px] text-stone-400 font-serif-literary shrink-0">· Cặp 0{card.pairId}</span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 pl-1.5">
              <span className="text-[11px] font-mono font-bold text-stone-500">#{card.id}</span>
              {isMatched && (
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-amber-600 text-white shadow-xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}
            </div>
          </div>

          {/* Card Content - TỐI ĐA DIỆN TÍCH & CUỘN CHỮ TỰ ĐỘNG TỪ DƯỚI LÊN TRÊN */}
          <div
            ref={containerRef}
            className="relative flex-1 flex flex-col justify-center my-1.5 overflow-hidden px-1 py-0.5 select-none"
          >
            <div
              className={`w-full ${scrollDistance > 0 && flipped ? 'animate-card-autoscroll' : ''}`}
              style={
                scrollDistance > 0
                  ? ({
                      '--scroll-distance': `-${scrollDistance}px`,
                      '--scroll-duration': `${Math.max(4.5, Math.min(8, scrollDistance * 0.12))}s`,
                    } as React.CSSProperties)
                  : undefined
              }
            >
              <p
                ref={textRef}
                className={`font-serif-literary text-[#241a0e] ${
                  card.type === 'TITLE'
                    ? 'text-sm sm:text-base md:text-[17px] font-bold text-amber-950 text-center leading-snug drop-shadow-[0_0.5px_0_rgba(255,255,255,0.8)]'
                    : 'text-xs sm:text-[12.5px] md:text-[13.5px] text-stone-900 font-medium text-left leading-normal sm:leading-relaxed'
                }`}
              >
                {card.content}
              </p>
            </div>

            {/* Subtle gradient scrim at top and bottom so text glides seamlessly */}
            {scrollDistance > 0 && flipped && (
              <>
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-[#fbf5e6]/80 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-2.5 bg-gradient-to-t from-[#fbf5e6]/80 to-transparent pointer-events-none" />
              </>
            )}
          </div>

          {/* Card Back Footer Info - Tinh gọn nhẹ nhàng */}
          <div className="pt-1 border-t border-[#dfcaa0]/40 flex items-center justify-between text-[10px] text-stone-500 font-serif-literary shrink-0">
            <span className="truncate max-w-[160px] font-medium text-amber-950/80">
              {card.pairName}
            </span>
            <div className="flex items-center gap-1.5">
              {scrollDistance > 0 && flipped && (
                <span className="text-[9px] text-amber-800 font-serif-literary font-semibold flex items-center gap-0.5">
                  ↑ Tự cuộn
                </span>
              )}
              <span className="font-mono text-stone-400">Thẻ 0{card.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};
