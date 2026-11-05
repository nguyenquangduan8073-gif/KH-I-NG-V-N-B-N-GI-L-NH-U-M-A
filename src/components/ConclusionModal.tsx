import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { PairData, TeamScore } from '../types/game';
import { Sparkles, ArrowRight, RotateCcw, Heart, ShieldAlert, Award } from 'lucide-react';

interface ConclusionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  pairs: PairData[];
  teams: TeamScore[];
  isCompetitionMode: boolean;
}

export const ConclusionModal: React.FC<ConclusionModalProps> = ({
  isOpen,
  onClose,
  onRestart,
  pairs,
  teams,
  isCompetitionMode,
}) => {
  const [showLesson2Details, setShowLesson2Details] = useState(false);

  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D97706', '#B45309', '#F59E0B', '#FBBF24', '#78350F'],
      });
    } else {
      setShowLesson2Details(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const winningTeam = isCompetitionMode
    ? [...teams].sort((a, b) => b.score - a.score)[0]
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in text-stone-900">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-gradient-to-b from-[#fffef9] via-[#faf3e3] to-[#f4e6c8] border-2 border-[#cbb07a] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2cca4] bg-[#f6ebd4]/90">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-700 animate-spin" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-950 font-serif-literary">
              KẾT QUẢ HOÀN THÀNH · 5/5 MẢNH GHÉP KÍ ỨC ĐÃ TỎA SÁNG
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-xs font-medium text-stone-600 hover:text-stone-900 px-3 py-1 rounded-lg hover:bg-[#ebd8b7] transition-colors"
          >
            Đóng xem lại bàn cờ
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-thin">
          {!showLesson2Details ? (
            /* VIEW 1: VICTORY & PEDAGOGICAL QUESTION TRANSITION */
            <div className="space-y-6">
              {/* Competition Winner Badge if active */}
              {isCompetitionMode && winningTeam && (
                <div className="flex items-center justify-center gap-3 p-3 rounded-2xl bg-amber-100/90 border border-amber-300 text-amber-950 shadow-sm">
                  <Award className="w-5 h-5 text-amber-700" />
                  <span className="text-sm font-semibold font-serif-literary">
                    Chúc mừng <strong>{winningTeam.name}</strong> dẫn đầu với <strong className="font-mono text-amber-800">{winningTeam.score} điểm</strong>! Cả lớp đều đã hoàn thành xuất sắc nhiệm vụ.
                  </span>
                </div>
              )}

              {/* Title and Congratulatory Note */}
              <div className="text-center space-y-2">
                <span className="text-4xl">🌤️</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-amber-950 font-serif-literary">
                  Phố Chợ Đầu Đông Đã Tràn Ngập Hơi Ấm Tình Người
                </h2>
                <p className="text-sm text-stone-700 max-w-2xl mx-auto font-serif-literary italic">
                  &ldquo;Giữa cái lạnh đầu mùa cắt da cắt thịt, lòng nhân ái trong sáng và sự sẻ chia chân thành đã làm nên hơi ấm xua tan giá buốt.&rdquo;
                </p>
              </div>

              {/* 5 Reconstructed Storyboard Memory Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                {pairs.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl bg-white/90 border border-[#ddcaa4] shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[11px] font-mono font-bold text-amber-800">
                        0{p.id}. {p.name}
                      </span>
                      <p className="text-[11px] text-stone-700 mt-1 line-clamp-3 font-serif-literary leading-snug">
                        {p.detailCard}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Central Key Pedagogical Question for Lesson 2 */}
              <div className="p-6 rounded-2xl bg-[#fdfaf2] border-2 border-amber-600/70 shadow-lg space-y-3">
                <div className="flex items-center gap-2 text-amber-900 text-xs font-bold uppercase tracking-wider font-serif-literary">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Vấn đề cốt lõi · Chuyển tiếp sang Tiết 2</span>
                </div>
                <blockquote className="font-serif-literary text-base md:text-lg text-amber-950 font-bold leading-relaxed italic border-l-4 border-amber-600 pl-4">
                  &ldquo;Cùng là một chiếc áo bông cũ, vì sao ban đầu Sơn cho đi với niềm vui ấm áp, nhưng sau đó lại lấm lét lẩn tránh, sợ hãi đi đòi lại? Và hành động đi đòi áo ấy có khiến Sơn trở thành một nhân vật đáng trách?&rdquo;
                </blockquote>
                <p className="text-xs text-stone-600 pt-1 font-serif-literary">
                  Đây là câu hỏi trọng tâm giúp các em bước vào thế giới nội tâm tinh tế, ngây thơ của nhân vật Sơn ở Tiết 2.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setShowLesson2Details(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#8c5a2b] to-[#a86e35] text-white font-extrabold text-sm shadow-xl shadow-amber-900/20 hover:from-[#73471f] hover:to-[#8c5a2b] transition-all cursor-pointer font-serif-literary"
                >
                  <span>KHÁM PHÁ BÍ MẬT TÂM HỒN SƠN (TIẾT 2)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onRestart}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white text-stone-800 hover:bg-[#faebd0] border border-[#d2ba8a] font-semibold text-sm transition-colors cursor-pointer font-serif-literary"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Chơi lại vòng mới</span>
                </button>
              </div>
            </div>
          ) : (
            /* VIEW 2: LESSON 2 INTRODUCTION (BÍ MẬT TÂM HỒN SƠN) */
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-widest font-mono">
                  TIẾT 2: TÌM HIỂU CHI TIẾT VĂN BẢN
                </span>
                <h3 className="text-2xl font-bold text-amber-950 font-serif-literary">
                  Khám Phá Thế Giới Nội Tâm Của Nhân Vật Sơn
                </h3>
                <p className="text-xs text-stone-600 font-serif-literary">
                  Gợi ý thảo luận nhóm và chiều sâu nhân đạo của ngòi bút Thạch Lam
                </p>
              </div>

              {/* 3 Reflection Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white/95 border border-[#d8be8d] shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-sky-800 font-bold text-sm font-serif-literary">
                    <Heart className="w-4 h-4 text-sky-600" />
                    <h4>1. Lòng trắc ẩn tự nhiên</h4>
                  </div>
                  <p className="font-serif-literary text-xs text-stone-700 leading-relaxed">
                    Sơn cho bạn chiếc áo xuất phát từ tình thương vô tư trong sáng của một đứa trẻ có tâm hồn nhạy cảm, giàu lòng trắc ẩn, không hề vụ lợi hay khoe khoang.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/95 border border-[#d8be8d] shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-sm font-serif-literary">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <h4>2. Nỗi sợ hãi trẻ thơ</h4>
                  </div>
                  <p className="font-serif-literary text-xs text-stone-700 leading-relaxed">
                    Việc đi đòi áo không đáng trách; đó chỉ là phản xạ sợ hãi rất đỗi trẻ con khi nhớ ra mình tự ý đem cho chiếc áo kỷ vật của người em đã mất.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/95 border border-[#d8be8d] shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-sm font-serif-literary">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <h4>3. Lòng bao dung người lớn</h4>
                  </div>
                  <p className="font-serif-literary text-xs text-stone-700 leading-relaxed">
                    Sự cảm thông của người mẹ (cho vay tiền may áo ấm thay vì trách mắng) đã bảo vệ mầm thiện lành, bồi đắp lòng nhân hậu cho hai đứa trẻ.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-[#e2cca4]">
                <button
                  onClick={() => setShowLesson2Details(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-white text-stone-700 hover:bg-[#faebd0] border border-[#d2ba8a] transition-colors font-serif-literary"
                >
                  Quay lại câu hỏi tổng kết
                </button>

                <button
                  onClick={onRestart}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8c5a2b] text-white font-bold text-xs hover:bg-[#73471f] transition-all cursor-pointer shadow-md font-serif-literary"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Bắt đầu trò chơi mới</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
