import { useState, useMemo } from "react";
import { Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { useMeetings } from "@/hooks/useMeetings";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ReportMonthSelector } from "@/components/reports/ReportMonthSelector";
import { MeetingTrackingTable } from "@/components/meetings/MeetingTrackingTable";

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

export default function Meetings() {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const { meetings, isLoading, upsertMeeting, deleteMeeting } = useMeetings(selectedMonth);
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

  const handleUpsert = (data: { client_id: string; meeting_period: "weekly" | "monthly"; meeting_date: string; meeting_link: string; title: string; description: string }) => {
    upsertMeeting.mutate(data, {
      onSuccess: () => toast({ title: "Reunião salva" }),
      onError: () => toast({ title: "Erro ao salvar", variant: "destructive" }),
    });
  };

  const handleDelete = (id: string) => {
    deleteMeeting.mutate(id, {
      onSuccess: () => toast({ title: "Reunião removida" }),
      onError: () => toast({ title: "Erro ao remover", variant: "destructive" }),
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Reuniões</h1>
              <p className="text-sm text-muted-foreground">Acompanhe as reuniões semanais e mensais de cada cliente</p>
            </div>
          </div>
          <ReportMonthSelector selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
        </div>

        {isLoading || loadingClients ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
          </div>
        ) : (
          <MeetingTrackingTable
            clients={clients}
            meetings={meetings}
            weeks={weeks}
            monthReferenceDate={monthRefDate}
            onUpsert={handleUpsert}
            onDelete={handleDelete}
            isSaving={upsertMeeting.isPending}
          />
        )}
      </div>
    </AppLayout>
  );
}
