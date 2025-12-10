import { ChatLayout } from "@/components/chat-layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24 relative">
      <div className="absolute top-4 right-4">
        <Link href="/dashboard">
          <Button variant="outline" className="gap-2">
            <LayoutDashboard className="h-4 w-4" />
            View Dashboard
          </Button>
        </Link>
      </div>
      <ChatLayout />
    </main>
  );
}
