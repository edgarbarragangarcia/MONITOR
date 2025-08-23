'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Message } from '@/lib/types';
import { getSentiment, sendToWebhook } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { ChatHeader } from './chat-header';
import { MessageList } from './message-list';
import { ChatInput } from './chat-input';

export function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const addMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      text,
      timestamp: new Date(),
      sentiment: null,
      isAnalyzing: true,
      author: 'user',
    };
    setMessages(prev => [...prev, userMessage]);

    // Get sentiment for user message
    try {
      const sentiment = await getSentiment(text);
      setMessages(prev => 
        prev.map(m => m.id === userMessage.id ? { ...m, sentiment, isAnalyzing: false } : m)
      );
    } catch (error) {
      console.error(error);
      setMessages(prev => 
        prev.map(m => m.id === userMessage.id ? { ...m, isAnalyzing: false } : m)
      );
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to analyze message sentiment.",
      });
    }

    // Send to webhook and get response
    try {
      const webhookResponse = await sendToWebhook({
        id: userMessage.id,
        text: userMessage.text,
        timestamp: userMessage.timestamp,
      });

      if (webhookResponse) {
        const botMessage: Message = {
          id: `${Date.now()}-bot`,
          text: webhookResponse,
          timestamp: new Date(),
          sentiment: null,
          isAnalyzing: false,
          author: 'bot',
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get response from the webhook.",
      });
    }
  }, [toast]);

  const handleDownload = () => {
    if (!isClient) return;

    setIsDownloading(true);
    try {
      const conversationText = messages
        .map(m => `[${m.timestamp.toLocaleString()}] ${m.author === 'user' ? 'User' : 'Bot'}: ${m.text}`)
        .join('\n\n');
      
      const blob = new Blob([conversationText], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'conversation.doc';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Could not prepare the conversation for download.",
      });
    } finally {
      setIsDownloading(false);
    }
  };


  return (
    <Card className="w-full max-w-2xl h-[70vh] flex flex-col shadow-2xl rounded-2xl">
      <ChatHeader 
        onDownload={handleDownload} 
        isDownloading={isDownloading}
      />
      <MessageList messages={messages} />
      <ChatInput onSendMessage={addMessage} />
    </Card>
  );
}
