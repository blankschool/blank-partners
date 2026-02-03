import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CHANNEL_CONFIG, type ScopeStatus, type ChannelCode } from "@/lib/scopeCalculations";

export type StatusFilter = ScopeStatus | 'all';
export type ChannelFilter = ChannelCode | 'all';

interface ScopeControlFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  channelFilter: ChannelFilter;
  onChannelFilterChange: (value: ChannelFilter) => void;
  showOnlyDeviations: boolean;
  onShowOnlyDeviationsChange: (value: boolean) => void;
  includeOutOfScope: boolean;
  onIncludeOutOfScopeChange: (value: boolean) => void;
}

export function ScopeControlFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  channelFilter,
  onChannelFilterChange,
  showOnlyDeviations,
  onShowOnlyDeviationsChange,
  includeOutOfScope,
  onIncludeOutOfScopeChange,
}: ScopeControlFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* First row: Search and Selects */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cliente..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={(v) => onStatusFilterChange(v as StatusFilter)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="BEHIND">Atrasado</SelectItem>
            <SelectItem value="ON_TRACK">No prazo</SelectItem>
            <SelectItem value="OVERDELIVERY">Excedido</SelectItem>
            <SelectItem value="OUT_OF_SCOPE">Fora do escopo</SelectItem>
          </SelectContent>
        </Select>

        {/* Channel Filter */}
        <Select value={channelFilter} onValueChange={(v) => onChannelFilterChange(v as ChannelFilter)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Canal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os canais</SelectItem>
            {CHANNEL_CONFIG.map((channel) => (
              <SelectItem key={channel.code} value={channel.code}>
                {channel.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Second row: Toggles */}
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch
            id="only-deviations"
            checked={showOnlyDeviations}
            onCheckedChange={onShowOnlyDeviationsChange}
          />
          <Label htmlFor="only-deviations" className="text-sm cursor-pointer">
            Só desvios
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="include-out-of-scope"
            checked={includeOutOfScope}
            onCheckedChange={onIncludeOutOfScopeChange}
          />
          <Label htmlFor="include-out-of-scope" className="text-sm cursor-pointer">
            Incluir fora do escopo
          </Label>
        </div>
      </div>
    </div>
  );
}
