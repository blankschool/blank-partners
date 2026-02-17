import { useMemo } from "react";
import { ContentItem } from "@/hooks/useGoogleSheetsContent";
import { normalizeStatus } from "@/lib/contentStages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ViewMode } from "@/components/contents/ContentFilters";
import { ContentCalendar } from "@/components/contents/ContentCalendar";
import { ContentCard } from "@/components/contents/ContentCard";
import { ContentPagination } from "@/components/contents/ContentPagination";
import { ReadinessDashboard } from "@/components/contents/ReadinessDashboard";
import { useState, useCallback } from "react";

type StageKey = "video" | "design" | "briefing" | "ready";

const VIDEO_STAGES = ["edicao de video", "ajustes edicao de video"];
const DESIGN_STAGES = ["criacao design", "ajustes criacao design"];
const BRIEFING_STAGES = ["em briefing"];
const READY_STAGES = ["pronto para postar"];

const ITEMS_PER_PAGE = 50;

interface ContentAnalysisPanelProps {
  items: ContentItem[];
  viewMode: ViewMode;
  onDayClick?: (date: Date, dayItems: ContentItem[]) => void;
}

export function ContentAnalysisPanel({ items, viewMode, onDayClick }: ContentAnalysisPanelProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeStages, setActiveStages] = useState<Set<StageKey>>(new Set(["video", "design", "briefing", "ready"]));

  const toggleStage = useCallback((stage: StageKey) => {
    setActiveStages((prev) => {
      if (prev.has(stage) && prev.size === 1) return prev;
      const next = new Set(prev);
      if (next.has(stage)) next.delete(stage);
      else next.add(stage);
      return next;
    });
    setCurrentPage(1);
  }, []);

  const { videoCount, designCount, briefingCount, readyCount, clientBreakdown, productionItems } = useMemo(() => {
    let video = 0;
    let design = 0;
    let briefing = 0;
    let ready = 0;
    const byClient: Record<string, { video: number; design: number; briefing: number; ready: number }> = {};
    const prodItems: ContentItem[] = [];

    items.forEach((item) => {
      const normalized = normalizeStatus(item.status);
      const isVideo = VIDEO_STAGES.includes(normalized);
      const isDesign = DESIGN_STAGES.includes(normalized);
      const isBriefing = BRIEFING_STAGES.includes(normalized);
      const isReady = READY_STAGES.includes(normalized);

      if (!isVideo && !isDesign && !isBriefing && !isReady) return;

      if (isVideo) video++;
      if (isDesign) design++;
      if (isBriefing) briefing++;
      if (isReady) ready++;

      if (!byClient[item.client]) {
        byClient[item.client] = { video: 0, design: 0, briefing: 0, ready: 0 };
      }
      if (isVideo) byClient[item.client].video++;
      if (isDesign) byClient[item.client].design++;
      if (isBriefing) byClient[item.client].briefing++;
      if (isReady) byClient[item.client].ready++;

      const include =
        (isVideo && activeStages.has("video")) ||
        (isDesign && activeStages.has("design")) ||
        (isBriefing && activeStages.has("briefing")) ||
        (isReady && activeStages.has("ready"));
      if (include) prodItems.push(item);
    });

    const breakdown = Object.entries(byClient)
      .map(([client, counts]) => {
        const t =
          (activeStages.has("video") ? counts.video : 0) +
          (activeStages.has("design") ? counts.design : 0) +
          (activeStages.has("briefing") ? counts.briefing : 0) +
          (activeStages.has("ready") ? counts.ready : 0);
        return { client, video: counts.video, design: counts.design, briefing: counts.briefing, ready: counts.ready, total: t };
      })
      .filter((r) => r.total > 0)
      .sort((a, b) => b.total - a.total);

    return { videoCount: video, designCount: design, briefingCount: briefing, readyCount: ready, clientBreakdown: breakdown, productionItems: prodItems };
  }, [items, activeStages]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return productionItems.slice(start, start + ITEMS_PER_PAGE);
  }, [productionItems, currentPage]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div
          onClick={() => toggleStage("video")}
          className={`flex flex-col items-start p-5 rounded-2xl border transition-all cursor-pointer select-none ${activeStages.has("video") ? "border-purple-200 bg-purple-100" : "border-dashed border-purple-200/50 bg-purple-100/30 opacity-40"}`}
        >
          <span className="text-[10px] font-medium uppercase tracking-widest text-purple-600">
            Edição de Vídeo
          </span>
          <span className="mt-2 font-serif text-5xl font-normal tracking-tight text-purple-600">
            {videoCount}
          </span>
          <span className="mt-1 text-xs text-purple-600/70">
            conteúdos nesta etapa
          </span>
        </div>

        <div
          onClick={() => toggleStage("design")}
          className={`flex flex-col items-start p-5 rounded-2xl border transition-all cursor-pointer select-none ${activeStages.has("design") ? "border-orange-200 bg-orange-100" : "border-dashed border-orange-200/50 bg-orange-100/30 opacity-40"}`}
        >
          <span className="text-[10px] font-medium uppercase tracking-widest text-orange-600">
            Criação Design
          </span>
          <span className="mt-2 font-serif text-5xl font-normal tracking-tight text-orange-600">
            {designCount}
          </span>
          <span className="mt-1 text-xs text-orange-600/70">
            conteúdos nesta etapa
          </span>
        </div>

        <div
          onClick={() => toggleStage("briefing")}
          className={`flex flex-col items-start p-5 rounded-2xl border transition-all cursor-pointer select-none ${activeStages.has("briefing") ? "border-blue-200 bg-blue-100" : "border-dashed border-blue-200/50 bg-blue-100/30 opacity-40"}`}
        >
          <span className="text-[10px] font-medium uppercase tracking-widest text-blue-600">
            Em Briefing
          </span>
          <span className="mt-2 font-serif text-5xl font-normal tracking-tight text-blue-600">
            {briefingCount}
          </span>
          <span className="mt-1 text-xs text-blue-600/70">
            conteúdos nesta etapa
          </span>
        </div>

        <div
          onClick={() => toggleStage("ready")}
          className={`flex flex-col items-start p-5 rounded-2xl border transition-all cursor-pointer select-none ${activeStages.has("ready") ? "border-yellow-200 bg-yellow-100" : "border-dashed border-yellow-200/50 bg-yellow-100/30 opacity-40"}`}
        >
          <span className="text-[10px] font-medium uppercase tracking-widest text-yellow-600">
            Pronto para Postar
          </span>
          <span className="mt-2 font-serif text-5xl font-normal tracking-tight text-yellow-600">
            {readyCount}
          </span>
          <span className="mt-1 text-xs text-yellow-600/70">
            conteúdos nesta etapa
          </span>
        </div>
      </div>

      {/* View: Calendar or List */}
      {productionItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhum conteúdo em Edição de Vídeo ou Criação Design com os filtros selecionados
          </CardContent>
        </Card>
      ) : viewMode === "calendar" ? (
        <ContentCalendar items={productionItems} onDayClick={onDayClick} />
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
            totalItems={productionItems.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Client breakdown table */}
      {clientBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detalhamento por cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  {activeStages.has("briefing") && <TableHead className="text-center">Briefing</TableHead>}
                  {activeStages.has("video") && <TableHead className="text-center">Ed. Vídeo</TableHead>}
                  {activeStages.has("design") && <TableHead className="text-center">Cr. Design</TableHead>}
                  {activeStages.has("ready") && <TableHead className="text-center">Pronto</TableHead>}
                  <TableHead className="text-center">Total Prod.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientBreakdown.map((row) => (
                  <TableRow key={row.client}>
                    <TableCell className="font-medium">{row.client}</TableCell>
                    {activeStages.has("briefing") && (
                      <TableCell className="text-center">
                        {row.briefing > 0 ? (
                          <span className="text-blue-600 font-medium">{row.briefing}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    )}
                    {activeStages.has("video") && (
                      <TableCell className="text-center">
                        {row.video > 0 ? (
                          <span className="text-purple-600 font-medium">{row.video}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    )}
                    {activeStages.has("design") && (
                      <TableCell className="text-center">
                        {row.design > 0 ? (
                          <span className="text-orange-600 font-medium">{row.design}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    )}
                    {activeStages.has("ready") && (
                      <TableCell className="text-center">
                        {row.ready > 0 ? (
                          <span className="text-yellow-600 font-medium">{row.ready}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    )}
                    <TableCell className="text-center font-semibold">{row.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Readiness Dashboard */}
      <ReadinessDashboard items={items} />
    </div>
  );
}
