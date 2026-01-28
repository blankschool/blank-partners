import { FileText, CheckCircle, Clock, AlertCircle, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const activities = [
  {
    id: 1,
    type: "content_approved",
    title: "Content approved",
    description: "Instagram post for Acme Corp was approved",
    time: "2 hours ago",
    icon: CheckCircle,
    iconColor: "text-success",
  },
  {
    id: 2,
    type: "content_pending",
    title: "Pending review",
    description: "3 posts waiting for client approval",
    time: "4 hours ago",
    icon: Clock,
    iconColor: "text-warning",
  },
  {
    id: 3,
    type: "content_created",
    title: "New content created",
    description: "TikTok video for Tech Startup drafted",
    time: "5 hours ago",
    icon: FileText,
    iconColor: "text-chart-2",
  },
  {
    id: 4,
    type: "deadline_approaching",
    title: "Deadline approaching",
    description: "Facebook campaign for Brand X due tomorrow",
    time: "6 hours ago",
    icon: AlertCircle,
    iconColor: "text-destructive",
  },
];

export function ActivityFeed() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
          <CardDescription>Last 24 hours updates</CardDescription>
        </div>
        <button className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
          View all
          <ChevronRight className="h-3 w-3" />
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`mt-0.5 ${activity.iconColor}`}>
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
