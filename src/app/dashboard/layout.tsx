import type { Metadata } from 'next';
import { NavRail } from '@/components/dashboard/nav-rail';
import { ChatProvider } from '@/context/chat-context';

export const metadata: Metadata = {
    title: 'Dashboard - Chat Monitor',
    description: 'Real-time chat monitoring dashboard',
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ChatProvider>
            <div className="flex h-screen w-full overflow-hidden bg-background">
                <NavRail />
                <div className="flex-1 flex overflow-hidden">
                    {children}
                </div>
            </div>
        </ChatProvider>
    );
}
