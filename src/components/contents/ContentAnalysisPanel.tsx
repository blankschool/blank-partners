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
import { useState } from "react";

const VIDEO_STAGES = ["edicao de video", "ajustes edicao de video"];
const DESIGN_STAGES = ["criacao design", "ajustes criacao design"];
const PRODUCTION_STAGES = [...VIDEO_STAGES, ...DESIGN_STAGES];

const ITEMS_PER_PAGE = 50;

interface ContentAnalysisPanelProps {
  items: ContentItem[];
  viewMode: ViewMode;
  onDayClick?: (date: Date, dayItems: ContentItem[]) => void;
}

export function ContentAnalysisPanel({ items, viewMode, onDayClick }: ContentAnalysisPanelProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const { videoCount, designCount, clientBreakdown, productionItems } = useMemo(() => {
    let video = 0;
    let design = 0;
    const byClient: Record<string, { video: number; design: number }> = {};
    const prodItems: ContentItem[] = [];

    items.forEach((item) => {
      const normalized = normalizeStatus(item.status);
      const isVideo = VIDEO_STAGES.includes(normalized);
      const isDesign = DESIGN_STAGES.includes(normalized);

      if (!isVideo && !isDesign) return;

      prodItems.push(item);

      if (!byClient[item.client]) {
        byClient[item.client] = { video: 0, design: 0 };
      }

      if (isVideo) {
        video++;
        byClient[item.client].video++;
      }
      if (isDesign) {
        design++;
        byClient[item.client].design++;
      }
    });

    const breakdown = Object.entries(byClient)
      .map(([client, counts]) => ({
        client,
        video: counts.video,
        design: counts.design,
        total: counts.video + counts.design,
      }))
      .sort((a, b) => b.total - a.total);

    return { videoCount: video, designCount: design, clientBreakdown: breakdown, productionItems: prodItems };
  }, [items]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return productionItems.slice(start, start + ITEMS_PER_PAGE);
  }, [productionItems, currentPage]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-start p-5 rounded-2xl border border-purple-200 bg-purple-100 transition-all">
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

        <div className="flex flex-col items-start p-5 rounded-2xl border border-orange-200 bg-orange-100 transition-all">
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
                  <TableHead className="text-center">Ed. Vídeo</TableHead>
                  <TableHead className="text-center">Cr. Design</TableHead>
                  <TableHead className="text-center">Total Prod.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientBreakdown.map((row) => (
                  <TableRow key={row.client}>
                    <TableCell className="font-medium">{row.client}</TableCell>
                    <TableCell className="text-center">
                      {row.video > 0 ? (
                        <span className="text-purple-600 font-medium">{row.video}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {row.design > 0 ? (
                        <span className="text-orange-600 font-medium">{row.design}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center font-semibold">{row.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
