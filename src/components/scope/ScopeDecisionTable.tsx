import { useMemo } from "react";
import { ScopeClientRow } from "./ScopeClientRow";
import {
  sortByRisk,
  calculateStatus,
  type ClientScope,
  type ScopeStatus,
  type ChannelCode,
} from "@/lib/scopeCalculations";
import type { StatusFilter, ChannelFilter } from "./ScopeControlFilters";

interface ScopeDecisionTableProps {
  clients: ClientScope[];
  searchQuery: string;
  statusFilter: StatusFilter;
  channelFilter: ChannelFilter;
  showOnlyDeviations: boolean;
  includeOutOfScope: boolean;
  highlightedClientId?: string | null;
  onEditClient?: (client: ClientScope) => void;
}

export function ScopeDecisionTable({
  clients,
  searchQuery,
  statusFilter,
  channelFilter,
  showOnlyDeviations,
  includeOutOfScope,
  highlightedClientId,
  onEditClient,
}: ScopeDecisionTableProps) {
  const filteredAndSortedClients = useMemo(() => {
    let result = [...clients];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((c) =>
        c.client_name.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter((c) => {
        const status = calculateStatus(c.totals.planned, c.totals.actual);
        return status === statusFilter;
      });
    }

    // Apply channel filter - filter based on channel-specific data
    if (channelFilter !== 'all') {
      result = result.filter((c) => {
        const channelData = c.by_channel.find((ch) => ch.code === channelFilter);
        if (!channelData) return false;
        // Show if there's any planned or actual for this channel
        return channelData.planned > 0 || channelData.actual > 0;
      });
    }

    // Apply "only deviations" filter
    if (showOnlyDeviations) {
      result = result.filter((c) => c.totals.planned !== c.totals.actual);
    }

    // Apply "include out of scope" filter (default: exclude out of scope)
    if (!includeOutOfScope) {
      result = result.filter((c) => {
        const status = calculateStatus(c.totals.planned, c.totals.actual);
        return status !== 'OUT_OF_SCOPE';
      });
    }

    // Sort by risk
    return sortByRisk(result);
  }, [clients, searchQuery, statusFilter, channelFilter, showOnlyDeviations, includeOutOfScope]);

  if (filteredAndSortedClients.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">
            Nenhum cliente encontrado com os filtros aplicados.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Tente ajustar os filtros ou a busca.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Table Header */}
      <div className="flex items-center gap-4 px-4 py-3 bg-muted/30 border-b border-border text-sm font-medium text-muted-foreground">
        <div className="w-4" /> {/* Chevron space */}
        <div className="flex-1">Cliente</div>
        <div className="flex items-center gap-6">
          <div className="text-center min-w-[60px]">Planejado</div>
          <div className="text-center min-w-[60px]">Realizado</div>
          <div className="text-center min-w-[60px]">Delta</div>
          <div className="text-center min-w-[70px]">% Plano</div>
          <div className="min-w-[100px]">Status</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-border">
        {filteredAndSortedClients.map((client) => (
          <ScopeClientRow
            key={client.client_id}
            client={client}
            isHighlighted={highlightedClientId === client.client_id}
            onEditClient={onEditClient}
          />
        ))}
      </div>

      {/* Footer with count */}
      <div className="px-4 py-3 bg-muted/20 border-t border-border text-sm text-muted-foreground">
        {filteredAndSortedClients.length} cliente{filteredAndSortedClients.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
