import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGoogleSheetsContent, ContentItem } from "@/hooks/useGoogleSheetsContent";
import { StageStatsPanel } from "@/components/contents/StageStatsPanel";
import { ContentFilters, ViewMode, PeriodType } from "@/components/contents/ContentFilters";
import { ContentCard } from "@/components/contents/ContentCard";
import { ContentCalendar } from "@/components/contents/ContentCalendar";
import { DayContentDialog } from "@/components/contents/DayContentDialog";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseISO, isValid, isWithinInterval } from "date-fns";
import { normalizeStatus, STAGE_GROUPS } from "@/lib/contentStages";

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  
  try {
    const date = parseISO(dateStr);
    if (isValid(date)) return date;
  } catch {}
  
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (isValid(date)) return date;
    }
  }
  
  return null;
}

const Contents = () => {
  const { data, isLoading, error, refetch } = useGoogleSheetsContent();
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState("all");
  const [selectedClient, setSelectedClient] = useState("all");
  const [selectedStage, setSelectedStage] = useState("all");
  const [selectedGroupFromPanel, setSelectedGroupFromPanel] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [periodType, setPeriodType] = useState<PeriodType>("all");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedDayItems, setSelectedDayItems] = useState<ContentItem[]>([]);

  const items = data?.items || [];

  // Extract unique clients
  const clients = useMemo(() => {
    const uniqueClients = new Set<string>();
    items.forEach(item => {
      if (item.client) uniqueClients.add(item.client);
    });
    return Array.from(uniqueClients).sort();
  }, [items]);

  // Extract unique persons (SM/responsáveis)
  const persons = useMemo(() => {
    const uniquePersons = new Set<string>();
    items.forEach(item => {
      if (item.socialMedia) uniquePersons.add(item.socialMedia);
    });
    return Array.from(uniquePersons).sort();
  }, [items]);

  // Apply all filters
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          item.id.toLowerCase().includes(query) ||
          item.client.toLowerCase().includes(query) ||
          item.status.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Person (SM) filter
      if (selectedPerson !== "all") {
        if (item.socialMedia !== selectedPerson) return false;
      }

      // Client filter
      if (selectedClient !== "all") {
        if (item.client !== selectedClient) return false;
      }

      // Stage filter (from dropdown)
      if (selectedStage !== "all") {
        if (normalizeStatus(item.status) !== selectedStage) return false;
      }

      // Group filter (from panel)
      if (selectedGroupFromPanel) {
        const group = STAGE_GROUPS.find(g => g.key === selectedGroupFromPanel);
        if (group) {
          const normalizedStatus = normalizeStatus(item.status);
          if (!group.stages.includes(normalizedStatus)) return false;
        }
      }

      // Date range filter
      if (dateRange) {
        const itemDate = parseDate(item.date);
        if (!itemDate || !isWithinInterval(itemDate, { start: dateRange.from, end: dateRange.to })) {
          return false;
        }
      }

      return true;
    });
  }, [items, searchQuery, selectedPerson, selectedClient, selectedStage, selectedGroupFromPanel, dateRange]);

  const handlePeriodChange = (type: PeriodType, range?: { from: Date; to: Date }) => {
    setPeriodType(type);
    setDateRange(range || null);
  };

  const handleGroupFromPanel = (group: string | null) => {
    setSelectedGroupFromPanel(group);
    if (group) {
      setSelectedStage("all"); // Reset dropdown when selecting from panel
    }
  };

  const handleDayClick = (date: Date, dayItems: ContentItem[]) => {
    setSelectedDay(date);
    setSelectedDayItems(dayItems);
  };

  if (isLoading) {
    return (
      <AppLayout title="Conteúdos">
        <div className="space-y-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="Conteúdos">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-medium mb-2">Erro ao carregar conteúdos</h3>
            <p className="text-muted-foreground mb-4">
              {error instanceof Error ? error.message : 'Não foi possível conectar ao Google Sheets'}
            </p>
            <Button onClick={() => refetch()} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Conteúdos">
      <div className="space-y-6">
        {/* Stage Stats Panel */}
        <StageStatsPanel
          items={items}
          selectedGroup={selectedGroupFromPanel}
          onGroupClick={handleGroupFromPanel}
        />

        {/* Filters */}
        <ContentFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedPerson={selectedPerson}
          onPersonChange={setSelectedPerson}
          selectedClient={selectedClient}
          onClientChange={setSelectedClient}
          selectedStage={selectedStage}
          onStageChange={(stage) => {
            setSelectedStage(stage);
            setSelectedGroupFromPanel(null); // Reset panel selection when using dropdown
          }}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          periodType={periodType}
          onPeriodChange={handlePeriodChange}
          dateRange={dateRange}
          clients={clients}
          persons={persons}
        />

        {/* Content display */}
        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Nenhum conteúdo encontrado com os filtros selecionados
            </CardContent>
          </Card>
        ) : viewMode === "calendar" ? (
          <>
            <ContentCalendar items={filteredItems} onDayClick={handleDayClick} />
            <DayContentDialog
              open={selectedDay !== null}
              onOpenChange={(open) => !open && setSelectedDay(null)}
              date={selectedDay}
              items={selectedDayItems}
            />
          </>
        ) : viewMode === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, index) => (
              <ContentCard key={`${item.id}-${index}`} item={item} variant="grid" />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {filteredItems.map((item, index) => (
                  <ContentCard key={`${item.id}-${index}`} item={item} variant="list" />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Last sync info */}
        {data?.fetchedAt && (
          <p className="text-xs text-muted-foreground text-center">
            Última atualização: {new Date(data.fetchedAt).toLocaleString('pt-BR')}
          </p>
        )}
      </div>
    </AppLayout>
  );
};

export default Contents;
