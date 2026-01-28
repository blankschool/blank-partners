import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ClientDistributionChart } from "@/components/dashboard/ClientDistributionChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { ContentPerformanceChart } from "@/components/dashboard/ContentPerformanceChart";
import { Users, FileText, CheckCircle, TrendingUp } from "lucide-react";

const Dashboard = () => {
  return (
    <AppLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="rounded-lg bg-card p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Welcome back, John!</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Here's what's happening with your agency today.
              </p>
            </div>
            <div className="hidden md:block">
              <p className="text-sm text-muted-foreground">Today is</p>
              <p className="text-sm font-medium text-foreground">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Active Clients"
            value={24}
            icon={Users}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Total Contents"
            value={358}
            description="This month"
            icon={FileText}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Contents Approved"
            value={312}
            description="87% approval rate"
            icon={CheckCircle}
          />
          <StatCard
            title="Engagement Rate"
            value="4.8%"
            description="Avg. across all platforms"
            icon={TrendingUp}
            trend={{ value: 0.5, isPositive: true }}
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ClientDistributionChart />
          <ContentPerformanceChart />
        </div>

        {/* Activity Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ActivityFeed />
          </div>
          <div className="space-y-4">
            <div className="rounded-lg bg-card p-5 shadow-sm border border-border">
              <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
              <div className="mt-4 space-y-2">
                <button className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90">
                  Create New Content
                </button>
                <button className="w-full rounded-lg bg-muted px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent">
                  Add New Client
                </button>
                <button className="w-full rounded-lg bg-muted px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent">
                  View Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
