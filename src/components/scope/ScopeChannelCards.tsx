import { Instagram, Video, Linkedin, Youtube, Camera, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScopeStatusBadge } from "./ScopeStatusBadge";
import { ScopeDeltaPill } from "./ScopeDeltaPill";
import {
  calculateStatus,
  calculatePercentOfPlan,
  calculateDelta,
  formatPercent,
  type ChannelTotals,
  type ChannelCode,
} from "@/lib/scopeCalculations";

interface ScopeChannelCardsProps {
  channels: ChannelTotals[];
  onChannelClick?: (channel: ChannelCode) => void;
}

const channelIcons: Record<ChannelCode, React.ReactNode> = {
  instagram: <Instagram className="h-5 w-5 text-pink-500" />,
  tiktok_posts: <Video className="h-5 w-5" />,
  linkedin_posts: <Linkedin className="h-5 w-5 text-blue-600" />,
  youtube_shorts: <Youtube className="h-5 w-5 text-red-500" />,
  youtube_videos: <Youtube className="h-5 w-5 text-red-500" />,
  recordings: <Camera className="h-5 w-5 text-purple-500" />,
};

export function ScopeChannelCards({ channels, onChannelClick }: ScopeChannelCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {channels.map((channel) => {
        const status = calculateStatus(channel.planned, channel.actual);
        const percent = calculatePercentOfPlan(channel.planned, channel.actual);
        const delta = calculateDelta(channel.planned, channel.actual);
        const isOutOfScope = status === 'OUT_OF_SCOPE';
        const hasDeliveryOutsideScope = isOutOfScope && channel.actual > 0;

        return (
          <div
            key={channel.code}
            onClick={() => onChannelClick?.(channel.code)}
            className={cn(
              'rounded-xl border p-4 space-y-3 transition-colors cursor-pointer',
              isOutOfScope
                ? 'bg-muted/20 border-border hover:border-muted-foreground/30'
                : 'bg-card border-border hover:border-primary/50 hover:shadow-sm'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {channelIcons[channel.code]}
                <span className="text-sm font-medium">{channel.name}</span>
              </div>
              {hasDeliveryOutsideScope && (
                <span title="Entregue fora do escopo">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                </span>
              )}
            </div>

            {/* Percent or Out of Scope */}
            <div>
              {isOutOfScope ? (
                <p className="text-lg font-medium text-muted-foreground">
                  Fora do escopo
                </p>
              ) : (
                <p className={cn(
                  'font-serif text-4xl font-normal tracking-tight',
                  status === 'BEHIND' && 'text-red-600 dark:text-red-400',
                  status === 'ON_TRACK' && 'text-green-600 dark:text-green-400',
                  status === 'OVERDELIVERY' && 'text-amber-600 dark:text-amber-400'
                )}>
                  {formatPercent(percent)}
                </p>
              )}
            </div>

            {/* Actual / Planned */}
            <div className="text-sm text-muted-foreground">
              {isOutOfScope && channel.actual === 0 ? (
                <span>—</span>
              ) : (
                <span>
                  {channel.actual}/{channel.planned}
                </span>
              )}
            </div>

            {/* Delta and Status */}
            <div className="flex items-center justify-between gap-2">
              {!isOutOfScope && <ScopeDeltaPill delta={delta} />}
              <ScopeStatusBadge status={status} size="sm" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
