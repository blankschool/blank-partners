import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Calendar, Grid3X3, List, Image, Video, FileText } from "lucide-react";

const contentsData = [
  {
    id: 1,
    title: "Summer Campaign Post #1",
    client: "Acme Corporation",
    platform: "Instagram",
    type: "image",
    status: "approved",
    scheduledDate: "2026-01-30",
  },
  {
    id: 2,
    title: "Product Launch Video",
    client: "Tech Startup Inc",
    platform: "TikTok",
    type: "video",
    status: "pending",
    scheduledDate: "2026-01-31",
  },
  {
    id: 3,
    title: "Weekly Industry Update",
    client: "Brand X Media",
    platform: "LinkedIn",
    type: "text",
    status: "draft",
    scheduledDate: "2026-02-01",
  },
  {
    id: 4,
    title: "Behind the Scenes Reel",
    client: "Global Retail Co",
    platform: "Instagram",
    type: "video",
    status: "approved",
    scheduledDate: "2026-02-02",
  },
  {
    id: 5,
    title: "Customer Testimonial",
    client: "Wellness Studio",
    platform: "Facebook",
    type: "image",
    status: "rejected",
    scheduledDate: "2026-02-03",
  },
  {
    id: 6,
    title: "Monthly Newsletter Promo",
    client: "Acme Corporation",
    platform: "Facebook",
    type: "image",
    status: "pending",
    scheduledDate: "2026-02-04",
  },
];

const Contents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredContents = contentsData.filter(
    (content) =>
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-success/10 text-success border-success/20";
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "draft":
        return "bg-muted text-muted-foreground border-muted";
      case "rejected":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return Image;
      case "video":
        return Video;
      case "text":
        return FileText;
      default:
        return FileText;
    }
  };

  return (
    <AppLayout title="Contents">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search contents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-border p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Calendar
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Content
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All ({contentsData.length})</TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({contentsData.filter((c) => c.status === "pending").length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({contentsData.filter((c) => c.status === "approved").length})
            </TabsTrigger>
            <TabsTrigger value="draft">
              Drafts ({contentsData.filter((c) => c.status === "draft").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {viewMode === "grid" ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredContents.map((content) => {
                  const TypeIcon = getTypeIcon(content.type);
                  return (
                    <Card key={content.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            <TypeIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <Badge variant="outline" className={getStatusColor(content.status)}>
                            {content.status}
                          </Badge>
                        </div>
                        <h3 className="mt-3 font-medium text-foreground line-clamp-2">{content.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{content.client}</p>
                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                          <Badge variant="secondary">{content.platform}</Badge>
                          <span>{new Date(content.scheduledDate).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="shadow-sm">
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {filteredContents.map((content) => {
                      const TypeIcon = getTypeIcon(content.type);
                      return (
                        <div
                          key={content.id}
                          className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            <TypeIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground truncate">{content.title}</h3>
                            <p className="text-sm text-muted-foreground">{content.client}</p>
                          </div>
                          <Badge variant="secondary">{content.platform}</Badge>
                          <Badge variant="outline" className={getStatusColor(content.status)}>
                            {content.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(content.scheduledDate).toLocaleDateString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <Card className="shadow-sm">
              <CardContent className="p-6 text-center text-muted-foreground">
                Pending contents will appear here
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved" className="mt-6">
            <Card className="shadow-sm">
              <CardContent className="p-6 text-center text-muted-foreground">
                Approved contents will appear here
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="draft" className="mt-6">
            <Card className="shadow-sm">
              <CardContent className="p-6 text-center text-muted-foreground">
                Draft contents will appear here
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Contents;
