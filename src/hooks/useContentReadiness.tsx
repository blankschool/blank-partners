import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { normalizeStatus } from "@/lib/contentStages";

export interface AgingRecord {
  contentId: string;
  client: string;
  status: string;
  normalizedStatus: string;
  agingDays: number;
  updatedAt: string;
}

export interface AgingStats {
  stage: string;
  stageLabel: string;
  avgDays: number;
  p90Days: number;
  count: number;
  alertThreshold: number;
  isAlert: boolean;
}

export interface ClientAging {
  client: string;
  avgDays: number;
  count: number;
}

const AGING_THRESHOLDS: Record<string, number> = {
  "em briefing": 3,
  "criacao design": 5,
  "ajustes criacao design": 5,
  "edicao de video": 5,
  "ajustes edicao de video": 5,
};

const STAGE_LABELS: Record<string, string> = {
  "em briefing": "Em Briefing",
  "criacao design": "Criação Design",
  "ajustes criacao design": "Ajustes Design",
  "edicao de video": "Edição de Vídeo",
  "ajustes edicao de video": "Ajustes Vídeo",
};

const ACTIVE_STAGES = new Set(Object.keys(AGING_THRESHOLDS));

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

async function fetchAgingData(): Promise<AgingRecord[]> {
  const { data, error } = await supabase
    .from("painel_de_conteudos")
    .select('"id do conteúdo", cliente, status, estagio, updated_at')
    .not("updated_at", "is", null);

  if (error) throw new Error(error.message);

  const now = new Date();
  const records: AgingRecord[] = [];

  (data ?? []).forEach((row) => {
    const rawStatus = row.status || row.estagio || "";
    const normalized = normalizeStatus(rawStatus);
    if (!ACTIVE_STAGES.has(normalized)) return;

    const updated = new Date(row.updated_at!);
    const diffMs = now.getTime() - updated.getTime();
    const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

    records.push({
      contentId: row["id do conteúdo"],
      client: row.cliente,
      status: rawStatus,
      normalizedStatus: normalized,
      agingDays: diffDays,
      updatedAt: row.updated_at!,
    });
  });

  return records;
}

export function computeAgingStats(records: AgingRecord[]): AgingStats[] {
  const byStage: Record<string, number[]> = {};
  records.forEach((r) => {
    if (!byStage[r.normalizedStatus]) byStage[r.normalizedStatus] = [];
    byStage[r.normalizedStatus].push(r.agingDays);
  });

  return Object.entries(byStage)
    .map(([stage, days]) => {
      const sorted = [...days].sort((a, b) => a - b);
      const avg = days.reduce((s, d) => s + d, 0) / days.length;
      const p90 = percentile(sorted, 90);
      const threshold = AGING_THRESHOLDS[stage] ?? 5;
      return {
        stage,
        stageLabel: STAGE_LABELS[stage] ?? stage,
        avgDays: Math.round(avg * 10) / 10,
        p90Days: p90,
        count: days.length,
        alertThreshold: threshold,
        isAlert: avg > threshold,
      };
    })
    .sort((a, b) => b.avgDays - a.avgDays);
}

export function computeClientAging(records: AgingRecord[]): ClientAging[] {
  const byClient: Record<string, number[]> = {};
  records.forEach((r) => {
    if (!byClient[r.client]) byClient[r.client] = [];
    byClient[r.client].push(r.agingDays);
  });

  return Object.entries(byClient)
    .map(([client, days]) => ({
      client,
      avgDays: Math.round((days.reduce((s, d) => s + d, 0) / days.length) * 10) / 10,
      count: days.length,
    }))
    .sort((a, b) => b.avgDays - a.avgDays);
}

export function useContentReadiness() {
  return useQuery({
    queryKey: ["content-readiness-aging"],
    queryFn: fetchAgingData,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
