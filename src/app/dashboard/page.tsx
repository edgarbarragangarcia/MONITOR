import { Sidebar } from '@/components/dashboard/sidebar';
import { ChatArea } from '@/components/dashboard/chat-area';
import { InsightsPanel } from '@/components/dashboard/insights-panel';

export default function DashboardPage() {
    return (
        <>
            <Sidebar />
            <ChatArea className="flex-1" />
            <InsightsPanel />
        </>
    );
}
