'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Message, Sentiment } from '@/lib/types';
import { getSentiment, sendToWebhook } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { USERS } from '@/lib/data';

interface ChatContextType {
    messages: Message[];
    addMessage: (text: string) => Promise<void>;
    isAnalyzing: boolean;
    metrics: {
        totalChats: number;
        activeUsers: number;
        avgResponseTime: number; // in seconds
        sentimentDistribution: { positive: number; neutral: number; negative: number };
        messagesByHour: { [hour: string]: number };
    };
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const { toast } = useToast();

    // Metrics state
    const [metrics, setMetrics] = useState({
        totalChats: 272, // Based on the "272 mensajes procesados" text in the UI
        activeUsers: USERS.length, // Real count from data
        avgResponseTime: 45,
        sentimentDistribution: { positive: 65, neutral: 25, negative: 10 },
        messagesByHour: {
            '09:00': 120,
            '10:00': 45,
        } as { [hour: string]: number }
    });

    // Calculate metrics whenever messages change
    useEffect(() => {
        // Determine sentiment counts
        let pos = 0, neu = 0, neg = 0;

        // In a real app we would iterate through all messages database. 
        // Here we will just use the current session messages + some base stats

        messages.forEach(m => {
            if (m.sentiment) {
                if (m.sentiment.sentiment === 'positive') pos++;
                else if (m.sentiment.sentiment === 'negative') neg++;
                else neu++;
            }
        });

        const totalSent = pos + neu + neg;

        // Update hourly
        const newHourly = { ...metrics.messagesByHour };
        messages.forEach(m => {
            const hour = m.timestamp.getHours().toString().padStart(2, '0') + ':00';
            newHourly[hour] = (newHourly[hour] || 0) + 1;
        });

        setMetrics(prev => ({
            ...prev,
            totalChats: 272 + messages.length, // Base + new
            activeUsers: USERS.length, // Keep consistent
            messagesByHour: newHourly
            // limiting re-calc of sentiment for now to avoid complexity in this demo
        }));

    }, [messages]);

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
        setIsAnalyzing(true);

        // Get sentiment
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
        }

        // Webhook
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
                description: "Failed to get response from bot.",
            });
        } finally {
            setIsAnalyzing(false);
        }
    }, [toast]);

    return (
        <ChatContext.Provider value={{ messages, addMessage, isAnalyzing, metrics }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}
