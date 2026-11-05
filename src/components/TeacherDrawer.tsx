import React, { useState } from 'react';
import { PairData } from '../types/game';
import { X, Save, RotateCcw, Check, Sparkles } from 'lucide-react';

interface TeacherDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pairs: PairData[];
  onSavePairs: (updatedPairs: PairData[]) => void;
  onResetDefault: () => void;
}

export const TeacherDrawer: React.FC<TeacherDrawerProps> = ({
  isOpen,
  onClose,
  pairs,
  onSavePairs,
  onResetDefault,
}) => {
  const [formData, setFormData] = useState<PairData[]>(pairs);
  const [saveSuccess, setSaveSuccess] = useState(false);

  React.useEffect(() => {
    setFormData(pairs);
  }, [pairs]);

  if (!isOpen) return null;

  const handleChange = (index: number, field: keyof PairData, value: string) => {
    const updated = [...formData];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(updated);
  };

  const handleSave = () => {
    onSavePairs(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 900);
  };

  const handleReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục lại 5 cặp thẻ nguyên bản theo chuẩn SGK Ngữ văn 6?')) {
      onResetDefault();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in text-stone-900">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-gradient-to-b from-[#fffefc] to-[#f7eee0] border-2 border-[#cbb07a] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5d2ac] bg-[#f6ead3]">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 text-amber-800 border border-amber-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-amber-950 font-serif-literary">
                Bảng Soạn Thảo & Tùy Chỉnh Thẻ (Giáo Viên)
              </h2>
              <p className="text-xs text-stone-600 font-sans-ui">
                Chỉnh sửa nội dung 5 cặp thẻ sự việc và dẫn chứng trong bài học
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-[#ebd8b7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
          {formData.map((pair, index) => (
            <div
              key={pair.id}
              className="p-4 rounded-2xl bg-white/90 border border-[#ddcaa4] shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between border-b border-[#ebdcc0] pb-2">
                <span className="text-xs font-bold text-amber-900 font-mono">
                  CẶP KÍ ỨC #{pair.id}: {pair.name}
                </span>
                <span className="text-[11px] text-stone-600 font-serif-literary">{pair.sceneTheme}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title Card */}
                <div>
                  <label className="block text-xs font-bold text-amber-950 mb-1 font-serif-literary">
                    Thẻ Sự việc / Nhân vật (Thẻ ngắn):
                  </label>
                  <input
                    type="text"
                    value={pair.titleCard}
                    onChange={(e) => handleChange(index, 'titleCard', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-[#fdfbf6] border border-[#d2ba8a] text-stone-900 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* Detail Card */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1 font-serif-literary">
                    Thẻ Chi tiết văn bản (Thẻ dài):
                  </label>
                  <textarea
                    rows={2}
                    value={pair.detailCard}
                    onChange={(e) => handleChange(index, 'detailCard', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-[#fdfbf6] border border-[#d2ba8a] text-stone-900 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500 font-serif-literary"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#e5d2ac] bg-[#f6ead3]">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-stone-700 hover:text-stone-950 hover:bg-[#ebd8b7] border border-[#d2ba8a] transition-colors font-serif-literary"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi phục chuẩn SGK</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-stone-700 hover:bg-[#ebd8b7] transition-colors font-serif-literary"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-[#8c5a2b] hover:bg-[#73471f] text-white shadow-md transition-all cursor-pointer font-serif-literary"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Đã lưu thành công!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Lưu thay đổi</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
