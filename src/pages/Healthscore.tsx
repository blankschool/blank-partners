import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Clock } from "lucide-react";

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
    status: "healthy",
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
    status: "good",
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
    status: "attention",
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
    status: "healthy",
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
    status: "critical",
  },
];

const Healthscore = () => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-success/10 text-success border-success/20">Healthy</Badge>;
      case "good":
        return <Badge className="bg-chart-1/20 text-chart-3 border-chart-1/30">Good</Badge>;
      case "attention":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Needs Attention</Badge>;
      case "critical":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Critical</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

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

  const avgScore = Math.round(healthScoreData.reduce((acc, c) => acc + c.score, 0) / healthScoreData.length);

  return (
    <AppLayout title="Healthscore">
      <div className="space-y-6">
        {/* Overall Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card className="shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className={`mt-1 text-3xl font-bold ${getScoreColor(avgScore)}`}>{avgScore}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Healthy Clients</p>
                  <p className="mt-1 text-3xl font-bold text-success">
                    {healthScoreData.filter((c) => c.status === "healthy").length}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Need Attention</p>
                  <p className="mt-1 text-3xl font-bold text-warning">
                    {healthScoreData.filter((c) => c.status === "attention").length}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical</p>
                  <p className="mt-1 text-3xl font-bold text-destructive">
                    {healthScoreData.filter((c) => c.status === "critical").length}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Client Health Cards */}
        <div className="grid gap-4 lg:grid-cols-2">
          {healthScoreData.map((client) => (
            <Card key={client.id} className="shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">{client.client}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      {getTrendIcon(client.trend)}
                      <span>
                        {client.trend === "up"
                          ? "Improving"
                          : client.trend === "down"
                          ? "Declining"
                          : "Stable"}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-bold ${getScoreColor(client.score)}`}>{client.score}</p>
                    {getStatusBadge(client.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Engagement Rate</span>
                      <span className="font-medium">{client.engagementRate}%</span>
                    </div>
                    <Progress value={client.engagementRate * 10} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Content Delivery</span>
                      <span className="font-medium">{client.contentDelivery}%</span>
                    </div>
                    <Progress value={client.contentDelivery} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Response Time</span>
                      <span className="font-medium">{client.responseTime}%</span>
                    </div>
                    <Progress value={client.responseTime} className="h-2" />
                  </div>
                  {client.issues > 0 && (
                    <div className="flex items-center gap-2 rounded-lg bg-destructive/5 p-3">
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
