import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, MoreHorizontal, Mail, Phone } from "lucide-react";

const clientsData = [
  {
    id: 1,
    name: "Acme Corporation",
    email: "contact@acme.com",
    phone: "+1 555-0123",
    status: "active",
    platforms: ["Instagram", "Facebook"],
    postsThisMonth: 24,
    avatar: "AC",
  },
  {
    id: 2,
    name: "Tech Startup Inc",
    email: "hello@techstartup.io",
    phone: "+1 555-0456",
    status: "active",
    platforms: ["TikTok", "Instagram"],
    postsThisMonth: 18,
    avatar: "TS",
  },
  {
    id: 3,
    name: "Brand X Media",
    email: "info@brandx.com",
    phone: "+1 555-0789",
    status: "pending",
    platforms: ["LinkedIn", "Facebook"],
    postsThisMonth: 12,
    avatar: "BX",
  },
  {
    id: 4,
    name: "Global Retail Co",
    email: "marketing@globalretail.com",
    phone: "+1 555-0321",
    status: "active",
    platforms: ["Instagram", "TikTok", "Facebook"],
    postsThisMonth: 32,
    avatar: "GR",
  },
  {
    id: 5,
    name: "Wellness Studio",
    email: "hello@wellness.com",
    phone: "+1 555-0654",
    status: "inactive",
    platforms: ["Instagram"],
    postsThisMonth: 0,
    avatar: "WS",
  },
];

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = clientsData.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success border-success/20";
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "inactive":
        return "bg-muted text-muted-foreground border-muted";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  return (
    <AppLayout title="Clients">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
        </div>

        {/* Stats Summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Total Clients</p>
              <p className="mt-2 font-serif text-5xl font-normal tracking-tight text-foreground">{clientsData.length}</p>
              <p className="mt-2 text-sm text-muted-foreground">Registered in system</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Active</p>
              <p className="mt-2 font-serif text-5xl font-normal tracking-tight text-success">
                {clientsData.filter((c) => c.status === "active").length}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Currently active clients</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Pending Onboarding</p>
              <p className="mt-2 font-serif text-5xl font-normal tracking-tight text-warning">
                {clientsData.filter((c) => c.status === "pending").length}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Awaiting setup</p>
            </CardContent>
          </Card>
        </div>

        {/* Clients List */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">All Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-foreground text-background font-medium">
                      {client.avatar}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground truncate">{client.name}</h3>
                      <Badge variant="outline" className={getStatusColor(client.status)}>
                        {client.status}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {client.email}
                      </span>
                      <span className="hidden sm:flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {client.phone}
                      </span>
                    </div>
                  </div>

                  <div className="hidden md:flex flex-wrap gap-1">
                    {client.platforms.map((platform) => (
                      <Badge key={platform} variant="secondary" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>

                  <div className="text-right hidden sm:block">
                    <p className="text-lg font-semibold text-foreground">{client.postsThisMonth}</p>
                    <p className="text-xs text-muted-foreground">posts/month</p>
                  </div>

                  <Button variant="ghost" size="icon" className="shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Clients;
