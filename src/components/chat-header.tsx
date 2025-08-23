'use client';

import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type ChatHeaderProps = {
  onSummarize: () => void;
  summary: string | null;
  isSummarizing: boolean;
};

export function ChatHeader({ onSummarize, summary, isSummarizing }: ChatHeaderProps) {
  return (
    <div className="flex flex-col p-4 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
          <h1 className="text-xl font-bold text-primary">WebbyTalk</h1>
        </div>
        <Button onClick={onSummarize} disabled={isSummarizing} size="sm">
          {isSummarizing ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Sparkles />
          )}
          <span className="ml-2 hidden sm:inline">
            {isSummarizing ? 'Summarizing...' : 'Summarize'}
          </span>
        </Button>
      </div>
      {summary && (
        <Alert className="mt-4 bg-accent/10 border-accent/50 animate-in fade-in">
          <Sparkles className="h-4 w-4 text-accent" />
          <AlertTitle className="font-semibold text-accent">Conversation Summary</AlertTitle>
          <AlertDescription className="text-foreground/80">{summary}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
