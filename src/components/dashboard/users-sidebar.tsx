'use client';

import {
    Search,
    Activity,
    AlertCircle,
    User,
    CircleDollarSign,
    Info,
    ThumbsUp,
    Hand,
    Power,
    Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useChat } from '@/context/chat-context';

interface UsersSidebarProps {
    className?: string;
}


export function UsersSidebar({ className }: UsersSidebarProps) {
    const { selectedUserId, selectUser, users, isLoading } = useChat();

    return (
        <div className={cn("flex flex-col h-full w-80 bg-background border-r border-border/50", className)}>
            {/* Header */}
            <div className="p-4 border-b border-border/50 bg-slate-900 text-white">
                <div className="flex items-center gap-2">
                    <Activity className="h-6 w-6 text-emerald-400" />
                    <div>
                        <h1 className="font-bold text-sm tracking-wide">CHAT MONITOR</h1>
                        <p className="text-[10px] text-slate-400 tracking-wider">REGINA</p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="p-4">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar..." className="pl-8 bg-muted/50 border-0" />
                </div>
            </div>

            {/* User List */}
            <ScrollArea className="flex-1">
                {isLoading ? (
                    <div className="flex items-center justify-center p-8 text-sm text-muted-foreground">
                        Cargando conversaciones...
                    </div>
                ) : users.length === 0 ? (
                    <div className="flex items-center justify-center p-8 text-sm text-muted-foreground">
                        No hay conversaciones disponibles
                    </div>
                ) : (
                    <div className="flex flex-col gap-1 p-2">
                        {users.map((user) => (
                            <button
                                key={user.id}
                                onClick={() => selectUser(user.id)}
                                className={cn(
                                    "flex items-start gap-3 p-3 rounded-lg transition-all hover:bg-muted/50 text-left",
                                    selectedUserId === user.id && "bg-muted/30 border-l-2 border-emerald-500"
                                )}
                            >
                                <div className="relative">
                                    <Avatar className={cn("h-10 w-10 border-2",
                                        user.status === 'sos' ? "border-red-500" : "border-emerald-500"
                                    )}>
                                        <AvatarFallback className={cn("text-white",
                                            user.status === 'sos' ? "bg-red-500" : "bg-emerald-600"
                                        )}>
                                            {getIcon(user.type)}
                                        </AvatarFallback>
                                    </Avatar>
                                    {user.status === 'sos' && (
                                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-semibold text-sm truncate max-w-[120px]">{user.name}</span>
                                        <span className="text-[10px] text-muted-foreground">{user.time}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-muted-foreground truncate max-w-[140px]">{user.lastMessage}</p>
                                        {user.status === 'sos' && (
                                            <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1 py-0.5 rounded">SOS</span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </ScrollArea>

            {/* Footer */}
            <div className="p-4 border-t border-border/50">
                <Button variant="outline" className="w-full justify-center gap-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 uppercase font-bold tracking-wide h-12">
                    <Power className="h-4 w-4" />
                    Monitoreando
                </Button>
            </div>
        </div>
    );
}

function getIcon(type: string) {
    switch (type) {
        case 'alert': return <AlertCircle className="h-5 w-5" />;
        case 'money': return <CircleDollarSign className="h-5 w-5" />;
        case 'info': return <Info className="h-5 w-5" />;
        case 'like': return <ThumbsUp className="h-5 w-5" />;
        case 'hand': return <Hand className="h-5 w-5" />;
        default: return <User className="h-5 w-5" />;
    }
}

