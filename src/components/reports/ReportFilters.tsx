import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Client {
  id: string;
  name: string;
}

interface ReportFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  period: string;
  onPeriodChange: (v: string) => void;
  clientId: string;
  onClientIdChange: (v: string) => void;
  clients: Client[];
}

export function ReportFilters({
  search,
  onSearchChange,
  period,
  onPeriodChange,
  clientId,
  onClientIdChange,
  clients,
}: ReportFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por título..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={period} onValueChange={onPeriodChange}>
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="Período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="weekly">Semanal</SelectItem>
          <SelectItem value="monthly">Mensal</SelectItem>
        </SelectContent>
      </Select>
      <Select value={clientId} onValueChange={onClientIdChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Cliente" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os clientes</SelectItem>
          {clients.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
