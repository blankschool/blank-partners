import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ClientDistributionChart } from "@/components/dashboard/ClientDistributionChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { ContentPerformanceChart } from "@/components/dashboard/ContentPerformanceChart";
import { Users, FileText, CheckCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  return (
    <AppLayout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="rounded-2xl bg-card p-8 shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-2 w-2 rounded-full bg-accent-orange" />
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Overview</span>
              </div>
              <h2 className="font-serif text-3xl font-normal text-foreground">Welcome back!</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Here's what's happening with your agency today.
              </p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Today is</p>
              <p className="mt-1 font-serif text-lg font-normal text-foreground">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric"
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-accent-orange" />
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Key Metrics</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Active Clients"
              value={24}
              icon={Users}
              trend={{ value: 12, isPositive: true }} />

            <StatCard
              title="Total Contents"
              value={358}
              description="This month"
              icon={FileText}
              trend={{ value: 8, isPositive: true }} />

            <StatCard
              title="Contents Approved"
              value={312}
              description="87% approval rate"
              icon={CheckCircle} />

            <StatCard
              title="Engagement Rate"
              value="4.8%"
              description="Avg. across all platforms"
              icon={TrendingUp}
              trend={{ value: 0.5, isPositive: true }} />

          </div>
        </div>

        {/* Charts Row */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-accent-orange" />
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Analytics</span>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <ClientDistributionChart />
            <ContentPerformanceChart />
          </div>
        </div>

        {/* Activity Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ActivityFeed />
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl bg-card p-6 shadow-sm border border-border">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex h-2 w-2 rounded-full bg-accent-orange" />
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Quick Actions</span>
              </div>
              <div className="space-y-3">
                <Button className="w-full" variant="secondary">
                  Create New Content
                </Button>
                <Button className="w-full" variant="outline">
                  Add New Client
                </Button>
                <Button className="w-full" variant="outline">
                  View Reports
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>);

};

export default Dashboard;