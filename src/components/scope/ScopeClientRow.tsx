import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScopeStatusBadge } from "./ScopeStatusBadge";
import { ScopeDeltaPill } from "./ScopeDeltaPill";
import { ScopeChannelBreakdown } from "./ScopeChannelBreakdown";
import {
  calculateStatus,
  calculatePercentOfPlan,
  calculateDelta,
  formatPercent,
  type ClientScope,
} from "@/lib/scopeCalculations";

interface ScopeClientRowProps {
  client: ClientScope;
  isHighlighted?: boolean;
}

export function ScopeClientRow({ client, isHighlighted }: ScopeClientRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const status = calculateStatus(client.totals.planned, client.totals.actual);
  const percent = calculatePercentOfPlan(client.totals.planned, client.totals.actual);
  const delta = calculateDelta(client.totals.planned, client.totals.actual);

  return (
    <div
      className={cn(
        'border-b border-border',
        isHighlighted && 'ring-2 ring-primary ring-inset'
      )}
    >
      {/* Main row */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors',
          isExpanded && 'bg-muted/20'
        )}
      >
        {/* Expand icon */}
        <ChevronRight
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform shrink-0',
            isExpanded && 'rotate-90'
          )}
        />

        {/* Client name - sticky on mobile */}
        <div className="flex-1 min-w-0">
          <span className="font-medium truncate block">{client.client_name}</span>
        </div>

        {/* Stats grid */}
        <div className="flex items-center gap-6 text-sm">
          {/* Planned */}
          <div className="text-center min-w-[60px]">
            <span className="text-muted-foreground text-xs block">Plan</span>
            <span className="font-semibold tabular-nums">{client.totals.planned}</span>
          </div>

          {/* Actual */}
          <div className="text-center min-w-[60px]">
            <span className="text-muted-foreground text-xs block">Real</span>
            <span className="font-semibold tabular-nums">{client.totals.actual}</span>
          </div>

          {/* Delta */}
          <div className="text-center min-w-[60px]">
            <span className="text-muted-foreground text-xs block">Delta</span>
            <ScopeDeltaPill delta={delta} />
          </div>

          {/* Percent */}
          <div className="text-center min-w-[70px]">
            <span className="text-muted-foreground text-xs block">% Plano</span>
            <span className="font-semibold tabular-nums">{formatPercent(percent)}</span>
          </div>

          {/* Status */}
          <div className="min-w-[100px]">
            <ScopeStatusBadge status={status} size="sm" />
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <ScopeChannelBreakdown channels={client.by_channel} />
        </div>
      )}
    </div>
  );
}
