import { Check, Minus, ExternalLink } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Report } from "@/hooks/useReports";

interface ReportCellProps {
  report?: Report;
  onClick: () => void;
}

export function ReportCell({ report, onClick }: ReportCellProps) {
  if (!report || !report.report_link) {
    return (
      <button
        onClick={onClick}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 text-muted-foreground/40 transition-colors hover:border-primary/50 hover:text-primary/60"
      >
        <Minus className="h-4 w-4" />
      </button>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
      <button
        onClick={onClick}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary transition-colors hover:bg-primary/25"
      >
        <Check className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="flex items-center gap-1.5 text-xs">
        <ExternalLink className="h-3 w-3" />
        {report.title || "Ver relatório"}
      </TooltipContent>
    </Tooltip>
  );
}
