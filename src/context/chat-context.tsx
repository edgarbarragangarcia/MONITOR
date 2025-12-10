'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Message, Sentiment } from '@/lib/types';
import { getSentiment, sendToWebhook } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { USERS, USER_CONVERSATIONS } from '@/lib/data';

interface SheetRow {
    pregunta: string;
    respuesta: string;
    telefono: string;
    nombre: string;
}

interface User {
    id: string;
    name: string;
    phone: string;
    lastMessage: string;
    time: string;
    status: 'online' | 'sos';
    type: string;
}

interface ChatContextType {
    messages: Message[];
    addMessage: (text: string) => Promise<void>;
    isAnalyzing: boolean;
    selectedUserId: string | null;
    selectUser: (userId: string) => void;
    selectedUserName: string;
    users: User[];
    isLoading: boolean;
    metrics: {
        totalChats: number;
        activeUsers: number;
        avgResponseTime: number;
        sentimentDistribution: { positive: number; neutral: number; negative: number };
        messagesByHour: { [hour: string]: number };
    };
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [sheetData, setSheetData] = useState<SheetRow[]>([]);
    const [conversations, setConversations] = useState<Record<string, Message[]>>({});
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    // Metrics state
    const [metrics, setMetrics] = useState({
        totalChats: 0,
        activeUsers: 0,
        avgResponseTime: 45,
        sentimentDistribution: { positive: 65, neutral: 25, negative: 10 },
        messagesByHour: {} as { [hour: string]: number }
    });

    // Load data from Google Sheets on mount
    useEffect(() => {
        loadSheetData();

        // Refresh every 10 seconds for real-time updates
        const interval = setInterval(() => {
            loadSheetData();
        }, 10000); // 10 seconds

        return () => clearInterval(interval);
    }, []);

    const loadSheetData = async () => {
        try {
            console.log('🔄 Loading sheet data...');
            const response = await fetch('/api/sheets');
            if (!response.ok) throw new Error('Failed to fetch sheet data');

            const result = await response.json();
            const data: SheetRow[] = result.data || [];

            console.log(`📥 Received ${data.length} rows from Google Sheet`);
            setSheetData(data);

            // Transform data into users and conversations
            const { users: extractedUsers, conversations: extractedConversations } = transformSheetData(data);
            setUsers(extractedUsers);
            setConversations(extractedConversations);

            // Update metrics
            const newMetrics = {
                ...metrics,
                totalChats: data.length,
                activeUsers: extractedUsers.length,
            };

            console.log('📊 Updated metrics:', {
                totalChats: newMetrics.totalChats,
                activeUsers: newMetrics.activeUsers
            });

            setMetrics(newMetrics);

            // Auto-select first user if none selected
            if (!selectedUserId && extractedUsers.length > 0) {
                setSelectedUserId(extractedUsers[0].id);
            }

            setIsLoading(false);
        } catch (error) {
            console.error('❌ Error loading sheet data:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudieron cargar los datos del chat.",
            });
            setIsLoading(false);
        }
    };

    const transformSheetData = (data: SheetRow[]) => {
        console.log('📊 Raw sheet data received:', data.slice(0, 3));

        // First pass: build all conversations grouped by user name
        const convMap: Record<string, Message[]> = {};
        const userPhones: Record<string, string> = {};

        data.forEach((row, index) => {
            const phone = row.telefono.trim();
            const name = row.nombre.trim();

            if (index < 3) {
                console.log(`Row ${index}:`, {
                    pregunta: row.pregunta.substring(0, 30),
                    respuesta: row.respuesta.substring(0, 30),
                    telefono: phone,
                    nombre: name
                });
            }

            // Skip if no name (column D is required)
            if (!name) {
                console.log(`⚠️ Row ${index} skipped - no name`);
                return;
            }

            // Use name as unique identifier
            const userId = name;

            // Store phone number for this user (first occurrence)
            if (!userPhones[userId]) {
                userPhones[userId] = phone || 'Sin teléfono';
            }

            // Initialize conversation array if needed
            if (!convMap[userId]) {
                convMap[userId] = [];
            }

            // Add user message (pregunta)
            if (row.pregunta.trim()) {
                convMap[userId].push({
                    id: `${userId}-${index}-user`,
                    text: row.pregunta,
                    author: 'user',
                    timestamp: new Date(),
                    sentiment: null,
                    isAnalyzing: false,
                });
            }

            // Add bot response (respuesta)
            if (row.respuesta.trim()) {
                convMap[userId].push({
                    id: `${userId}-${index}-bot`,
                    text: row.respuesta,
                    author: 'bot',
                    timestamp: new Date(),
                    sentiment: null,
                    isAnalyzing: false,
                });
            }
        });

        // Second pass: create unique users with their last message
        const users: User[] = [];

        Object.keys(convMap).forEach(userId => {
            const conversation = convMap[userId];
            const lastMessage = conversation.length > 0
                ? conversation[conversation.length - 1].text
                : '';

            users.push({
                id: userId,
                name: userId,
                phone: userPhones[userId] || 'Sin teléfono',
                lastMessage: lastMessage.substring(0, 50) + (lastMessage.length > 50 ? '...' : ''),
                time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
                status: 'online',
                type: 'info',
            });
        });

        console.log(`👥 Total unique users: ${users.length}`);
        console.log('👥 Users:', users.slice(0, 5).map(u => ({ name: u.name, msgCount: convMap[u.id]?.length })));

        return {
            users,
            conversations: convMap,
        };
    };

    // Load messages when user is selected
    useEffect(() => {
        if (selectedUserId && conversations[selectedUserId]) {
            setMessages(conversations[selectedUserId]);
        } else {
            setMessages([]);
        }
    }, [selectedUserId, conversations]);

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

    const selectUser = useCallback((userId: string) => {
        setSelectedUserId(userId);
    }, []);

    const selectedUserName = selectedUserId
        ? users.find(u => u.id === selectedUserId)?.name || 'Usuario'
        : 'Usuario';

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
        <ChatContext.Provider value={{
            messages,
            addMessage,
            isAnalyzing,
            metrics,
            selectedUserId,
            selectUser,
            selectedUserName,
            users,
            isLoading
        }}>
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

