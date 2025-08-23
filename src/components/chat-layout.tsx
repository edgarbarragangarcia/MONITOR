'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Message } from '@/lib/types';
import { getSentiment, getSummary } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { ChatHeader } from './chat-header';
import { MessageList } from './message-list';
import { ChatInput } from './chat-input';

export function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const addMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const newMessage: Message = {
      id: `${Date.now()}-${Math.random()}`,
      text,
      timestamp: new Date(),
      sentiment: null,
      isAnalyzing: true,
    };
    setMessages(prev => [...prev, newMessage]);

    try {
      const sentiment = await getSentiment(text);
      setMessages(prev => 
        prev.map(m => m.id === newMessage.id ? { ...m, sentiment, isAnalyzing: false } : m)
      );
    } catch (error) {
      console.error(error);
      setMessages(prev => 
        prev.map(m => m.id === newMessage.id ? { ...m, isAnalyzing: false } : m)
      );
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to analyze message sentiment.",
      });
    }
  }, [toast]);

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setSummary(null);
    const conversationHistory = messages.map(m => `User: ${m.text}`).join('\n');
    
    try {
      const result = await getSummary(conversationHistory);
      setSummary(result.summary);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Summarization Failed",
        description: (error as Error).message,
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl h-[70vh] flex flex-col shadow-2xl rounded-2xl">
      <ChatHeader 
        onSummarize={handleSummarize} 
        summary={summary} 
        isSummarizing={isSummarizing}
      />
      <MessageList messages={messages} />
      <ChatInput onSendMessage={addMessage} />
    </Card>
  );
}
