import { ContentItem } from "@/hooks/useGoogleSheetsContent";
import { CONTENT_STAGES, normalizeStatus } from "@/lib/contentStages";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface StageStatsPanelProps {
  items: ContentItem[];
  selectedStage: string | null;
  onStageClick: (stage: string | null) => void;
}

export function StageStatsPanel({ items, selectedStage, onStageClick }: StageStatsPanelProps) {
  // Count items per stage
  const stageCounts = CONTENT_STAGES.reduce((acc, stage) => {
    acc[stage.key] = items.filter(
      item => normalizeStatus(item.status) === stage.key
    ).length;
    return acc;
  }, {} as Record<string, number>);

  // Filter to only show stages that have items or are commonly used
  const visibleStages = CONTENT_STAGES.filter(
    stage => stageCounts[stage.key] > 0 || ['backlog', 'escrita', 'publicado'].includes(stage.key)
  );

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-3 pb-2">
        {/* All items stat */}
        <button
          onClick={() => onStageClick(null)}
          className={cn(
            "flex flex-col items-center justify-center min-w-[100px] p-4 rounded-xl border transition-all",
            selectedStage === null
              ? "border-primary bg-primary/10 shadow-sm"
              : "border-border bg-card hover:border-primary/50"
          )}
        >
          <span className="text-2xl font-serif">{items.length}</span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Todos</span>
        </button>

        {visibleStages.map(stage => {
          const count = stageCounts[stage.key];
          const isSelected = selectedStage === stage.key;

          return (
            <button
              key={stage.key}
              onClick={() => onStageClick(isSelected ? null : stage.key)}
              className={cn(
                "flex flex-col items-center justify-center min-w-[100px] p-4 rounded-xl border transition-all",
                isSelected
                  ? `${stage.borderColor} ${stage.bgColor} shadow-sm`
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <span className={cn("text-2xl font-serif", isSelected ? stage.color : "")}>
                {count}
              </span>
              <span className={cn("text-[10px] uppercase tracking-widest truncate max-w-[80px]", isSelected ? stage.color : "text-muted-foreground")}>
                {stage.label}
              </span>
            </button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
