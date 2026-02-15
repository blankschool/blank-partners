import { useState, useMemo } from "react";
import { ClipboardList } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { useReports } from "@/hooks/useReports";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ReportMonthSelector } from "@/components/reports/ReportMonthSelector";
import { ReportTrackingTable } from "@/components/reports/ReportTrackingTable";
import { ReportStatsPanel } from "@/components/reports/ReportStatsPanel";
import { ReportDeliveryChart } from "@/components/reports/ReportDeliveryChart";

function getWeeksForMonth(month: Date) {
  const year = month.getFullYear();
  const m = month.getMonth();
  const lastDay = new Date(year, m + 1, 0).getDate();

  const ranges = [
    { start: 1, end: 7 },
    { start: 8, end: 14 },
    { start: 15, end: 21 },
    { start: 22, end: lastDay },
  ];

  return ranges.map((r, i) => {
    const refDate = new Date(year, m, r.start);
    return {
      label: `Sem ${i + 1}`,
      referenceDate: refDate.toISOString().split("T")[0],
    };
  });
}

export default function Reports() {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const { reports, isLoading, upsertReport, deleteReport } = useReports(selectedMonth);
  const { toast } = useToast();

  const { data: clients = [], isLoading: loadingClients } = useQuery({
    queryKey: ["clients-list"],
    queryFn: async () => {
      const { data } = await supabase.from("clients").select("id, name").order("name");
      return data ?? [];
    },
  });

  const weeks = useMemo(() => getWeeksForMonth(selectedMonth), [selectedMonth]);
  const monthRefDate = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, "0")}-01`;

  const stats = useMemo(() => {
    const numClients = clients.length;
    const totalProjected = numClients * 5;

    const weeklyBreakdown = weeks.map((w, i) => {
      const delivered = reports.filter(
        (r) => r.report_period === "weekly" && r.reference_date === w.referenceDate && r.report_link
      ).length;
      return {
        label: w.label,
        projected: numClients,
        delivered,
        rate: numClients > 0 ? Math.round((delivered / numClients) * 100) : 0,
      };
    });

    const monthlyDelivered = reports.filter(
      (r) => r.report_period === "monthly" && r.report_link
    ).length;

    const monthlyBreakdown = {
      label: "Mensal",
      projected: numClients,
      delivered: monthlyDelivered,
      rate: numClients > 0 ? Math.round((monthlyDelivered / numClients) * 100) : 0,
    };

    const allBreakdown = [...weeklyBreakdown, monthlyBreakdown];
    const totalDelivered = allBreakdown.reduce((s, b) => s + b.delivered, 0);
    const rate = totalProjected > 0 ? Math.round((totalDelivered / totalProjected) * 100) : 0;

    const chartData = allBreakdown.map((b) => ({
      label: b.label,
      projetado: b.projected,
      realizado: b.delivered,
    }));

    return { totalProjected, totalDelivered, rate, pending: totalProjected - totalDelivered, weeklyBreakdown: allBreakdown, chartData };
  }, [clients, reports, weeks]);

  const handleUpsert = (data: { client_id: string; report_period: "weekly" | "monthly"; reference_date: string; report_link: string; title: string }) => {
    upsertReport.mutate(data, {
      onSuccess: () => toast({ title: "Relatório salvo" }),
      onError: () => toast({ title: "Erro ao salvar", variant: "destructive" }),
    });
  };

  const handleDelete = (id: string) => {
    deleteReport.mutate(id, {
      onSuccess: () => toast({ title: "Relatório removido" }),
      onError: () => toast({ title: "Erro ao remover", variant: "destructive" }),
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Relatórios</h1>
              <p className="text-sm text-muted-foreground">Acompanhe os relatórios semanais e mensais de cada cliente</p>
            </div>
          </div>
          <ReportMonthSelector selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
        </div>

        {isLoading || loadingClients ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
          </div>
        ) : (
          <>
            <ReportStatsPanel
              totalProjected={stats.totalProjected}
              totalDelivered={stats.totalDelivered}
              rate={stats.rate}
              pending={stats.pending}
              weeklyBreakdown={stats.weeklyBreakdown}
            />
            <ReportDeliveryChart data={stats.chartData} />
            <ReportTrackingTable
              clients={clients}
              reports={reports}
              weeks={weeks}
              monthReferenceDate={monthRefDate}
              onUpsert={handleUpsert}
              onDelete={handleDelete}
              isSaving={upsertReport.isPending}
            />
          </>
        )}
      </div>
    </AppLayout>
  );
}
