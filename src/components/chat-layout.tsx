'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Message } from '@/lib/types';
import { getSentiment, getSummary } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { ChatHeader } from './chat-header';
import { MessageList } from './message-list';

// This mock data simulates receiving messages from a webhook.
const mockMessagesQueue = [
  "Hey team, the new marketing campaign assets are ready for review in the shared drive.",
  "Great! I'll take a look this afternoon. Is there a specific feedback deadline?",
  "End of day tomorrow would be ideal. Thanks!",
  "I'm having some trouble accessing the folder, it says I don't have permission. Can you check?",
  "Oh, sorry about that! I've just updated your permissions. You should be able to access it now. Let me know if it works.",
  "It works perfectly now, thank you so much! The designs look absolutely fantastic, amazing job!",
  "I'm really frustrated with the deployment pipeline. It failed again for the third time today. This is blocking all progress.",
  "I agree, this is a huge problem. I've already pinged the infrastructure team to investigate. It's their top priority.",
  "Okay, what's the plan for our next feature release? We need to finalize the roadmap by Friday.",
];

export function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const { toast } = useToast();
  const mockMessageIndex = useRef(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const addMessage = useCallback(async (text: string) => {
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

  useEffect(() => {
    if(!isClient) return;
    
    // Simulate first message arriving immediately
    if (mockMessageIndex.current === 0) {
      addMessage(mockMessagesQueue[mockMessageIndex.current]);
      mockMessageIndex.current++;
    }

    const interval = setInterval(() => {
      if (mockMessageIndex.current < mockMessagesQueue.length) {
        addMessage(mockMessagesQueue[mockMessageIndex.current]);
        mockMessageIndex.current++;
      } else {
        clearInterval(interval);
      }
    }, 7000); // New message every 7 seconds

    return () => clearInterval(interval);
  }, [isClient, addMessage]);


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
    </Card>
  );
}
