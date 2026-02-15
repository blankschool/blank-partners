import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addWeeks, startOfWeek, endOfWeek, format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface WeekSelectorProps {
  currentWeek: Date;
  onWeekChange: (date: Date) => void;
}

export function WeekSelector({ currentWeek, onWeekChange }: WeekSelectorProps) {
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });

  // Only show Mon-Fri
  const friday = new Date(weekStart);
  friday.setDate(friday.getDate() + 4);

  const label = `${format(weekStart, "dd", { locale: ptBR })} - ${format(friday, "dd MMM yyyy", { locale: ptBR })}`;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onWeekChange(addWeeks(currentWeek, -1))}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium min-w-[180px] text-center">
        {label}
      </span>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onWeekChange(addWeeks(currentWeek, 1))}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
