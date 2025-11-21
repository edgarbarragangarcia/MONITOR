
export interface Message {
  id: string;
  timestamp: string;
  sender: string;
  text: string;
  role: 'user' | 'agent' | 'system';
  conversationId: string; // Links user and agent messages to a specific conversation
}

export interface AnalysisResult {
  sentiment: 'positive' | 'neutral' | 'negative' | 'alert';
  summary: string;
  intent: string;
  suggestions: string[];
}

export enum SheetStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
