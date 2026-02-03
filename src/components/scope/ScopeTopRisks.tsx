import { AlertCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getTopBehind,
  getTopOverdelivery,
  calculatePercentOfPlan,
  calculateDelta,
  formatPercent,
  formatDelta,
  type ClientScope,
} from "@/lib/scopeCalculations";

interface ScopeTopRisksProps {
  clients: ClientScope[];
  onClientClick?: (clientId: string) => void;
}

export function ScopeTopRisks({ clients, onClientClick }: ScopeTopRisksProps) {
  const topBehind = getTopBehind(clients, 5);
  const topOverdelivery = getTopOverdelivery(clients, 5);

  const hasAnyRisks = topBehind.length > 0 || topOverdelivery.length > 0;

  if (!hasAnyRisks) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Top Behind */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span>Top {topBehind.length} Atrasados</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topBehind.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum cliente atrasado.
            </p>
          ) : (
            <ul className="space-y-2">
              {topBehind.map((client, index) => {
                const percent = calculatePercentOfPlan(
                  client.totals.planned,
                  client.totals.actual
                );

                return (
                  <li
                    key={client.client_id}
                    onClick={() => onClientClick?.(client.client_id)}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        {index + 1}.
                      </span>
                      <span className="text-sm font-medium truncate">
                        {client.client_name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                      {formatPercent(percent)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Top Overdelivery */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <TrendingUp className="h-4 w-4 text-amber-500" />
            <span>Top {topOverdelivery.length} Excedidos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topOverdelivery.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum cliente com excesso.
            </p>
          ) : (
            <ul className="space-y-2">
              {topOverdelivery.map((client, index) => {
                const delta = calculateDelta(
                  client.totals.planned,
                  client.totals.actual
                );

                return (
                  <li
                    key={client.client_id}
                    onClick={() => onClientClick?.(client.client_id)}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        {index + 1}.
                      </span>
                      <span className="text-sm font-medium truncate">
                        {client.client_name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                      {formatDelta(delta)} entregas
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
