import { useState, useMemo } from "react";
import { ClipboardList, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useReports, type Report } from "@/hooks/useReports";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { ReportCard } from "@/components/reports/ReportCard";
import { CreateReportDialog } from "@/components/reports/CreateReportDialog";
import { ReportDetailDialog } from "@/components/reports/ReportDetailDialog";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";

export default function Reports() {
  const { reports, isLoading, createReport, updateReport, deleteReport } = useReports();
  const { toast } = useToast();

  // Clients for selects
  const { data: clients = [] } = useQuery({
    queryKey: ["clients-list"],
    queryFn: async () => {
      const { data } = await supabase.from("clients").select("id, name").order("name");
      return data ?? [];
    },
  });

  // Filters
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("all");
  const [clientId, setClientId] = useState("all");

  // Dialogs
  const [createOpen, setCreateOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [viewingReport, setViewingReport] = useState<Report | null>(null);
  const [deletingReport, setDeletingReport] = useState<Report | null>(null);

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (period !== "all" && r.report_period !== period) return false;
      if (clientId !== "all" && r.client_id !== clientId) return false;
      return true;
    });
  }, [reports, search, period, clientId]);

  const handleSave = (data: any) => {
    if (data.id) {
      updateReport.mutate(data, {
        onSuccess: () => {
          toast({ title: "Relatório atualizado" });
          setEditingReport(null);
        },
        onError: () => toast({ title: "Erro ao atualizar", variant: "destructive" }),
      });
    } else {
      createReport.mutate(data, {
        onSuccess: () => {
          toast({ title: "Relatório criado" });
          setCreateOpen(false);
        },
        onError: () => toast({ title: "Erro ao criar", variant: "destructive" }),
      });
    }
  };

  const handleDelete = () => {
    if (!deletingReport) return;
    deleteReport.mutate(deletingReport.id, {
      onSuccess: () => {
        toast({ title: "Relatório excluído" });
        setDeletingReport(null);
      },
      onError: () => toast({ title: "Erro ao excluir", variant: "destructive" }),
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Relatórios</h1>
              <p className="text-sm text-muted-foreground">Gerencie relatórios semanais e mensais dos clientes</p>
            </div>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Relatório
          </Button>
        </div>

        {/* Filters */}
        <ReportFilters
          search={search}
          onSearchChange={setSearch}
          period={period}
          onPeriodChange={setPeriod}
          clientId={clientId}
          onClientIdChange={setClientId}
          clients={clients}
        />

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ClipboardList className="h-12 w-12 text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">Nenhum relatório encontrado.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => (
              <ReportCard
                key={r.id}
                report={r}
                onView={setViewingReport}
                onEdit={(r) => setEditingReport(r)}
                onDelete={(r) => setDeletingReport(r)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Dialog */}
      <CreateReportDialog
        open={createOpen || !!editingReport}
        onOpenChange={(open) => {
          if (!open) {
            setCreateOpen(false);
            setEditingReport(null);
          }
        }}
        onSave={handleSave}
        isSaving={createReport.isPending || updateReport.isPending}
        clients={clients}
        editingReport={editingReport}
      />

      {/* Detail Dialog */}
      <ReportDetailDialog
        open={!!viewingReport}
        onOpenChange={(open) => !open && setViewingReport(null)}
        report={viewingReport}
      />

      {/* Delete Confirm */}
      <DeleteConfirmDialog
        open={!!deletingReport}
        onOpenChange={(open) => !open && setDeletingReport(null)}
        onConfirm={handleDelete}
        title="Excluir Relatório"
        description={`Tem certeza que deseja excluir "${deletingReport?.title}"? Esta ação não pode ser desfeita.`}
      />
    </AppLayout>
  );
}
