import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AppLayout({ children, title }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <AppHeader title={title} />
          <main className="flex-1 overflow-auto p-6 bg-muted/30 relative">
            {/* Gradient background for glassmorphism */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-orange/5 via-transparent to-chart-3/5 pointer-events-none" />
            <div className="relative z-10">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
