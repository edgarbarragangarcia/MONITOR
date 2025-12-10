'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    BarChart3,
    MessageSquare,
    Settings,
    LogOut,
    Home
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavRailProps {
    className?: string;
}

export function NavRail({ className }: NavRailProps) {
    const pathname = usePathname();

    const navItems = [
        {
            title: "Monitor",
            icon: MessageSquare,
            href: "/dashboard",
            active: pathname === "/dashboard"
        },
        {
            title: "Analytics",
            icon: BarChart3,
            href: "/dashboard/analytics",
            active: pathname === "/dashboard/analytics"
        },
        {
            title: "Settings",
            icon: Settings,
            href: "/dashboard/settings",
            active: pathname === "/dashboard/settings"
        }
    ];

    return (
        <div className={cn("flex flex-col w-16 bg-slate-950 border-r border-slate-800 items-center py-4 z-50", className)}>
            <div className="mb-8">
                <Link href="/">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-900/20 hover:bg-emerald-400 transition-colors cursor-pointer">
                        <Home className="h-6 w-6 text-white" />
                    </div>
                </Link>
            </div>

            <div className="flex-1 flex flex-col gap-4 w-full px-2">
                <TooltipProvider>
                    {navItems.map((item) => (
                        <Tooltip key={item.href} delayDuration={0}>
                            <TooltipTrigger asChild>
                                <Link href={item.href} className="w-full flex justify-center">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={cn(
                                            "h-10 w-10 rounded-xl transition-all duration-300",
                                            item.active
                                                ? "bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_-3px_rgba(52,211,153,0.3)] border border-emerald-500/20"
                                                : "text-slate-400 hover:text-white hover:bg-slate-800"
                                        )}
                                    >
                                        <item.icon className="h-5 w-5" />
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="bg-slate-900 text-white border-slate-800">
                                <p>{item.title}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </TooltipProvider>
            </div>

            <div className="mt-auto px-2">
                <TooltipProvider>
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-xl">
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-slate-900 text-white border-slate-800">
                            <p>Logout</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
}
