import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Report } from "@/hooks/useReports";

interface ReportDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: Report | null;
}

export function ReportDetailDialog({ open, onOpenChange, report }: ReportDetailDialogProps) {
  if (!report) return null;

  const periodLabel = report.report_period === "weekly" ? "Semanal" : "Mensal";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{report.title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>{report.client_name}</span>
          <Badge variant="secondary">{periodLabel}</Badge>
          <span>{format(new Date(report.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
        </div>
        <div className="whitespace-pre-wrap text-sm leading-relaxed pt-2">
          {report.content}
        </div>
      </DialogContent>
    </Dialog>
  );
}
