import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScopeStatusBadge } from "./ScopeStatusBadge";
import { ScopeDeltaPill } from "./ScopeDeltaPill";
import {
  calculateStatus,
  calculatePercentOfPlan,
  calculateDelta,
  formatPercent,
  calculateOverallTotals,
  type ChannelTotals,
} from "@/lib/scopeCalculations";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ScopeKPISummaryProps {
  channels: ChannelTotals[];
  lastUpdated: string | null;
}

export function ScopeKPISummary({ channels, lastUpdated }: ScopeKPISummaryProps) {
  const totals = calculateOverallTotals(channels);
  const status = calculateStatus(totals.planned, totals.actual);
  const percent = calculatePercentOfPlan(totals.planned, totals.actual);
  const delta = calculateDelta(totals.planned, totals.actual);

  const formattedLastUpdated = lastUpdated
    ? formatDistanceToNow(new Date(lastUpdated), { addSuffix: true, locale: ptBR })
    : 'Nunca atualizado';

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {/* Planned */}
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Planejado
            </p>
            <p className="font-serif text-4xl font-normal tracking-tight">
              {totals.planned.toLocaleString('pt-BR')}
            </p>
          </div>

          {/* Actual */}
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Realizado
            </p>
            <p className="font-serif text-4xl font-normal tracking-tight">
              {totals.actual.toLocaleString('pt-BR')}
            </p>
          </div>

          {/* Delta */}
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Diferença
            </p>
            <div className="flex items-center h-9">
              <ScopeDeltaPill delta={delta} className="text-base px-3 py-1" />
            </div>
          </div>

          {/* Percent of Plan */}
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              % do Plano
            </p>
            <p className="font-serif text-4xl font-normal tracking-tight">
              {formatPercent(percent)}
            </p>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Status
            </p>
            <div className="flex items-center h-9">
              <ScopeStatusBadge status={status} />
            </div>
          </div>

          {/* Last Updated */}
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Atualização
            </p>
            <div className="flex items-center gap-1.5 h-9 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{formattedLastUpdated}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
