import { useState, useEffect, useCallback, useRef } from 'react';
import { PairData, CardItem, GameMode, TeamScore, AiNarrativeState } from './types/game';
import { DEFAULT_PAIRS } from './data/defaultCards';
import { soundManager } from './utils/sound';
import { CardTile } from './components/CardTile';
import { MemoryParchmentPanel } from './components/MemoryParchmentPanel';
import { ScoreboardBar } from './components/ScoreboardBar';
import { TeacherDrawer } from './components/TeacherDrawer';
import { ConclusionModal } from './components/ConclusionModal';
import { Play, Maximize2, Settings, BookMarked, Sparkles, Timer, Eye } from 'lucide-react';

const INITIAL_TEAMS: TeamScore[] = [
  { id: 1, name: 'Tổ 1', score: 0, color: '#0284C7' }, // sky blue
  { id: 2, name: 'Tổ 2', score: 0, color: '#059669' }, // emerald
  { id: 3, name: 'Tổ 3', score: 0, color: '#D97706' }, // amber
  { id: 4, name: 'Tổ 4', score: 0, color: '#E11D48' }, // rose
];

const LOCAL_STORAGE_KEY = 'gio_lanh_dau_mua_pairs_v1';

export default function App() {
  // Pairs setup
  const [pairs, setPairs] = useState<PairData[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_PAIRS;
  });

  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<CardItem[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<number[]>([]);
  const [latestMatchedId, setLatestMatchedId] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // 8s Rapid Card Preview & Countdown State
  const [isPreviewing, setIsPreviewing] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(8);
  const previewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Classroom Mode & State
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [gameMode, setGameMode] = useState<GameMode>('EXPLORATION');
  const [teams, setTeams] = useState<TeamScore[]>(INITIAL_TEAMS);
  const [currentTeamIndex, setCurrentTeamIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(soundManager.isMuted);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Modals
  const [isTeacherDrawerOpen, setIsTeacherDrawerOpen] = useState<boolean>(false);
  const [isConclusionOpen, setIsConclusionOpen] = useState<boolean>(false);

  // AI Storyteller State
  const [aiStory, setAiStory] = useState<AiNarrativeState>({
    speaker: 'Thủ thư Mùa Đông',
    message: 'Chào mừng các em học sinh lớp 6 đến với phố chợ đầu đông! Hãy cùng nhau lật mở từng mảnh kí ức để thắp sáng bức tranh tình người trong truyện Gió lạnh đầu mùa.',
    isLoading: false,
    type: 'intro',
  });

  // Initialize and shuffle 10 cards
  const initializeDeck = useCallback((sourcePairs: PairData[]) => {
    const deck: Omit<CardItem, 'id'>[] = [];

    sourcePairs.forEach((pair) => {
      // Card A: Title / Event / Character
      deck.push({
        pairId: pair.id,
        type: 'TITLE',
        label: `Sự việc #${pair.id}`,
        content: pair.titleCard,
        pairName: pair.name,
      });

      // Card B: Text Detail / Evidence
      deck.push({
        pairId: pair.id,
        type: 'DETAIL',
        label: `Chi tiết #${pair.id}`,
        content: pair.detailCard,
        pairName: pair.name,
      });
    });

    // Fisher-Yates Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    const finalCards: CardItem[] = deck.map((item, index) => ({
      ...item,
      id: index + 1,
    }));

    setCards(finalCards);
    setSelectedCards([]);
    setMatchedPairIds([]);
    setLatestMatchedId(null);
    setIsLocked(false);
  }, []);

  useEffect(() => {
    initializeDeck(pairs);
  }, [pairs, initializeDeck]);

  // Fullscreen listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Background music start on user interaction
  useEffect(() => {
    const handleFirstGesture = () => {
      soundManager.startBgm();
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, []);

  // Fetch AI commentary from backend
  const fetchAiCommentary = async (
    pairId: number,
    pairTitle: string,
    isMatch: boolean,
    c1Text: string,
    c2Text: string
  ) => {
    setAiStory((prev) => ({ ...prev, isLoading: true }));
    try {
      const res = await fetch('/api/gemini/commentary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pairId,
          pairTitle,
          isMatch,
          card1Text: c1Text,
          card2Text: c2Text,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiStory({
          speaker: 'Thủ thư Mùa Đông',
          message: data.commentary || 'Hãy tiếp tục tìm kiếm những mảnh ghép kí ức tiếp theo nhé!',
          isLoading: false,
          type: isMatch ? 'match' : 'mismatch',
        });
        return;
      }
    } catch {
      // fallback
    }

    setAiStory({
      speaker: 'Thủ thư Mùa Đông',
      message: isMatch
        ? `Tuyệt vời! Chi tiết về "${pairTitle}" đã được làm sáng tỏ và thắp ấm bức tranh phố chợ.`
        : 'Hai chi tiết này chưa phải của nhau rồi! Hãy cùng nhau trao đổi kĩ hơn để tìm cặp đúng nhé!',
      isLoading: false,
      type: isMatch ? 'match' : 'mismatch',
    });
  };

  // Card Selection & Matching Logic
  const handleCardSelect = (card: CardItem) => {
    if (isLocked) return;
    if (selectedCards.length === 0) {
      soundManager.playFlip();
      setSelectedCards([card]);
      return;
    }

    if (selectedCards.length === 1) {
      const firstCard = selectedCards[0];
      if (firstCard.id === card.id) return;

      soundManager.playFlip();
      const newSelected = [firstCard, card];
      setSelectedCards(newSelected);
      setIsLocked(true);

      const isMatch =
        firstCard.pairId === card.pairId && firstCard.type !== card.type;

      if (isMatch) {
        // MATCH SUCCESS
        setTimeout(() => {
          soundManager.playMatch();
          const nextMatched = [...matchedPairIds, card.pairId];
          setMatchedPairIds(nextMatched);
          setLatestMatchedId(card.pairId);

          if (gameMode === 'COMPETITION') {
            setTeams((prev) =>
              prev.map((t, idx) =>
                idx === currentTeamIndex
                  ? { ...t, score: t.score + 10 }
                  : t
              )
            );
          }

          setSelectedCards([]);
          setIsLocked(false);

          fetchAiCommentary(
            card.pairId,
            card.pairName,
            true,
            firstCard.content,
            card.content
          );

          if (nextMatched.length === 5) {
            setTimeout(() => {
              soundManager.playVictory();
              setIsConclusionOpen(true);
            }, 600);
          }
        }, 400);
      } else {
        // MISMATCH
        setTimeout(() => {
          soundManager.playMismatch();

          fetchAiCommentary(
            firstCard.pairId,
            firstCard.pairName,
            false,
            firstCard.content,
            card.content
          );

          setTimeout(() => {
            setSelectedCards([]);
            setIsLocked(false);

            if (gameMode === 'COMPETITION') {
              setCurrentTeamIndex((prev) => (prev + 1) % teams.length);
            }
          }, 1100);
        }, 500);
      }
    }
  };

  // Hint Request
  const handleRequestHint = () => {
    const remainingPairs = pairs.filter((p) => !matchedPairIds.includes(p.id));
    if (remainingPairs.length === 0) return;

    const randomPair = remainingPairs[Math.floor(Math.random() * remainingPairs.length)];
    setAiStory({
      speaker: 'Thủ thư Mùa Đông',
      message: `Gợi ý dành cho các em: Hãy tìm sự việc gắn liền với chủ đề "${randomPair.sceneTheme}". Trong đó có sự xuất hiện của "${randomPair.name}".`,
      isLoading: false,
      type: 'intro',
    });
  };

  // Stop preview helper
  const stopPreview = useCallback((endEarly: boolean = false) => {
    if (previewTimerRef.current) {
      clearTimeout(previewTimerRef.current);
      previewTimerRef.current = null;
    }
    if (previewIntervalRef.current) {
      clearInterval(previewIntervalRef.current);
      previewIntervalRef.current = null;
    }

    setIsPreviewing(false);
    setIsLocked(false);
    setCountdown(8);
    soundManager.playFlip();

    setAiStory({
      speaker: 'Thủ thư Mùa Đông',
      message: endEarly
        ? 'Các em đã sẵn sàng! Các mảnh kí ức đã úp lại. Xin mời bắt đầu lật tìm các cặp thẻ tương ứng!'
        : 'Thời gian ghi nhớ 8 giây đã hết! Các mảnh kí ức đã úp lại. Xin mời các em bắt đầu lật tìm các cặp thẻ tương ứng!',
      isLoading: false,
      type: 'intro',
    });
  }, []);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
      if (previewIntervalRef.current) clearInterval(previewIntervalRef.current);
    };
  }, []);

  // Restart / Reset
  const handleRestart = () => {
    if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
    if (previewIntervalRef.current) clearInterval(previewIntervalRef.current);
    initializeDeck(pairs);
    setTeams(INITIAL_TEAMS);
    setCurrentTeamIndex(0);
    setIsConclusionOpen(false);
    setIsPreviewing(false);
    setCountdown(8);
    setAiStory({
      speaker: 'Thủ thư Mùa Đông',
      message: 'Các mảnh kí ức đã được xáo trộn lại! Nhấn nút "Bắt đầu" ở trên dãy thẻ bài để xem trong 8 giây trước khi tìm cặp nhé.',
      isLoading: false,
      type: 'intro',
    });
  };

  // Start round with 8s rapid card peek
  const handleStartRoundWithPreview = () => {
    if (isPreviewing || isLocked) return;

    if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
    if (previewIntervalRef.current) clearInterval(previewIntervalRef.current);

    soundManager.playFlip();
    soundManager.startBgm();

    setIsPreviewing(true);
    setIsLocked(true);
    setCountdown(8);

    setAiStory({
      speaker: 'Thủ thư Mùa Đông',
      message: 'Các em có 8 giây quý giá để ghi nhớ vị trí các sự việc và chi tiết. Hãy tập trung quan sát thật nhanh nhé!',
      isLoading: false,
      type: 'intro',
    });

    let secondsLeft = 8;
    previewIntervalRef.current = setInterval(() => {
      secondsLeft -= 1;
      if (secondsLeft >= 0) {
        setCountdown(secondsLeft);
      }
    }, 1000);

    previewTimerRef.current = setTimeout(() => {
      stopPreview(false);
    }, 8000);
  };

  // Fullscreen
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Sound Mute Toggle
  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    soundManager.setMuted(nextMute);
  };

  // Teacher save
  const handleSavePairs = (updatedPairs: PairData[]) => {
    setPairs(updatedPairs);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedPairs));
    } catch {
      // ignore
    }
    initializeDeck(updatedPairs);
  };

  // Teacher reset
  const handleResetDefault = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setPairs(DEFAULT_PAIRS);
    initializeDeck(DEFAULT_PAIRS);
  };

  // Teacher Bonus (+5 points)
  const handleAddBonusPoints = (teamId: number) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, score: t.score + 5 } : t))
    );
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat flex flex-col justify-between selection:bg-amber-500/30 font-sans-ui overflow-hidden"
      style={{
        backgroundImage: `url('/assets/pho_cho_xua.png')`,
      }}
    >
      {/* Subtle atmospheric morning winter haze overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-900/10 via-transparent to-amber-950/15 pointer-events-none" />

      {/* INTRO SCREEN */}
      {!isStarted ? (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-3xl p-8 md:p-10 rounded-3xl bg-[#fffdf8]/90 border-2 border-[#d6be8c] shadow-2xl backdrop-blur-md space-y-6 text-stone-900 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f4ebd0] border border-[#d8c399] text-[#784d1a] text-xs font-bold tracking-wider uppercase font-serif-literary">
              <BookMarked className="w-4 h-4" />
              <span>Ngữ văn 6 · Gió lạnh đầu mùa (Thạch Lam)</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#4a2e12] font-serif-literary">
              Mảnh Ghép Kí Ức
            </h1>
            <p className="text-xl md:text-2xl font-serif-literary text-[#7c5625] italic">
              Phố chợ mùa đông · Hành trình tìm lại hơi ấm
            </p>

            <p className="text-sm md:text-base text-stone-700 max-w-xl mx-auto leading-relaxed font-serif-literary">
              Trò chơi lật thẻ tương tác kết hợp người dẫn chuyện AI. Cùng nhau tìm 5 cặp sự việc và chi tiết tiêu biểu trên phố chợ đầu đông để khám phá vẻ đẹp của tình người và chuẩn bị bước vào Tiết 2.
            </p>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => {
                  soundManager.playFlip();
                  soundManager.startBgm();
                  setIsStarted(true);
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#8c5a2b] to-[#a86e35] hover:from-[#73471f] hover:to-[#8c5a2b] text-white font-extrabold text-base shadow-xl shadow-amber-950/20 transition-all transform hover:scale-105 cursor-pointer font-serif-literary"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>BẮT ĐẦU KHÁM PHÁ</span>
              </button>

              <button
                onClick={() => setIsTeacherDrawerOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white/80 text-stone-800 hover:bg-white border border-[#d2ba8a] font-bold text-sm transition-colors cursor-pointer font-serif-literary"
              >
                <Settings className="w-4 h-4 text-amber-800" />
                <span>Soạn thảo thẻ (Giáo viên)</span>
              </button>
            </div>

            <div className="pt-4 flex items-center justify-center gap-4 text-xs text-stone-600 font-serif-literary">
              <span>Chuẩn màn hình 16:9</span>
              <span>·</span>
              <span>Lật thẻ 3D mượt mà</span>
              <span>·</span>
              <span>Người dẫn chuyện AI</span>
            </div>
          </div>
        </div>
      ) : (
        /* MAIN GAMEPLAY VIEW INTEGRATED INTO THE ARTWORK */
        <div className="relative z-10 flex-1 flex flex-col justify-between max-w-[1780px] w-full mx-auto p-3 md:p-5 gap-3">
          {/* Top Bar: Floating Antique Header */}
          <header className="flex items-center justify-between px-3 py-1.5 rounded-2xl bg-[#fdfbf6]/85 border border-[#dfcaa0] shadow-md backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsStarted(false)}
                className="flex items-center gap-2 text-stone-800 hover:text-amber-800 transition-colors"
                title="Quay lại màn hình chính"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-300">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h1 className="text-sm md:text-base font-bold tracking-tight text-[#42290d] font-serif-literary">
                  MẢNH GHÉP KÍ ỨC <span className="text-xs font-normal text-stone-600 hidden sm:inline">· Phố chợ mùa đông</span>
                </h1>
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="hidden sm:flex items-center gap-1.5 text-stone-600 font-serif-literary">
                <span>Văn bản:</span>
                <span className="font-bold text-amber-950">Gió lạnh đầu mùa (Thạch Lam)</span>
              </div>

              <button
                onClick={handleToggleFullscreen}
                className="p-1 rounded-lg bg-white/80 text-stone-700 hover:text-stone-950 border border-[#dfcaa0]"
                title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Main 2-Zone Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 flex-1 items-stretch my-1">
            {/* LEFT ZONE (8 cols on desktop): 10 Cards on Cobblestone Plaza */}
            <div className="lg:col-span-8 flex flex-col justify-center">
              {/* Nút Ấn Bắt Đầu & Bộ Đếm Thời Gian 8s (Nằm ngay trên dãy thẻ bài đầu tiên) */}
              <div className="flex items-center justify-between gap-3 mb-2.5 px-1 bg-[#fdfbf6]/70 border border-[#dfcaa0]/80 rounded-xl py-1.5 px-3 backdrop-blur-sm shadow-xs">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={isPreviewing ? () => stopPreview(true) : handleStartRoundWithPreview}
                    disabled={!isPreviewing && isLocked}
                    className={`flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-2 rounded-xl font-bold font-serif-literary text-xs md:text-sm shadow-sm transition-all cursor-pointer ${
                      isPreviewing
                        ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-2 border-amber-500 shadow-amber-500/20'
                        : 'bg-gradient-to-r from-[#8c5a2b] via-[#9e6935] to-[#8c5a2b] hover:from-[#78481c] hover:to-[#8c5a2b] text-white border border-[#d6be8c] hover:shadow-md hover:scale-[1.02]'
                    } disabled:opacity-70 disabled:cursor-not-allowed`}
                    title={
                      isPreviewing
                        ? 'Nhấn vào đây để úp thẻ bài lại và bắt đầu chơi ngay'
                        : 'Lật xem tất cả thẻ bài trong 8 giây để quan sát và ghi nhớ vị trí'
                    }
                  >
                    {isPreviewing ? (
                      <>
                        <Timer className="w-4 h-4 text-amber-800 animate-spin" />
                        <span>ĐANG GHI NHỚ: 0{countdown}s · ÚP THẺ NGAY</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current text-amber-200" />
                        <span>BẮT ĐẦU (LẬT XEM 8S)</span>
                      </>
                    )}
                  </button>

                  <span className="text-[11px] md:text-xs text-stone-700 font-serif-literary italic hidden sm:inline">
                    {isPreviewing
                      ? 'Nhanh tay ghi nhớ vị trí các sự việc & chi tiết (có thể bấm "Úp thẻ ngay")...'
                      : 'Lật xem trước tất cả thẻ trong 8 giây trước khi vào trận'}
                  </span>
                </div>

                {/* Status Badge when previewing */}
                {isPreviewing ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-600/40 text-amber-950 font-bold text-xs font-mono">
                    <Eye className="w-3.5 h-3.5 text-amber-800" />
                    <span>0{countdown}s</span>
                  </div>
                ) : (
                  <span className="text-[11px] text-stone-500 font-mono hidden md:inline">
                    5 CẶP · 10 THẺ
                  </span>
                )}
              </div>

              {/* 10 Card Grid (5 columns x 2 rows) - Expanded sizing */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 md:gap-4 lg:gap-4.5">
                {cards.map((card) => {
                  const isSelected = selectedCards.some((c) => c.id === card.id);
                  const isMatched = matchedPairIds.includes(card.pairId);

                  return (
                    <CardTile
                      key={card.id}
                      card={card}
                      isFlipped={isSelected || isPreviewing}
                      isMatched={isMatched}
                      isSelected={isSelected}
                      onSelect={handleCardSelect}
                      disabled={isLocked || isPreviewing}
                    />
                  );
                })}
              </div>
            </div>

            {/* RIGHT ZONE (4 cols on desktop): Fits precisely into the yellow house wall parchment panel */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <MemoryParchmentPanel
                pairs={pairs}
                matchedPairIds={matchedPairIds}
                latestMatchedId={latestMatchedId}
                aiMessage={aiStory.message}
                isAiLoading={aiStory.isLoading}
                onRequestHint={handleRequestHint}
                hasUnmatched={matchedPairIds.length < 5}
              />
            </div>
          </div>

          {/* Bottom Parchment Ribbon: Scoreboard & Utilities */}
          <ScoreboardBar
            mode={gameMode}
            onToggleMode={(m) => setGameMode(m)}
            teams={teams}
            currentTeamIndex={currentTeamIndex}
            onNextTeam={() => setCurrentTeamIndex((prev) => (prev + 1) % teams.length)}
            onAddBonusPoints={handleAddBonusPoints}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
            onRestart={handleRestart}
            onOpenTeacherSettings={() => setIsTeacherDrawerOpen(true)}
          />
        </div>
      )}

      {/* Teacher Drawer Modal */}
      <TeacherDrawer
        isOpen={isTeacherDrawerOpen}
        onClose={() => setIsTeacherDrawerOpen(false)}
        pairs={pairs}
        onSavePairs={handleSavePairs}
        onResetDefault={handleResetDefault}
      />

      {/* Conclusion & Lesson 2 Modal */}
      <ConclusionModal
        isOpen={isConclusionOpen}
        onClose={() => setIsConclusionOpen(false)}
        onRestart={handleRestart}
        pairs={pairs}
        teams={teams}
        isCompetitionMode={gameMode === 'COMPETITION'}
      />
    </div>
  );
}
