import { useState } from "react";
import { Target } from "lucide-react";
import { startOfMonth } from "date-fns";
import { AppLayout } from "@/components/layout/AppLayout";
import { ScopeMonthSelector } from "@/components/scope/ScopeMonthSelector";
import { ScopeKPISummary } from "@/components/scope/ScopeKPISummary";
import { ScopeChannelCards } from "@/components/scope/ScopeChannelCards";
import { ScopeTopRisks } from "@/components/scope/ScopeTopRisks";
import { ScopeControlFilters, type StatusFilter, type ChannelFilter } from "@/components/scope/ScopeControlFilters";
import { ScopeDecisionTable } from "@/components/scope/ScopeDecisionTable";
import { useScopeControl } from "@/hooks/useScopeControl";
import type { ChannelCode } from "@/lib/scopeCalculations";

export default function ScopeControl() {
  const [selectedMonth, setSelectedMonth] = useState(() => startOfMonth(new Date()));
  const { data, isLoading } = useScopeControl(selectedMonth);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>("all");
  const [showOnlyDeviations, setShowOnlyDeviations] = useState(false);
  const [includeOutOfScope, setIncludeOutOfScope] = useState(false);
  const [highlightedClientId, setHighlightedClientId] = useState<string | null>(null);

  const handleChannelClick = (channel: ChannelCode) => {
    setChannelFilter(channel);
  };

  const handleClientClick = (clientId: string) => {
    setHighlightedClientId(clientId);
    // Clear highlight after 3 seconds
    setTimeout(() => setHighlightedClientId(null), 3000);
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Controle de Escopo</h1>
              <p className="text-sm text-muted-foreground">
                Compare o planejado vs. realizado de cada cliente
              </p>
            </div>
          </div>
          <ScopeMonthSelector
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
          </div>
        ) : data ? (
          <>
            {/* Section A: KPI Summary */}
            <ScopeKPISummary
              channels={data.channels}
              lastUpdated={data.lastUpdated}
            />

            {/* Section B: Channel Cards */}
            <ScopeChannelCards
              channels={data.channels}
              onChannelClick={handleChannelClick}
            />

            {/* Section C: Top Risks */}
            <ScopeTopRisks
              clients={data.clients}
              onClientClick={handleClientClick}
            />

            {/* Filters */}
            <ScopeControlFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              channelFilter={channelFilter}
              onChannelFilterChange={setChannelFilter}
              showOnlyDeviations={showOnlyDeviations}
              onShowOnlyDeviationsChange={setShowOnlyDeviations}
              includeOutOfScope={includeOutOfScope}
              onIncludeOutOfScopeChange={setIncludeOutOfScope}
            />

            {/* Section D: Decision Table */}
            <ScopeDecisionTable
              clients={data.clients}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              channelFilter={channelFilter}
              showOnlyDeviations={showOnlyDeviations}
              includeOutOfScope={includeOutOfScope}
              highlightedClientId={highlightedClientId}
            />

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded bg-green-500" />
                <span>No prazo (90-110%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded bg-red-500" />
                <span>Atrasado (&lt;90%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded bg-amber-500" />
                <span>Excedido (&gt;110%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded bg-gray-300 dark:bg-gray-600" />
                <span>Fora do escopo</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">
              Nenhum dado disponível para este período.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
