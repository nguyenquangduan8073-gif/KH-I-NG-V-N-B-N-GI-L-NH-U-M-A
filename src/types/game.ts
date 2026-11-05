export interface PairData {
  id: number;
  name: string;
  titleCard: string;
  detailCard: string;
  sceneSummary: string;
  sceneTheme: string;
}

export interface CardItem {
  id: number; // 1 to 10
  pairId: number; // 1 to 5
  type: 'TITLE' | 'DETAIL';
  label: string;
  content: string;
  pairName: string;
}

export type GameMode = 'EXPLORATION' | 'COMPETITION';

export interface TeamScore {
  id: number;
  name: string;
  score: number;
  color: string;
}

export interface AiNarrativeState {
  speaker: string;
  message: string;
  isLoading: boolean;
  type: 'intro' | 'match' | 'mismatch' | 'victory';
}
