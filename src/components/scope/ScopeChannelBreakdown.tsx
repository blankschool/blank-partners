import { Instagram, Video, Linkedin, Youtube, Camera } from "lucide-react";
import { ScopeStatusBadge } from "./ScopeStatusBadge";
import { ScopeDeltaPill } from "./ScopeDeltaPill";
import {
  calculateStatus,
  calculatePercentOfPlan,
  calculateDelta,
  formatPercent,
  type ChannelData,
  type ChannelCode,
} from "@/lib/scopeCalculations";

interface ScopeChannelBreakdownProps {
  channels: ChannelData[];
}

const channelIcons: Record<ChannelCode, React.ReactNode> = {
  instagram: <Instagram className="h-4 w-4 text-pink-500" />,
  tiktok_posts: <Video className="h-4 w-4" />,
  linkedin_posts: <Linkedin className="h-4 w-4 text-blue-600" />,
  youtube_shorts: <Youtube className="h-4 w-4 text-red-500" />,
  youtube_videos: <Youtube className="h-4 w-4 text-red-500" />,
  recordings: <Camera className="h-4 w-4 text-purple-500" />,
};

export function ScopeChannelBreakdown({ channels }: ScopeChannelBreakdownProps) {
  return (
    <div className="bg-muted/30 rounded-lg p-4 mt-2">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted-foreground">
            <th className="text-left font-medium pb-3">Canal</th>
            <th className="text-center font-medium pb-3">Planejado</th>
            <th className="text-center font-medium pb-3">Realizado</th>
            <th className="text-center font-medium pb-3">Delta</th>
            <th className="text-center font-medium pb-3">% Plano</th>
            <th className="text-center font-medium pb-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {channels.map((channel) => {
            const status = calculateStatus(channel.planned, channel.actual);
            const percent = calculatePercentOfPlan(channel.planned, channel.actual);
            const delta = calculateDelta(channel.planned, channel.actual);

            return (
              <tr key={channel.code} className="hover:bg-muted/50 transition-colors">
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    {channelIcons[channel.code]}
                    <span>{channel.name}</span>
                  </div>
                </td>
                <td className="text-center py-2 tabular-nums">{channel.planned}</td>
                <td className="text-center py-2 tabular-nums">{channel.actual}</td>
                <td className="text-center py-2">
                  <ScopeDeltaPill delta={delta} />
                </td>
                <td className="text-center py-2 tabular-nums">{formatPercent(percent)}</td>
                <td className="text-center py-2">
                  <ScopeStatusBadge status={status} size="sm" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
