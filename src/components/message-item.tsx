'use client';

import { format } from 'date-fns';
import { Clock, Frown, Meh, Smile, Webhook, Loader2 } from 'lucide-react';
import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type MessageItemProps = {
  message: Message;
};

const sentimentStyles = {
  positive: 'border-green-500/50 bg-green-500/5',
  negative: 'border-red-500/50 bg-red-500/5',
  neutral: 'border-border',
};

export function MessageItem({ message }: MessageItemProps) {
  const getSentimentInfo = () => {
    if (message.isAnalyzing) {
      return {
        Icon: Loader2,
        label: 'Analyzing...',
        className: 'animate-spin text-muted-foreground',
      };
    }
    if (!message.sentiment) {
      return null;
    }
    const sentiment = message.sentiment.sentiment.toLowerCase();
    switch (sentiment) {
      case 'positive':
        return { Icon: Smile, label: 'Positive', className: 'text-green-600 dark:text-green-400' };
      case 'negative':
        return { Icon: Frown, label: 'Negative', className: 'text-red-600 dark:text-red-400' };
      default:
        return { Icon: Meh, label: 'Neutral', className: 'text-yellow-600 dark:text-yellow-400' };
    }
  };

  const sentimentInfo = getSentimentInfo();
  const sentimentClass = sentimentInfo && !message.isAnalyzing && message.sentiment ? sentimentStyles[message.sentiment.sentiment.toLowerCase() as keyof typeof sentimentStyles] : sentimentStyles.neutral;

  return (
    <div className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Avatar className="h-8 w-8 border">
        <AvatarFallback className="bg-background">
          <Webhook className="h-4 w-4 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
      <div className={cn("flex-1 space-y-1 rounded-lg border px-3 py-2", sentimentClass)}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{format(message.timestamp, 'h:mm a')}</span>
          </div>
          {sentimentInfo && (
            <div className={cn('flex items-center gap-1', sentimentInfo.className)}>
              <sentimentInfo.Icon className="h-3 w-3" />
              <span>{sentimentInfo.label}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
