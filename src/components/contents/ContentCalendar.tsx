import { useMemo, useState } from "react";
import { ContentItem } from "@/hooks/useGoogleSheetsContent";
import { getStageConfig, getPlatformConfig } from "@/lib/contentStages";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  isValid,
  getDay,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ContentCalendarProps {
  items: ContentItem[];
  onDayClick?: (date: Date, dayItems: ContentItem[]) => void;
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  
  // Try ISO format
  try {
    const date = parseISO(dateStr);
    if (isValid(date)) return date;
  } catch {}
  
  // Try DD/MM/YYYY format
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (isValid(date)) return date;
    }
  }
  
  return null;
}

export function ContentCalendar({ items, onDayClick }: ContentCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  // Get days including padding for week alignment
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Group items by date
  const itemsByDate = useMemo(() => {
    const map = new Map<string, ContentItem[]>();
    
    items.forEach(item => {
      const date = parseDate(item.date);
      if (date) {
        const key = format(date, 'yyyy-MM-dd');
        if (!map.has(key)) {
          map.set(key, []);
        }
        map.get(key)!.push(item);
      }
    });
    
    return map;
  }, [items]);

  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  return (
    <Card>
      <CardContent className="p-4">
        {/* Header with navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-medium capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div
              key={day}
              className="text-center text-xs font-medium text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map(day => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayItems = itemsByDate.get(dateKey) || [];
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, new Date());

            return (
              <TooltipProvider key={dateKey}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onDayClick?.(day, dayItems)}
                      className={cn(
                        "aspect-square p-1 rounded-lg text-sm transition-colors relative",
                        "hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring",
                        !isCurrentMonth && "text-muted-foreground/50",
                        isToday && "ring-2 ring-primary"
                      )}
                    >
                      <span className="absolute top-1 left-2 text-xs">
                        {format(day, 'd')}
                      </span>
                      
                      {/* Content dots */}
                      {dayItems.length > 0 && (
                        <div className="absolute bottom-1 left-1 right-1 flex flex-wrap justify-center gap-0.5">
                          {dayItems.slice(0, 4).map((item, idx) => {
                            const stageConfig = getStageConfig(item.status);
                            const platformConfig = getPlatformConfig(item.socialMedia);
                            const dotColor = stageConfig?.bgColor || platformConfig?.bgColor || 'bg-muted';
                            
                            return (
                              <div
                                key={idx}
                                className={cn("w-2 h-2 rounded-full", dotColor)}
                              />
                            );
                          })}
                          {dayItems.length > 4 && (
                            <span className="text-[10px] text-muted-foreground">
                              +{dayItems.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  </TooltipTrigger>
                  {dayItems.length > 0 && (
                    <TooltipContent side="bottom" className="max-w-[250px]">
                      <div className="space-y-2">
                        <p className="font-medium text-sm">{dayItems.length} conteúdo{dayItems.length !== 1 ? 's' : ''}</p>
                        {dayItems.slice(0, 4).map((item, idx) => {
                          const stageConfig = getStageConfig(item.status);
                          return (
                            <div key={idx} className="flex items-center justify-between gap-2">
                              <span className="text-xs truncate max-w-[120px]">
                                {item.client || 'Sem cliente'}
                              </span>
                              {stageConfig && (
                                <span className={cn(
                                  "text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0",
                                  stageConfig.bgColor,
                                  stageConfig.color
                                )}>
                                  {stageConfig.label}
                                </span>
                              )}
                            </div>
                          );
                        })}
                        {dayItems.length > 4 && (
                          <p className="text-xs text-muted-foreground">
                            e mais {dayItems.length - 4}...
                          </p>
                        )}
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
