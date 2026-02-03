import { useMemo, useState } from "react";
import { TrendingUp, Instagram, Video, Linkedin, Youtube, Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChannelPendingDialog } from "./ChannelPendingDialog";
import type { ScopeControlData } from "@/hooks/useScopeControl";

type ScopeField = "instagram" | "tiktok_posts" | "linkedin_posts" | "youtube_shorts" | "youtube_videos" | "recordings";

interface ScopeStatsPanelProps {
  data: ScopeControlData[];
}

const channelConfig: { key: ScopeField; label: string; icon: React.ReactNode }[] = [
  { key: "instagram", label: "Instagram", icon: <Instagram className="h-4 w-4 text-pink-500" /> },
  { key: "tiktok_posts", label: "TikTok", icon: <Video className="h-4 w-4" /> },
  { key: "linkedin_posts", label: "LinkedIn", icon: <Linkedin className="h-4 w-4 text-blue-600" /> },
  { key: "youtube_shorts", label: "YT Shorts", icon: <Youtube className="h-4 w-4 text-red-500" /> },
  { key: "youtube_videos", label: "YT Videos", icon: <Youtube className="h-4 w-4 text-red-500" /> },
  { key: "recordings", label: "Gravações", icon: <Camera className="h-4 w-4 text-purple-500" /> },
];

const getStatusColor = (percentage: number) => {
  if (percentage >= 100) return "text-green-600 dark:text-green-400";
  if (percentage >= 50) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
};

const getProgressColor = (percentage: number) => {
  if (percentage >= 100) return "bg-green-500";
  if (percentage >= 50) return "bg-yellow-500";
  return "bg-red-500";
};

export function ScopeStatsPanel({ data }: ScopeStatsPanelProps) {
  const [selectedChannel, setSelectedChannel] = useState<ScopeField | null>(null);

  const stats = useMemo(() => {
    const channels: ScopeField[] = ["instagram", "tiktok_posts", "linkedin_posts", "youtube_shorts", "youtube_videos", "recordings"];
    
    // Calculate per-channel stats
    const channelStats = channels.map((channel) => {
      const totalPlanned = data.reduce((sum, item) => sum + (item.client.scope?.[channel] || 0), 0);
      const totalActual = data.reduce((sum, item) => sum + (item.actual?.[channel] || 0), 0);
      const percentage = totalPlanned > 0 ? Math.round((totalActual / totalPlanned) * 100) : 0;
      return { channel, planned: totalPlanned, actual: totalActual, percentage };
    });

    // Calculate overall stats
    let totalPlanned = 0;
    let totalActual = 0;
    channelStats.forEach(({ planned, actual }) => {
      totalPlanned += planned;
      totalActual += actual;
    });
    const overallPercentage = totalPlanned > 0 ? Math.round((totalActual / totalPlanned) * 100) : 0;

    return {
      overall: { planned: totalPlanned, actual: totalActual, percentage: overallPercentage },
      channels: channelStats,
    };
  }, [data]);

  const selectedConfig = channelConfig.find((c) => c.key === selectedChannel);

  return (
    <>
      <Card className="border-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Relatório de Escopo
            </h2>
          </div>

          {/* Overall Stats */}
          <div className="mb-8">
            <div className="flex items-baseline gap-3 mb-2">
              <span className={cn("font-serif text-4xl", getStatusColor(stats.overall.percentage))}>
                {stats.overall.percentage}%
              </span>
              <span className="text-muted-foreground text-sm">
                {stats.overall.actual} de {stats.overall.planned} entregas
              </span>
            </div>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={cn("h-full transition-all duration-500", getProgressColor(stats.overall.percentage))}
                style={{ width: `${Math.min(stats.overall.percentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Per-Channel Stats */}
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">
              Por Canal
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {stats.channels.map((channelStat) => {
                const config = channelConfig.find((c) => c.key === channelStat.channel);
                if (!config) return null;

                return (
                  <div
                    key={channelStat.channel}
                    onClick={() => setSelectedChannel(channelStat.channel)}
                    className="rounded-xl border border-border bg-muted/30 p-4 space-y-2 cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {config.icon}
                      <span className="text-xs font-medium text-muted-foreground truncate">
                        {config.label}
                      </span>
                    </div>
                    <div className={cn("font-serif text-2xl", getStatusColor(channelStat.percentage))}>
                      {channelStat.percentage}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {channelStat.actual}/{channelStat.planned}
                    </div>
                    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className={cn("h-full transition-all duration-500", getProgressColor(channelStat.percentage))}
                        style={{ width: `${Math.min(channelStat.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <ChannelPendingDialog
        open={selectedChannel !== null}
        onOpenChange={(open) => !open && setSelectedChannel(null)}
        channel={selectedChannel}
        channelLabel={selectedConfig?.label || ""}
        channelIcon={selectedConfig?.icon || null}
        data={data}
      />
    </>
  );
}
