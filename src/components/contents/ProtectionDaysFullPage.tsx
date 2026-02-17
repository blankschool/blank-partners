import { useMemo, useState, useCallback } from "react";
import { ContentItem } from "@/hooks/useGoogleSheetsContent";
import { normalizeStatus } from "@/lib/contentStages";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertTriangle, ShieldCheck, Shield, ShieldX, ShieldAlert } from "lucide-react";
import { startOfToday, addDays, subDays, isBefore, isWithinInterval, parseISO, isValid } from "date-fns";

const PIPELINE_STATUSES = [
  "pronto para postar",
  "edicao de video",
  "ajustes edicao de video",
  "criacao design",
  "ajustes criacao design",
  "em briefing",
];

const FINAL_STATUSES = ["publicado", "cancelado", "reagendado"];

const WEIGHTS: Record<string, number> = {
  "pronto para postar": 1.0,
  "edicao de video": 0.7,
  "ajustes edicao de video": 0.7,
  "criacao design": 0.7,
  "ajustes criacao design": 0.7,
  "em briefing": 0.5,
};

function parseDateStr(dateStr: string): Date | null {
  if (!dateStr) return null;
  try {
    const d = parseISO(dateStr);
    if (isValid(d)) return d;
  } catch {}
  if (dateStr.includes("/")) {
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (isValid(d)) return d;
    }
  }
  return null;
}

type Classification = "excellent" | "ok" | "bad" | "no_calendar";

interface ClientProtection {
  client: string;
  protectionDays: number | null;
  classification: Classification;
  readyCount: number;
  creationCount: number;
  briefingCount: number;
  overdueCount: number;
  ce: number;
  postsPerDay: number;
}

type FilterKey = "excellent" | "ok" | "bad" | "no_calendar";

interface ProtectionDaysFullPageProps {
  allItems: ContentItem[];
}

const HORIZON_OPTIONS = [7, 14, 21, 30] as const;

export function ProtectionDaysFullPage({ allItems }: ProtectionDaysFullPageProps) {
  const [showOnlyBad, setShowOnlyBad] = useState(false);
  const [horizonDays, setHorizonDays] = useState(14);
  const [activeFilters, setActiveFilters] = useState<Set<FilterKey>>(
    new Set(["excellent", "ok", "bad", "no_calendar"])
  );

  const toggleFilter = useCallback((key: FilterKey) => {
    setActiveFilters((prev) => {
      if (prev.has(key) && prev.size === 1) return prev;
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const { clientData, totalOverdue, summary } = useMemo(() => {
    const today = startOfToday();
    const horizon = addDays(today, horizonDays);
    const past28 = subDays(today, 28);

    const byClient: Record<string, ContentItem[]> = {};
    allItems.forEach((item) => {
      if (!item.client) return;
      if (!byClient[item.client]) byClient[item.client] = [];
      byClient[item.client].push(item);
    });

    let totalOv = 0;
    const results: ClientProtection[] = [];

    Object.entries(byClient).forEach(([client, clientItems]) => {
      let ce = 0;
      let readyCount = 0;
      let creationCount = 0;
      let briefingCount = 0;
      let overdueCount = 0;
      let scheduledLast28 = 0;

      clientItems.forEach((item) => {
        const normalized = normalizeStatus(item.status);
        const itemDate = parseDateStr(item.date);

        if (itemDate && isWithinInterval(itemDate, { start: past28, end: today })) {
          scheduledLast28++;
        }

        const isFinal = FINAL_STATUSES.includes(normalized);
        if (itemDate && isBefore(itemDate, today) && !isFinal) {
          overdueCount++;
          totalOv++;
          return;
        }

        if (
          itemDate &&
          isWithinInterval(itemDate, { start: today, end: horizon }) &&
          PIPELINE_STATUSES.includes(normalized)
        ) {
          const weight = WEIGHTS[normalized] ?? 0;
          ce += weight;
          if (normalized === "pronto para postar") readyCount++;
          else if (normalized === "em briefing") briefingCount++;
          else creationCount++;
        }
      });

      const postsPerDay = scheduledLast28 / 28;
      let protectionDays: number | null = null;
      let classification: Classification = "no_calendar";

      if (postsPerDay > 0) {
        protectionDays = ce / postsPerDay;
        if (protectionDays >= 7) classification = "excellent";
        else if (protectionDays >= 3) classification = "ok";
        else classification = "bad";
      }

      results.push({
        client, protectionDays, classification, readyCount,
        creationCount, briefingCount, overdueCount, ce, postsPerDay,
      });
    });

    const classOrder: Record<Classification, number> = { bad: 0, ok: 1, excellent: 2, no_calendar: 3 };
    results.sort((a, b) => {
      const diff = classOrder[a.classification] - classOrder[b.classification];
      if (diff !== 0) return diff;
      return (a.protectionDays ?? 999) - (b.protectionDays ?? 999);
    });

    return {
      clientData: results,
      totalOverdue: totalOv,
      summary: {
        excellent: results.filter((r) => r.classification === "excellent").length,
        ok: results.filter((r) => r.classification === "ok").length,
        bad: results.filter((r) => r.classification === "bad").length,
        noCal: results.filter((r) => r.classification === "no_calendar").length,
      },
    };
  }, [allItems, horizonDays]);

  const displayData = useMemo(() => {
    let data = clientData;
    if (showOnlyBad) data = data.filter((r) => r.classification === "bad");
    else data = data.filter((r) => activeFilters.has(r.classification));
    return data;
  }, [clientData, showOnlyBad, activeFilters]);

  const classConfig: Record<Classification, { label: string; variant: "success" | "warning" | "destructive" | "secondary" }> = {
    excellent: { label: "Excelente", variant: "success" },
    ok: { label: "Ok", variant: "warning" },
    bad: { label: "Ruim", variant: "destructive" },
    no_calendar: { label: "Sem calendário", variant: "secondary" },
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div
          onClick={() => toggleFilter("excellent")}
          className={`flex flex-col items-start p-5 rounded-2xl border transition-all cursor-pointer select-none ${
            activeFilters.has("excellent")
              ? "border-green-200 bg-green-100"
              : "border-dashed border-green-200/50 bg-green-100/30 opacity-40"
          }`}
        >
          <span className="text-[10px] font-medium uppercase tracking-widest text-green-600">
            Excelente
          </span>
          <span className="mt-2 font-serif text-5xl font-normal tracking-tight text-green-600">
            {summary.excellent}
          </span>
          <span className="mt-1 text-xs text-green-600/70">
            ≥ 7 dias de proteção
          </span>
        </div>

        <div
          onClick={() => toggleFilter("ok")}
          className={`flex flex-col items-start p-5 rounded-2xl border transition-all cursor-pointer select-none ${
            activeFilters.has("ok")
              ? "border-yellow-200 bg-yellow-100"
              : "border-dashed border-yellow-200/50 bg-yellow-100/30 opacity-40"
          }`}
        >
          <span className="text-[10px] font-medium uppercase tracking-widest text-yellow-600">
            Ok
          </span>
          <span className="mt-2 font-serif text-5xl font-normal tracking-tight text-yellow-600">
            {summary.ok}
          </span>
          <span className="mt-1 text-xs text-yellow-600/70">
            3–7 dias de proteção
          </span>
        </div>

        <div
          onClick={() => toggleFilter("bad")}
          className={`flex flex-col items-start p-5 rounded-2xl border transition-all cursor-pointer select-none ${
            activeFilters.has("bad")
              ? "border-red-200 bg-red-100"
              : "border-dashed border-red-200/50 bg-red-100/30 opacity-40"
          }`}
        >
          <span className="text-[10px] font-medium uppercase tracking-widest text-red-600">
            Ruim
          </span>
          <span className="mt-2 font-serif text-5xl font-normal tracking-tight text-red-600">
            {summary.bad}
          </span>
          <span className="mt-1 text-xs text-red-600/70">
            &lt; 3 dias de proteção
          </span>
        </div>

        <div
          onClick={() => toggleFilter("no_calendar")}
          className={`flex flex-col items-start p-5 rounded-2xl border transition-all cursor-pointer select-none ${
            activeFilters.has("no_calendar")
              ? "border-border bg-muted"
              : "border-dashed border-border/50 bg-muted/30 opacity-40"
          }`}
        >
          <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Sem Calendário
          </span>
          <span className="mt-2 font-serif text-5xl font-normal tracking-tight text-muted-foreground">
            {summary.noCal}
          </span>
          <span className="mt-1 text-xs text-muted-foreground/70">
            sem histórico recente
          </span>
        </div>
      </div>

      {/* Overdue warning + toggle */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        {totalOverdue > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            {totalOverdue} {totalOverdue === 1 ? "item vencido" : "itens vencidos"} (excluídos do cálculo)
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Horizonte:</span>
          <div className="flex items-center gap-1">
            {HORIZON_OPTIONS.map((days) => (
              <Button
                key={days}
                variant={horizonDays === days ? "default" : "outline"}
                size="sm"
                className="h-7 px-2.5 text-xs"
                onClick={() => setHorizonDays(days)}
              >
                {days}d
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <Switch id="show-bad-full" checked={showOnlyBad} onCheckedChange={setShowOnlyBad} />
          <Label htmlFor="show-bad-full" className="text-sm cursor-pointer">
            Mostrar apenas Ruim
          </Label>
        </div>
      </div>

      {/* Ranking table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-center">Dias de Proteção</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Detalhe</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    Nenhum cliente encontrado com os filtros selecionados
                  </TableCell>
                </TableRow>
              ) : (
                displayData.map((row) => {
                  const cfg = classConfig[row.classification];
                  return (
                    <TableRow key={row.client}>
                      <TableCell className="font-medium">{row.client}</TableCell>
                      <TableCell className="text-center">
                        <span className="font-serif text-2xl font-normal tracking-tight">
                          {row.protectionDays !== null ? row.protectionDays.toFixed(1) : "N/A"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={cfg.variant}>{cfg.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        Prontos: {row.readyCount} | Em criação: {row.creationCount} | Briefing: {row.briefingCount}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
