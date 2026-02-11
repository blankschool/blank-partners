import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Eye, Pencil, Trash2, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Report } from "@/hooks/useReports";

interface ReportCardProps {
  report: Report;
  onView: (r: Report) => void;
  onEdit: (r: Report) => void;
  onDelete: (r: Report) => void;
}

export function ReportCard({ report, onView, onEdit, onDelete }: ReportCardProps) {
  const periodLabel = report.report_period === "weekly" ? "Semanal" : "Mensal";

  return (
    <Card className="group">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0">
            <h3 className="font-serif text-lg leading-tight truncate">{report.title}</h3>
            <p className="text-sm text-muted-foreground truncate">{report.client_name}</p>
          </div>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {periodLabel}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3">{report.content}</p>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {format(new Date(report.created_at), "dd MMM yyyy", { locale: ptBR })}
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onView(report)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(report)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(report)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
