import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const healthScoreData = [
  {
    id: 1,
    client: "Acme Corporation",
    score: 92,
    trend: "up",
    engagementRate: 5.2,
    contentDelivery: 100,
    responseTime: 98,
    issues: 0,
    status: "passed",
  },
  {
    id: 2,
    client: "Tech Startup Inc",
    score: 78,
    trend: "up",
    engagementRate: 4.1,
    contentDelivery: 95,
    responseTime: 85,
    issues: 1,
    status: "passed",
  },
  {
    id: 3,
    client: "Brand X Media",
    score: 65,
    trend: "down",
    engagementRate: 2.8,
    contentDelivery: 80,
    responseTime: 70,
    issues: 3,
    status: "deviated",
  },
  {
    id: 4,
    client: "Global Retail Co",
    score: 88,
    trend: "stable",
    engagementRate: 4.8,
    contentDelivery: 98,
    responseTime: 92,
    issues: 0,
    status: "passed",
  },
  {
    id: 5,
    client: "Wellness Studio",
    score: 45,
    trend: "down",
    engagementRate: 1.2,
    contentDelivery: 50,
    responseTime: 60,
    issues: 5,
    status: "failed",
  },
];

function StatusDot({ status }: { status: "passed" | "deviated" | "failed" }) {
  const colors = {
    passed: "bg-success",
    deviated: "bg-warning",
    failed: "bg-destructive",
  };

  const labels = {
    passed: "Passed",
    deviated: "Deviated",
    failed: "Failed",
  };

  return (
    <span className="flex items-center gap-2">
      <span className={cn("h-2.5 w-2.5 rounded-full", colors[status])} />
      <span className="text-sm">{labels[status]}</span>
    </span>
  );
}

const Healthscore = () => {
  const avgScore = Math.round(
    healthScoreData.reduce((acc, c) => acc + c.score, 0) / healthScoreData.length
  );
  const passRate = Math.round(
    (healthScoreData.filter((c) => c.status === "passed").length / healthScoreData.length) * 100
  );
  const totalIssues = healthScoreData.reduce((acc, c) => acc + c.issues, 0);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-success" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <AppLayout title="Healthscore">
      <div className="space-y-8">
        {/* Stats Row - Matching Reference */}
        <div className="grid gap-6 sm:grid-cols-3">
          <Card>
            <CardContent className="p-8">
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Pass Rate
              </p>
              <p className="mt-2 font-serif text-6xl font-normal tracking-tight text-foreground">
                {passRate}%
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Clients meeting performance targets
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Avg Score
              </p>
              <p className="mt-2 font-serif text-6xl font-normal tracking-tight text-foreground">
                {avgScore}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Across all active clients
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Open Issues
              </p>
              <p className="mt-2 font-serif text-6xl font-normal tracking-tight text-accent-orange">
                {totalIssues}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Requiring immediate attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Test Results Table - Matching Reference */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-accent-orange" />
              <CardTitle className="text-sm font-medium uppercase tracking-widest">
                Client Health Results
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Trend</TableHead>
                  <TableHead className="pr-6">Engagement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {healthScoreData.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="pl-6 font-medium">{client.client}</TableCell>
                    <TableCell>
                      <StatusDot status={client.status as "passed" | "deviated" | "failed"} />
                    </TableCell>
                    <TableCell>
                      <span className="font-serif text-lg">{client.score}%</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(client.trend)}
                        <span className="text-sm capitalize text-muted-foreground">
                          {client.trend}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="pr-6">
                      <div className="flex items-center gap-3">
                        <Progress value={client.engagementRate * 10} className="h-2 w-20" />
                        <span className="text-sm text-muted-foreground">
                          {client.engagementRate}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Detailed Client Cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          {healthScoreData.map((client) => (
            <Card key={client.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{client.client}</CardTitle>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      {getTrendIcon(client.trend)}
                      <span>
                        {client.trend === "up"
                          ? "Improving"
                          : client.trend === "down"
                          ? "Declining"
                          : "Stable"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-4xl font-normal text-foreground">{client.score}</p>
                    <StatusDot status={client.status as "passed" | "deviated" | "failed"} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Engagement Rate</span>
                      <span className="font-medium">{client.engagementRate}%</span>
                    </div>
                    <Progress value={client.engagementRate * 10} className="h-2" />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Content Delivery</span>
                      <span className="font-medium">{client.contentDelivery}%</span>
                    </div>
                    <Progress value={client.contentDelivery} className="h-2" />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Response Time</span>
                      <span className="font-medium">{client.responseTime}%</span>
                    </div>
                    <Progress value={client.responseTime} className="h-2" />
                  </div>
                  {client.issues > 0 && (
                    <div className="flex items-center gap-2 rounded-xl bg-destructive/5 p-4">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <span className="text-sm text-destructive">
                        {client.issues} active issue{client.issues > 1 ? "s" : ""} require attention
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Healthscore;
