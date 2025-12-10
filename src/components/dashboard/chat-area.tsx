'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Bot, User, Send, Paperclip, Smile } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useChat } from '@/context/chat-context';

interface ChatAreaProps {
    className?: string;
}

export function ChatArea({ className }: ChatAreaProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { messages, addMessage, isAnalyzing } = useChat();
    const [inputText, setInputText] = useState('');

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (inputText.trim()) {
            addMessage(inputText);
            setInputText('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className={cn("flex flex-col h-full bg-[#f0f2f5] relative", className)}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
            </div>

            {/* Header */}
            <div className="bg-white/90 backdrop-blur-sm border-b p-4 flex items-center justify-between z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-emerald-600 text-white">
                        <AvatarFallback>E</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="font-bold text-gray-800">Edgar Barragán G</h2>
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs text-muted-foreground font-medium">Monitoreando en vivo</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 z-10" ref={scrollRef}>
                <div className="space-y-6">
                    {messages.length === 0 && (
                        <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                            No hay mensajes aún. ¡Comienza la conversación!
                        </div>
                    )}
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex w-full max-w-3xl mx-auto gap-4",
                                msg.author === 'user' ? "flex-row-reverse" : "flex-row"
                            )}
                        >
                            <Avatar className={cn(
                                "h-8 w-8 mt-1",
                                msg.author === 'bot' ? "bg-blue-500" : "bg-emerald-600"
                            )}>
                                <AvatarFallback className="text-white">
                                    {msg.author === 'bot' ? <Bot size={16} /> : <User size={16} />}
                                </AvatarFallback>
                            </Avatar>

                            <div className={cn(
                                "flex flex-col max-w-[70%]",
                                msg.author === 'user' ? "items-end" : "items-start"
                            )}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={cn("text-xs font-bold", msg.author === 'bot' ? "text-blue-600" : "text-emerald-600")}>
                                        {msg.author === 'bot' ? 'Agente IA' : 'Edgar Barragán G'}
                                    </span>
                                </div>
                                <div className={cn(
                                    "p-4 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap",
                                    msg.author === 'user'
                                        ? "bg-emerald-50 text-emerald-900 rounded-tr-none"
                                        : "bg-white text-gray-700 rounded-tl-none border border-gray-100"
                                )}>
                                    {msg.text}
                                </div>
                                <span className="text-[10px] text-gray-400 mt-1 px-1">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {msg.isAnalyzing && msg.author === 'user' && (
                                    <span className="text-[10px] text-amber-500 mt-0.5 animate-pulse">Analizando...</span>
                                )}
                            </div>
                        </div>
                    ))}
                    {isAnalyzing && (
                        <div className="flex w-full max-w-3xl mx-auto gap-4">
                            <Avatar className="h-8 w-8 mt-1 bg-blue-500"><AvatarFallback><Bot size={16} /></AvatarFallback></Avatar>
                            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex items-center gap-2">
                                <span className="flex gap-1">
                                    <span className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Input */}
            <div className="bg-white border-t p-4 z-10">
                <div className="relative max-w-4xl mx-auto flex items-end gap-2">
                    <Button size="icon" variant="ghost" className="text-gray-400 hover:text-gray-600">
                        <Smile size={20} />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-gray-400 hover:text-gray-600">
                        <Paperclip size={20} />
                    </Button>
                    <div className="flex-1 bg-gray-100 rounded-xl flex items-center px-4 py-2">
                        <input
                            type="text"
                            placeholder="Escribe un mensaje..."
                            className="bg-transparent border-none outline-none w-full text-sm text-gray-700 placeholder:text-gray-400 h-9"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isAnalyzing}
                        />
                    </div>
                    <Button
                        onClick={handleSend}
                        disabled={!inputText.trim() || isAnalyzing}
                        className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                    >
                        <Send size={18} />
                    </Button>
                </div>
                <div className="flex justify-between items-center mt-2 px-4 text-[10px] text-gray-400 font-mono">
                    <span>{messages.length} mensajes procesados de esta sesión</span>
                    <span className="flex items-center gap-1">
                        SYNC: <span className="text-emerald-500 font-bold">ON</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
