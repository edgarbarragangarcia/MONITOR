'use client';

import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ChatHeaderProps = {
  onDownload: () => void;
  isDownloading: boolean;
};

export function ChatHeader({ onDownload, isDownloading }: ChatHeaderProps) {
  return (
    <div className="flex flex-col p-4 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
          <h1 className="text-xl font-bold text-primary">INGENES CHAT ENTRENAMIENTO AGENTES</h1>
        </div>
        <Button onClick={onDownload} disabled={isDownloading} size="sm">
          {isDownloading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Download />
          )}
          <span className="ml-2 hidden sm:inline">
            {isDownloading ? 'Downloading...' : 'Download'}
          </span>
        </Button>
      </div>
    </div>
  );
}
