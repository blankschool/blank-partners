import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Search, Plus, Mail, MoreHorizontal } from "lucide-react";

const teamData = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@agency.com",
    role: "Content Manager",
    department: "Creative",
    avatar: "SJ",
    status: "online",
    tasksCompleted: 24,
    totalTasks: 28,
    clients: ["Acme Corporation", "Tech Startup Inc"],
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael@agency.com",
    role: "Social Media Specialist",
    department: "Marketing",
    avatar: "MC",
    status: "online",
    tasksCompleted: 18,
    totalTasks: 22,
    clients: ["Brand X Media", "Global Retail Co"],
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily@agency.com",
    role: "Graphic Designer",
    department: "Creative",
    avatar: "ED",
    status: "away",
    tasksCompleted: 15,
    totalTasks: 20,
    clients: ["Wellness Studio"],
  },
  {
    id: 4,
    name: "James Wilson",
    email: "james@agency.com",
    role: "Video Editor",
    department: "Creative",
    avatar: "JW",
    status: "offline",
    tasksCompleted: 12,
    totalTasks: 15,
    clients: ["Tech Startup Inc", "Global Retail Co"],
  },
  {
    id: 5,
    name: "Lisa Anderson",
    email: "lisa@agency.com",
    role: "Account Manager",
    department: "Client Services",
    avatar: "LA",
    status: "online",
    tasksCompleted: 30,
    totalTasks: 32,
    clients: ["Acme Corporation", "Brand X Media", "Wellness Studio"],
  },
];

const Team = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeam = teamData.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-success";
      case "away":
        return "bg-warning";
      case "offline":
        return "bg-muted-foreground";
      default:
        return "bg-muted-foreground";
    }
  };

  return (
    <AppLayout title="Team">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Member
          </Button>
        </div>

        {/* Stats Summary */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Team Members</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">{teamData.length}</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Online Now</p>
              <p className="mt-1 text-2xl font-semibold text-success">
                {teamData.filter((m) => m.status === "online").length}
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Tasks</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {teamData.reduce((acc, m) => acc + m.totalTasks, 0)}
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="mt-1 text-2xl font-semibold text-chart-3">
                {Math.round(
                  (teamData.reduce((acc, m) => acc + m.tasksCompleted, 0) /
                    teamData.reduce((acc, m) => acc + m.totalTasks, 0)) *
                    100
                )}
                %
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Team Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTeam.map((member) => (
            <Card key={member.id} className="shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-chart-3 text-primary-foreground font-medium">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card ${getStatusColor(
                          member.status
                        )}`}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {member.email}
                  </div>
                  <Badge variant="secondary" className="mt-2">
                    {member.department}
                  </Badge>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Task Progress</span>
                    <span className="font-medium text-foreground">
                      {member.tasksCompleted}/{member.totalTasks}
                    </span>
                  </div>
                  <Progress
                    value={(member.tasksCompleted / member.totalTasks) * 100}
                    className="mt-2 h-2"
                  />
                </div>

                <div className="mt-4">
                  <p className="text-xs text-muted-foreground mb-2">Assigned Clients:</p>
                  <div className="flex flex-wrap gap-1">
                    {member.clients.map((client) => (
                      <Badge key={client} variant="outline" className="text-xs">
                        {client}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Team;
