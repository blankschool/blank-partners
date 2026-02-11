import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";

interface ReportMonthSelectorProps {
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
}

export function ReportMonthSelector({ selectedMonth, onMonthChange }: ReportMonthSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={() => onMonthChange(subMonths(selectedMonth, 1))}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="min-w-[140px] text-center font-medium capitalize">
        {format(selectedMonth, "MMMM yyyy", { locale: ptBR })}
      </span>
      <Button variant="outline" size="icon" onClick={() => onMonthChange(addMonths(selectedMonth, 1))}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
