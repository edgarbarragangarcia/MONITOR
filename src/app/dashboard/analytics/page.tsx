'use client';

import { Card } from '@/components/ui/card';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    Users,
    MessageCircle,
    TrendingUp,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal,
    HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useChat } from '@/context/chat-context';
import { useEffect, useState } from 'react';
import {
    DASHBOARD_METRICS,
    HOURLY_TRAFFIC,
    TOP_TOPICS,
    SENTIMENT_DATA,
    FREQUENT_QUESTIONS
} from '@/lib/data';

export default function AnalyticsPage() {
    const { metrics } = useChat();

    // Merge static "Sheet" data with live ChatContext updates
    // In a real app, 'metrics' from context would be initialized with this fetched data
    const totalChats = DASHBOARD_METRICS.totalChats + (metrics.totalChats - 272); // 272 was our base in context
    const activeUsers = metrics.activeUsers;

    // For charts, we use the static data as the "history" and could append new points
    // For this demo, we'll stick to the rich static data to show the "Sheet" view

    const kpiData = [
        {
            title: "Total Chats",
            value: totalChats.toLocaleString(),
            change: "+12.5%",
            trend: "up",
            icon: MessageCircle,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "Active Users",
            value: activeUsers.toString(),
            change: "+8.2%",
            trend: "up",
            icon: Users,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        },
        {
            title: "Avg. Response",
            value: `${DASHBOARD_METRICS.avgResponseTime}s`,
            change: "-1.2%",
            trend: "down",
            icon: Clock,
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        },
        {
            title: "Resolution Rate",
            value: `${DASHBOARD_METRICS.resolutionRate}%`,
            change: "+3.1%",
            trend: "up",
            icon: TrendingUp,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        }
    ];

    return (
        <div className="flex-1 h-full overflow-y-auto bg-slate-50/50 p-8 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Analytics</h1>
                    <p className="text-slate-500 text-sm mt-1">Data provenance: Conversation Sheet Extract (Live)</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="bg-white">Last 24 Hours</Button>
                    <Button className="bg-slate-900 text-white hover:bg-slate-800">Export Report</Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiData.map((kpi, idx) => (
                    <Card key={idx} className="p-6 border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className={cn("p-2 rounded-lg", kpi.bg)}>
                                <kpi.icon className={cn("h-6 w-6", kpi.color)} />
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2 text-slate-400">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-slate-500">{kpi.title}</h3>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-2xl font-bold text-slate-900">{kpi.value}</span>
                                <span className={cn("text-xs font-medium flex items-center",
                                    (kpi.trend === 'up' && kpi.title !== 'Avg. Response') || (kpi.trend === 'down' && kpi.title === 'Avg. Response')
                                        ? "text-emerald-600"
                                        : "text-red-500"
                                )}>
                                    {kpi.trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                                    {kpi.change}
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Traffic Chart */}
                <Card className="col-span-1 lg:col-span-2 p-6 border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-slate-900">Message Volume</h3>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={HOURLY_TRAFFIC}>
                                <defs>
                                    <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={-10} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="messages" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorMessages)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Sentiment Doughnut */}
                <Card className="col-span-1 p-6 border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-slate-900">Sentiment Analysis</h3>
                    </div>
                    <div className="h-[250px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={SENTIMENT_DATA}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {SENTIMENT_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-slate-900">
                                {SENTIMENT_DATA[0].value}%
                            </span>
                            <span className="text-xs text-slate-500 font-medium">Positive</span>
                        </div>
                    </div>
                    {/* Legend */}
                    <div className="flex justify-center gap-4 mt-4">
                        {SENTIMENT_DATA.map((item) => (
                            <div key={item.name} className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-xs text-slate-500">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
                {/* Trending Topics */}
                <Card className="p-6 border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-slate-900">Trending Topics</h3>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={TOP_TOPICS} layout="vertical" barSize={24} barCategoryGap={10}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="topic" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} width={140} />
                                <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                                    {TOP_TOPICS.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#94a3b8'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Frequent Questions */}
                <Card className="p-6 border-slate-100 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-slate-900">Frequent Questions</h3>
                        <HelpCircle className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="space-y-4 flex-1">
                        {FREQUENT_QUESTIONS.map((faq, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">
                                        {i + 1}
                                    </div>
                                    <span className="text-sm text-slate-700 font-medium">{faq.question}</span>
                                </div>
                                <span className="text-xs font-bold text-slate-900 bg-white px-2 py-1 rounded border shadow-sm">
                                    {faq.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
