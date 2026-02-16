import { useState, useMemo, useEffect, startTransition, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGoogleSheetsContent, ContentItem } from "@/hooks/useGoogleSheetsContent";
import { StageStatsPanel } from "@/components/contents/StageStatsPanel";
import { ContentFilters, ViewMode, PeriodType } from "@/components/contents/ContentFilters";
import { ContentCard } from "@/components/contents/ContentCard";
import { ContentCalendar } from "@/components/contents/ContentCalendar";
import { DayContentDialog } from "@/components/contents/DayContentDialog";
import { ContentPagination } from "@/components/contents/ContentPagination";
import { ContentAnalysisPanel } from "@/components/contents/ContentAnalysisPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, RefreshCw, LayoutDashboard, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseISO, isValid, isWithinInterval } from "date-fns";
import { normalizeStatus, STAGE_GROUPS } from "@/lib/contentStages";

const ITEMS_PER_PAGE = 50;

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
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("painel");

  const items = data?.items || [];

  const clients = useMemo(() => {
    const uniqueClients = new Set<string>();
    items.forEach(item => { if (item.client) uniqueClients.add(item.client); });
    return Array.from(uniqueClients).sort();
  }, [items]);

  const persons = useMemo(() => {
    const uniquePersons = new Set<string>();
    items.forEach(item => { if (item.socialMedia) uniquePersons.add(item.socialMedia); });
    return Array.from(uniquePersons).sort();
  }, [items]);

  // Items filtered by date, person, client, and search (for stats & analysis)
  const itemsForStats = useMemo(() => {
    return items.filter(item => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          item.id.toLowerCase().includes(query) ||
          item.client.toLowerCase().includes(query) ||
          item.status.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      if (selectedPerson !== "all" && item.socialMedia !== selectedPerson) return false;
      if (selectedClient !== "all" && item.client !== selectedClient) return false;
      if (dateRange) {
        const itemDate = parseDate(item.date);
        if (!itemDate || !isWithinInterval(itemDate, { start: dateRange.from, end: dateRange.to })) return false;
      }
      return true;
    });
  }, [items, searchQuery, selectedPerson, selectedClient, dateRange]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          item.id.toLowerCase().includes(query) ||
          item.client.toLowerCase().includes(query) ||
          item.status.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      if (selectedPerson !== "all" && item.socialMedia !== selectedPerson) return false;
      if (selectedClient !== "all" && item.client !== selectedClient) return false;
      if (selectedStage !== "all" && normalizeStatus(item.status) !== selectedStage) return false;
      if (selectedGroupFromPanel) {
        const group = STAGE_GROUPS.find(g => g.key === selectedGroupFromPanel);
        if (group && !group.stages.includes(normalizeStatus(item.status))) return false;
      }
      if (dateRange) {
        const itemDate = parseDate(item.date);
        if (!itemDate || !isWithinInterval(itemDate, { start: dateRange.from, end: dateRange.to })) return false;
      }
      return true;
    });
  }, [items, searchQuery, selectedPerson, selectedClient, selectedStage, selectedGroupFromPanel, dateRange]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedPerson, selectedClient, selectedStage, selectedGroupFromPanel, dateRange]);

  const handlePeriodChange = useCallback((type: PeriodType, range?: { from: Date; to: Date }) => {
    startTransition(() => { setPeriodType(type); setDateRange(range || null); });
  }, []);

  const handleGroupFromPanel = useCallback((group: string | null) => {
    startTransition(() => { setSelectedGroupFromPanel(group); if (group) setSelectedStage("all"); });
  }, []);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    startTransition(() => { setViewMode(mode); setCurrentPage(1); });
  }, []);

  const handleSearchChange = useCallback((query: string) => { startTransition(() => setSearchQuery(query)); }, []);
  const handlePersonChange = useCallback((person: string) => { startTransition(() => setSelectedPerson(person)); }, []);
  const handleClientChange = useCallback((client: string) => { startTransition(() => setSelectedClient(client)); }, []);
  const handleStageChange = useCallback((stage: string) => {
    startTransition(() => { setSelectedStage(stage); setSelectedGroupFromPanel(null); });
  }, []);

  const handleDayClick = useCallback((date: Date, dayItems: ContentItem[]) => {
    setSelectedDay(date);
    setSelectedDayItems(dayItems);
  }, []);

  const handlePageChange = useCallback((page: number) => { startTransition(() => setCurrentPage(page)); }, []);

  if (isLoading) {
    return (
      <AppLayout title="Conteúdos">
        <div className="space-y-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-40" />)}
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="painel" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Painel
            </TabsTrigger>
            <TabsTrigger value="analise" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Análise
            </TabsTrigger>
          </TabsList>

          {/* Filters shared across both tabs */}
          <div className="mt-4">
            <ContentFilters
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              selectedPerson={selectedPerson}
              onPersonChange={handlePersonChange}
              selectedClient={selectedClient}
              onClientChange={handleClientChange}
              selectedStage={selectedStage}
              onStageChange={handleStageChange}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              periodType={periodType}
              onPeriodChange={handlePeriodChange}
              dateRange={dateRange}
              clients={clients}
              persons={persons}
              showViewToggle={activeTab === "painel"}
            />
          </div>

          {/* Painel tab */}
          <TabsContent value="painel">
            <div className="space-y-6">
              <StageStatsPanel
                items={itemsForStats}
                selectedGroup={selectedGroupFromPanel}
                onGroupClick={handleGroupFromPanel}
              />

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
                <>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {paginatedItems.map((item, index) => (
                      <ContentCard key={`${item.id}-${index}`} item={item} variant="grid" />
                    ))}
                  </div>
                  <ContentPagination
                    currentPage={currentPage}
                    totalItems={filteredItems.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={handlePageChange}
                  />
                </>
              ) : (
                <>
                  <Card>
                    <CardContent className="p-0">
                      <div className="divide-y divide-border/50">
                        {paginatedItems.map((item, index) => (
                          <ContentCard key={`${item.id}-${index}`} item={item} variant="list" />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <ContentPagination
                    currentPage={currentPage}
                    totalItems={filteredItems.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </div>
          </TabsContent>

          {/* Análise tab */}
          <TabsContent value="analise">
            <ContentAnalysisPanel items={itemsForStats} />
          </TabsContent>
        </Tabs>

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
