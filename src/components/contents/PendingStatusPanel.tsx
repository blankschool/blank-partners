import { useState, useMemo, useCallback } from "react";
import { startOfToday, isBefore, parseISO, isValid } from "date-fns";
import { AlertTriangle } from "lucide-react";
import { ContentItem } from "@/hooks/useGoogleSheetsContent";
import { normalizeStatus, getStageConfig } from "@/lib/contentStages";
import { ContentCalendar } from "./ContentCalendar";
import { ContentCard } from "./ContentCard";
import { ContentPagination } from "./ContentPagination";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ViewMode } from "./ContentFilters";

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

interface PendingStatusPanelProps {
  items: ContentItem[];
  viewMode: ViewMode;
  onDayClick: (date: Date, dayItems: ContentItem[]) => void;
}

export function PendingStatusPanel({ items, viewMode, onDayClick }: PendingStatusPanelProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const today = useMemo(() => startOfToday(), []);

  const pendingItems = useMemo(() => {
    return items.filter(item => {
      const itemDate = parseDate(item.date);
      if (!itemDate) return false;
      if (!isBefore(itemDate, today)) return false;
      const normalized = normalizeStatus(item.status);
      return normalized !== "publicado" && normalized !== "cancelado";
    });
  }, [items, today]);

  const clientBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    pendingItems.forEach(item => {
      const client = item.client || "Sem cliente";
      map.set(client, (map.get(client) || 0) + 1);
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1]);
  }, [pendingItems]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return pendingItems.slice(start, start + ITEMS_PER_PAGE);
  }, [pendingItems, currentPage]);

  const handlePageChange = useCallback((page: number) => setCurrentPage(page), []);

  return (
    <div className="space-y-6">
      {/* KPI Card */}
      <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700">
        <CardContent className="flex items-center gap-4 py-5">
          <div className="rounded-xl bg-amber-100 dark:bg-amber-900/50 p-3">
            <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-medium">
              Conteúdos pendentes de status
            </p>
            <p className="text-3xl font-serif font-bold text-amber-900 dark:text-amber-200 mt-1">
              {pendingItems.length}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Content view */}
      {pendingItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhum conteúdo pendente de atualização de status
          </CardContent>
        </Card>
      ) : viewMode === "calendar" ? (
        <ContentCalendar items={pendingItems} onDayClick={onDayClick} />
      ) : viewMode === "grid" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedItems.map((item, index) => (
              <ContentCard key={`${item.id}-${index}`} item={item} variant="grid" />
            ))}
          </div>
          <ContentPagination
            currentPage={currentPage}
            totalItems={pendingItems.length}
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
            totalItems={pendingItems.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Client breakdown table */}
      {clientBreakdown.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold">Detalhamento por cliente</h3>
            </div>
            <div className="divide-y divide-border/50">
              {clientBreakdown.map(([client, count]) => (
                <div key={client} className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm font-medium">{client}</span>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
