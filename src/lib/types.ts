export type Sentiment = {
  sentiment: string;
  score: number;
} | null;

export type Message = {
  id: string;
  text: string;
  timestamp: Date;
  sentiment: Sentiment;
  isAnalyzing: boolean;
  author: 'user' | 'bot';
};
