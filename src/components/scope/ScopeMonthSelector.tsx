import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";

interface ScopeMonthSelectorProps {
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
}

export function ScopeMonthSelector({
  selectedMonth,
  onMonthChange,
}: ScopeMonthSelectorProps) {
  const handlePrevious = () => {
    onMonthChange(subMonths(selectedMonth, 1));
  };

  const handleNext = () => {
    onMonthChange(addMonths(selectedMonth, 1));
  };

  const formattedMonth = format(selectedMonth, "MMMM yyyy", { locale: ptBR });

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={handlePrevious}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="min-w-[140px] text-center font-medium capitalize">
        {formattedMonth}
      </span>
      <Button variant="outline" size="icon" onClick={handleNext}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
