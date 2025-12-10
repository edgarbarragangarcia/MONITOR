'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Sparkles, BrainCircuit, Zap } from 'lucide-react';

interface InsightsPanelProps {
    className?: string;
}

export function InsightsPanel({ className }: InsightsPanelProps) {
    return (
        <div className={cn("flex flex-col h-full w-80 bg-background border-l border-border/50", className)}>
            {/* Header */}
            <div className="p-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-400 fill-amber-400" />
                    <h2 className="font-bold text-gray-800">IA Insights</h2>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 bg-gray-50/50">
                <Card className="h-full border-0 shadow-sm bg-white overflow-hidden flex flex-col">
                    {/* Card Header */}
                    <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-purple-50 to-white">
                        <div className="flex items-center gap-2">
                            <BrainCircuit className="h-5 w-5 text-purple-600" />
                            <span className="text-xs font-bold text-purple-900">Gemini Live Insight</span>
                        </div>
                        <Button size="sm" className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-200">
                            <Zap className="h-3 w-3 mr-1 fill-white" />
                            Analizar Ahora
                        </Button>
                    </div>

                    {/* Card Body - Placeholder */}
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-400">
                        <div className="h-16 w-16 mb-4 rounded-2xl bg-gray-50 flex items-center justify-center">
                            <BrainCircuit className="h-8 w-8 text-gray-300" />
                        </div>
                        <p className="text-sm font-medium">Presiona "Analizar Ahora"</p>
                        <p className="text-xs mt-2 max-w-[180px]">
                            para obtener insights de la conversación en tiempo real.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
