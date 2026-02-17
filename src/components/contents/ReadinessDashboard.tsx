import { useMemo, useState } from "react";
import { ContentItem } from "@/hooks/useGoogleSheetsContent";
import {
  useContentReadiness,
  computeAgingStats,
  computeClientAging,
} from "@/hooks/useContentReadiness";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  AlertTriangle,
  Activity,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

// ---------- Types ----------

type HygieneState = "ok" | "vencido" | "final";
type Tier = "A" | "B" | "C" | null;

interface ClassifiedItem {
  item: ContentItem;
  tier: Tier;
  hygiene: HygieneState;
  normalized: string;
}

// ---------- Constants ----------

const TIER_A = new Set(["pronto para postar"]);
const TIER_B = new Set([
  "edicao de video",
  "ajustes edicao de video",
  "criacao design",
  "ajustes criacao design",
]);
const TIER_C = new Set(["em briefing"]);
const FINAL_STATUSES = new Set(["publicado", "cancelado"]);

const WEIGHTS = { A: 1.0, B: 0.7, C: 0.5 } as const;

// ---------- Helpers ----------

function classifyItem(item: ContentItem, today: Date): ClassifiedItem {
  const normalized = normalizeStatus(item.status);

  if (FINAL_STATUSES.has(normalized)) {
    return { item, tier: null, hygiene: "final", normalized };
  }

  const itemDate = item.date ? new Date(item.date + "T00:00:00") : null;
  const isPast = itemDate ? itemDate < today : false;

  if (isPast) {
    return { item, tier: null, hygiene: "vencido", normalized };
  }

  let tier: Tier = null;
  if (TIER_A.has(normalized)) tier = "A";
  else if (TIER_B.has(normalized)) tier = "B";
  else if (TIER_C.has(normalized)) tier = "C";

  return { item, tier, hygiene: "ok", normalized };
}

function isInWindow(dateStr: string, today: Date, days: number): boolean {
  const d = new Date(dateStr + "T00:00:00");
  const end = new Date(today);
  end.setDate(end.getDate() + days);
  return d >= today && d <= end;
}

function countTierACoveredDays(classified: ClassifiedItem[], today: Date): number {
  let count = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const hasTierA = classified.some(
      (c) => c.hygiene === "ok" && c.tier === "A" && c.item.date === dateStr
    );
    if (!hasTierA) break;
    count++;
  }
  return count;
}

// ---------- Component ----------

interface ReadinessDashboardProps {
  items: ContentItem[];
}

export function ReadinessDashboard({ items }: ReadinessDashboardProps) {
  const { data: agingRecords, isLoading: agingLoading } = useContentReadiness();
  const [helpOpen, setHelpOpen] = useState(false);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const classified = useMemo(
    () => items.map((item) => classifyItem(item, today)),
    [items, today]
  );

  // Coverage & RE
  const coverage = useMemo(() => {
    const calc = (days: number) => {
      const inWindow = classified.filter(
        (c) =>
          c.hygiene === "ok" &&
          c.tier !== null &&
          c.item.date &&
          isInWindow(c.item.date, today, days)
      );
      const a = inWindow.filter((c) => c.tier === "A").length;
      const b = inWindow.filter((c) => c.tier === "B").length;
      const c = inWindow.filter((c) => c.tier === "C").length;
      const re = Math.round((WEIGHTS.A * a + WEIGHTS.B * b + WEIGHTS.C * c) * 10) / 10;
      return { a, b, c, total: a + b + c, re };
    };
    return { d7: calc(7), d14: calc(14) };
  }, [classified, today]);

  const tierACoveredDays = useMemo(
    () => countTierACoveredDays(classified, today),
    [classified, today]
  );

  // Hygiene
  const hygiene = useMemo(() => {
    const pastItems = classified.filter(
      (c) => c.hygiene === "vencido" || c.hygiene === "final"
    );
    const vencidos = classified.filter((c) => c.hygiene === "vencido");
    const totalPast = pastItems.length;
    const rate = totalPast > 0 ? Math.round(((totalPast - vencidos.length) / totalPast) * 100) : 100;

    const byClient: Record<string, ClassifiedItem[]> = {};
    vencidos.forEach((c) => {
      if (!byClient[c.item.client]) byClient[c.item.client] = [];
      byClient[c.item.client].push(c);
    });

    return { rate, vencidos, totalPast, byClient };
  }, [classified]);

  // Aging
  const agingStats = useMemo(
    () => (agingRecords ? computeAgingStats(agingRecords) : []),
    [agingRecords]
  );
  const clientAging = useMemo(
    () => (agingRecords ? computeClientAging(agingRecords) : []),
    [agingRecords]
  );

  return (
    <div className="space-y-6 mt-8">
      {/* Section title */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <h2 className="font-serif text-xl text-foreground/80">
          Adiantamento de Conteúdo
        </h2>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Block 1: Coverage / Protection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-600" />
            Proteção próximos 7 / 14 dias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {(["d7", "d14"] as const).map((window) => {
              const label = window === "d7" ? "7 dias" : "14 dias";
              const d = coverage[window];
              return [
                <div
                  key={`${window}-a`}
                  className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-center"
                >
                  <span className="text-[10px] font-medium uppercase tracking-widest text-yellow-700">
                    Tier A · {label}
                  </span>
                  <p className="font-serif text-3xl text-yellow-700 mt-1">{d.a}</p>
                </div>,
                <div
                  key={`${window}-bc`}
                  className="rounded-xl border border-purple-200 bg-purple-50 p-4 text-center"
                >
                  <span className="text-[10px] font-medium uppercase tracking-widest text-purple-700">
                    B + C · {label}
                  </span>
                  <p className="font-serif text-3xl text-purple-700 mt-1">
                    {d.b + d.c}
                  </p>
                  <p className="text-[10px] text-purple-600/70 mt-0.5">
                    RE {d.re}
                  </p>
                </div>,
              ];
            }).flat()}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>
              <strong className="text-foreground">{tierACoveredDays}</strong>{" "}
              {tierACoveredDays === 1 ? "dia coberto" : "dias cobertos"} apenas com
              Tier A (Pronto para Postar)
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Block 2: Bottlenecks */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Gargalos (aging)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {agingLoading ? (
            <p className="text-sm text-muted-foreground">Carregando dados de aging…</p>
          ) : agingStats.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum item em etapas de produção ativas.
            </p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Etapa</TableHead>
                    <TableHead className="text-center">Qtd</TableHead>
                    <TableHead className="text-center">Aging médio</TableHead>
                    <TableHead className="text-center">P90</TableHead>
                    <TableHead className="text-center">Limite</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agingStats.map((s) => (
                    <TableRow key={s.stage}>
                      <TableCell className="font-medium">
                        {s.stageLabel}
                        {s.isAlert && (
                          <Badge
                            variant="destructive"
                            className="ml-2 text-[10px] px-1.5"
                          >
                            alerta
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">{s.count}</TableCell>
                      <TableCell
                        className={`text-center font-medium ${
                          s.isAlert ? "text-destructive" : ""
                        }`}
                      >
                        {s.avgDays}d
                      </TableCell>
                      <TableCell className="text-center">{s.p90Days}d</TableCell>
                      <TableCell className="text-center text-muted-foreground">
                        {s.alertThreshold}d
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {clientAging.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">
                    Ranking clientes por aging médio
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {clientAging.slice(0, 10).map((c) => (
                      <div
                        key={c.client}
                        className="rounded-lg border px-3 py-1.5 text-xs flex items-center gap-1.5"
                      >
                        <span className="font-medium">{c.client}</span>
                        <span className="text-muted-foreground">
                          {c.avgDays}d · {c.count} itens
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Block 3: Hygiene */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Higiene do dado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="rounded-xl border p-4 text-center min-w-[120px]">
              <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Taxa de higiene
              </span>
              <p
                className={`font-serif text-4xl mt-1 ${
                  hygiene.rate >= 80
                    ? "text-emerald-600"
                    : hygiene.rate >= 50
                    ? "text-orange-600"
                    : "text-destructive"
                }`}
              >
                {hygiene.rate}%
              </p>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="flex items-center gap-1.5">
                <XCircle className="h-3.5 w-3.5 text-destructive" />
                <strong className="text-foreground">{hygiene.vencidos.length}</strong>{" "}
                itens vencidos (data passada, status não-final)
              </p>
              <p className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                {hygiene.totalPast} itens com data passada no total
              </p>
            </div>
          </div>

          {hygiene.vencidos.length > 0 && (
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-1 text-sm font-medium text-foreground hover:underline">
                <ChevronDown className="h-4 w-4 transition-transform [[data-state=open]>&]:rotate-180" />
                Ver itens vencidos por cliente ({hygiene.vencidos.length})
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {Object.entries(hygiene.byClient)
                    .sort((a, b) => b[1].length - a[1].length)
                    .map(([client, items]) => (
                      <div key={client}>
                        <p className="text-xs font-semibold mb-1">
                          {client}{" "}
                          <span className="text-muted-foreground font-normal">
                            ({items.length})
                          </span>
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {items.slice(0, 10).map((c, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-[10px] font-normal"
                            >
                              {c.item.date} · {c.item.status}
                            </Badge>
                          ))}
                          {items.length > 10 && (
                            <Badge variant="outline" className="text-[10px]">
                              +{items.length - 10}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </CardContent>
      </Card>

      {/* Block 4: How to interpret */}
      <Card>
        <CardHeader className="pb-0">
          <Collapsible open={helpOpen} onOpenChange={setHelpOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 w-full">
              <HelpCircle className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Como interpretar</CardTitle>
              <ChevronDown
                className={`h-4 w-4 ml-auto text-muted-foreground transition-transform ${
                  helpOpen ? "rotate-180" : ""
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-4 space-y-4 text-sm text-muted-foreground leading-relaxed">
                <div>
                  <p className="font-semibold text-foreground mb-1">
                    Por que Tiers existem?
                  </p>
                  <p>
                    Nem todo conteúdo "em andamento" tem o mesmo grau de prontidão.
                    Tier A (Pronto para Postar) é o mais seguro — pode ser publicado
                    imediatamente. Tier B (em Design/Vídeo) está próximo, mas ainda
                    precisa de execução. Tier C (em Briefing) depende de mais etapas.
                    Separar em tiers evita contar tudo junto e mascarar riscos.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">
                    Por que janela 7/14 dias?
                  </p>
                  <p>
                    Olhar "o mês inteiro" cria falsa segurança: ter 30 itens prontos
                    não ajuda se todos estão na última semana. A janela móvel de 7 e
                    14 dias mostra se os próximos dias estão cobertos — onde o risco
                    real de atraso aparece.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">
                    O que é Ready-Equivalent (RE)?
                  </p>
                  <p>
                    É um índice ponderado que transforma tiers diferentes em uma
                    unidade comparável. 1 item Tier A = 1.0 RE; 1 Tier B = 0.7 RE;
                    1 Tier C = 0.5 RE. Isso permite comparar clientes mesmo que
                    tenham mixes diferentes de estágios.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">
                    Por que higiene importa?
                  </p>
                  <p>
                    Se um conteúdo está marcado como "Pronto para Postar" mas a data
                    já passou, provavelmente ele já foi publicado, cancelado ou
                    reagendado sem atualizar o status. Contá-lo como "adiantado"
                    infla os números e leva a decisões erradas. A regra de higiene
                    exclui esses itens do cálculo.
                  </p>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </CardHeader>
      </Card>
    </div>
  );
}
