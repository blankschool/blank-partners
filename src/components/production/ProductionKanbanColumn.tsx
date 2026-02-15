import { ProductionCard } from "./ProductionCard";
import type { ContentWithAssignment } from "@/hooks/useProductionBoard";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProductionKanbanColumnProps {
  title: string;
  subtitle?: string;
  items: ContentWithAssignment[];
  dayOfWeek: number | null; // null = backlog
  onDrop: (contentId: string, dayOfWeek: number | null) => void;
  onDragStart: (e: React.DragEvent, contentId: string) => void;
}

export function ProductionKanbanColumn({
  title,
  subtitle,
  items,
  dayOfWeek,
  onDrop,
  onDragStart,
}: ProductionKanbanColumnProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("bg-accent/50");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("bg-accent/50");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-accent/50");
    const contentId = e.dataTransfer.getData("text/plain");
    if (contentId) {
      onDrop(contentId, dayOfWeek);
    }
  };

  return (
    <div
      className="flex flex-col min-w-[200px] flex-1 rounded-xl border bg-muted/30 transition-colors"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="px-3 py-2.5 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <span className="text-xs text-muted-foreground font-medium rounded-full bg-muted px-2 py-0.5">
            {items.length}
          </span>
        </div>
        {subtitle && (
          <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      <ScrollArea className="flex-1 p-2 max-h-[calc(100vh-280px)]">
        <div className="space-y-2">
          {items.map((item) => (
            <ProductionCard
              key={item.contentId}
              item={item}
              onDragStart={onDragStart}
            />
          ))}
          {items.length === 0 && (
            <div className="flex items-center justify-center h-20 text-xs text-muted-foreground">
              Arraste cards aqui
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
