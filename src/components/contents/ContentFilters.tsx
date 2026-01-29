import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, Grid3X3, List, Calendar as CalendarIcon } from "lucide-react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CONTENT_STAGES, SOCIAL_MEDIA_PLATFORMS } from "@/lib/contentStages";
import { cn } from "@/lib/utils";

export type ViewMode = "grid" | "list" | "calendar";
export type PeriodType = "all" | "week" | "month" | "custom";

interface ContentFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedPerson: string;
  onPersonChange: (value: string) => void;
  selectedClient: string;
  onClientChange: (value: string) => void;
  selectedStage: string;
  onStageChange: (value: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  periodType: PeriodType;
  onPeriodChange: (type: PeriodType, dateRange?: { from: Date; to: Date }) => void;
  dateRange: { from: Date; to: Date } | null;
  clients: string[];
  persons: string[];
}

export function ContentFilters({
  searchQuery,
  onSearchChange,
  selectedPerson,
  onPersonChange,
  selectedClient,
  onClientChange,
  selectedStage,
  onStageChange,
  viewMode,
  onViewModeChange,
  periodType,
  onPeriodChange,
  dateRange,
  clients,
  persons,
}: ContentFiltersProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handlePeriodSelect = (type: PeriodType) => {
    const now = new Date();
    let range: { from: Date; to: Date } | undefined;

    if (type === "week") {
      range = {
        from: startOfWeek(now, { weekStartsOn: 1 }),
        to: endOfWeek(now, { weekStartsOn: 1 }),
      };
    } else if (type === "month") {
      range = {
        from: startOfMonth(now),
        to: endOfMonth(now),
      };
    }

    onPeriodChange(type, range);
  };

  const getPeriodLabel = () => {
    if (periodType === "all") return "Todo período";
    if (periodType === "week") return "Esta semana";
    if (periodType === "month") return "Este mês";
    if (dateRange) {
      const isSameDay = dateRange.from.toDateString() === dateRange.to.toDateString();
      if (isSameDay) {
        return format(dateRange.from, "dd/MM/yyyy");
      }
      return `${format(dateRange.from, "dd/MM")} - ${format(dateRange.to, "dd/MM")}`;
    }
    return "Selecionar período";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {/* Person (SM) filter */}
        <Select value={selectedPerson} onValueChange={onPersonChange}>
          <SelectTrigger className="w-[160px] font-sans">
            <SelectValue placeholder="Responsável" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos responsáveis</SelectItem>
            {persons.map(person => (
              <SelectItem key={person} value={person}>
                {person}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Client filter */}
        <Select value={selectedClient} onValueChange={onClientChange}>
          <SelectTrigger className="w-[160px] font-sans">
            <SelectValue placeholder="Cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos clientes</SelectItem>
            {clients.map(client => (
              <SelectItem key={client} value={client}>
                {client}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Stage filter */}
        <Select value={selectedStage} onValueChange={onStageChange}>
          <SelectTrigger className="w-[160px] font-sans">
            <SelectValue placeholder="Etapa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas etapas</SelectItem>
            {CONTENT_STAGES.map(stage => (
              <SelectItem key={stage.key} value={stage.key}>
                {stage.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Period filter */}
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2 font-sans">
              <CalendarIcon className="h-4 w-4" />
              {getPeriodLabel()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="flex flex-col">
              <div className="flex gap-1 p-2 border-b">
                <Button
                  variant={periodType === "all" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => {
                    handlePeriodSelect("all");
                    setCalendarOpen(false);
                  }}
                >
                  Tudo
                </Button>
                <Button
                  variant={periodType === "week" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => {
                    handlePeriodSelect("week");
                    setCalendarOpen(false);
                  }}
                >
                  Semana
                </Button>
                <Button
                  variant={periodType === "month" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => {
                    handlePeriodSelect("month");
                    setCalendarOpen(false);
                  }}
                >
                  Mês
                </Button>
              </div>
              <Calendar
                mode="range"
                selected={dateRange ? { from: dateRange.from, to: dateRange.to } : undefined}
                onSelect={(range) => {
                  if (range?.from) {
                    if (range.to) {
                      // Complete range selected - apply filter and close
                      onPeriodChange("custom", { from: range.from, to: range.to });
                      setCalendarOpen(false);
                    }
                    // If only "from" is selected, keep calendar open for second click
                  }
                }}
                locale={ptBR}
                className={cn("p-3 pointer-events-auto")}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar conteúdos..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* View mode toggle */}
        <div className="flex items-center rounded-xl border border-border p-1">
          <Button
            variant={viewMode === "calendar" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("calendar")}
            className="rounded-lg"
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className="rounded-lg"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            className="rounded-lg"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
