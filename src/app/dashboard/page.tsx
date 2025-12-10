import { UsersSidebar } from '@/components/dashboard/users-sidebar';
import { ChatArea } from '@/components/dashboard/chat-area';
import { InsightsPanel } from '@/components/dashboard/insights-panel';

export default function DashboardPage() {
    return (
        <>
            <UsersSidebar />
            <ChatArea className="flex-1" />
            <InsightsPanel />
        </>
    );
}
