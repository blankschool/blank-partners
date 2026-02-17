import { useMemo, useState } from "react";
import { ContentItem } from "@/hooks/useGoogleSheetsContent";
import { normalizeStatus } from "@/lib/contentStages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Shield, ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
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

interface ProtectionDaysPanelProps {
  allItems: ContentItem[];
}

export function ProtectionDaysPanel({ allItems }: ProtectionDaysPanelProps) {
  const [showOnlyBad, setShowOnlyBad] = useState(false);

  const { clientData, totalOverdue, summary } = useMemo(() => {
    const today = startOfToday();
    const horizon = addDays(today, 14);
    const past28 = subDays(today, 28);

    // Group items by client
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

        // Count rhythm: items scheduled in last 28 days (any status)
        if (itemDate && isWithinInterval(itemDate, { start: past28, end: today })) {
          scheduledLast28++;
        }

        // Check overdue: past date + non-final status
        const isFinal = FINAL_STATUSES.includes(normalized);
        if (itemDate && isBefore(itemDate, today) && !isFinal) {
          overdueCount++;
          totalOv++;
          return; // Skip overdue from pipeline calculation
        }

        // Pipeline: within horizon + pipeline status
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
        client,
        protectionDays,
        classification,
        readyCount,
        creationCount,
        briefingCount,
        overdueCount,
        ce,
        postsPerDay,
      });
    });

    // Sort: bad first, then ok, then excellent, then no_calendar. Within same class, lowest days first.
    const classOrder: Record<Classification, number> = { bad: 0, ok: 1, excellent: 2, no_calendar: 3 };
    results.sort((a, b) => {
      const diff = classOrder[a.classification] - classOrder[b.classification];
      if (diff !== 0) return diff;
      return (a.protectionDays ?? 999) - (b.protectionDays ?? 999);
    });

    const excellent = results.filter((r) => r.classification === "excellent").length;
    const ok = results.filter((r) => r.classification === "ok").length;
    const bad = results.filter((r) => r.classification === "bad").length;
    const noCal = results.filter((r) => r.classification === "no_calendar").length;

    return {
      clientData: results,
      totalOverdue: totalOv,
      summary: { total: results.length, excellent, ok, bad, noCal },
    };
  }, [allItems]);

  const displayData = showOnlyBad ? clientData.filter((r) => r.classification === "bad") : clientData;

  const classConfig: Record<Classification, { label: string; variant: "success" | "warning" | "destructive" | "secondary"; icon: typeof ShieldCheck }> = {
    excellent: { label: "Excelente", variant: "success", icon: ShieldCheck },
    ok: { label: "Ok", variant: "warning", icon: Shield },
    bad: { label: "Ruim", variant: "destructive", icon: ShieldX },
    no_calendar: { label: "Sem calendário", variant: "secondary", icon: ShieldAlert },
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Dias de Proteção
          </CardTitle>
          <div className="flex items-center gap-3">
            <Switch id="show-bad" checked={showOnlyBad} onCheckedChange={setShowOnlyBad} />
            <Label htmlFor="show-bad" className="text-sm cursor-pointer">
              Mostrar apenas Ruim
            </Label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* KPI Summary */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-100 text-green-700 text-sm font-medium">
            <ShieldCheck className="h-3.5 w-3.5" />
            {summary.excellent} Excelente
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-100 text-yellow-700 text-sm font-medium">
            <Shield className="h-3.5 w-3.5" />
            {summary.ok} Ok
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-sm font-medium">
            <ShieldX className="h-3.5 w-3.5" />
            {summary.bad} Ruim
          </div>
          {summary.noCal > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-sm font-medium">
              <ShieldAlert className="h-3.5 w-3.5" />
              {summary.noCal} Sem calendário
            </div>
          )}
        </div>

        {/* Overdue warning */}
        {totalOverdue > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            {totalOverdue} {totalOverdue === 1 ? "item vencido" : "itens vencidos"} (excluídos do cálculo)
          </div>
        )}

        {/* Ranking table */}
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
                  {showOnlyBad ? "Nenhum cliente com classificação Ruim" : "Nenhum cliente encontrado"}
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
  );
}
