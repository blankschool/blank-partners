import { ContentItem } from "@/hooks/useGoogleSheetsContent";
import { STAGE_GROUPS, normalizeStatus } from "@/lib/contentStages";
import { cn } from "@/lib/utils";

interface StageStatsPanelProps {
  items: ContentItem[];
  selectedGroup: string | null;
  onGroupClick: (group: string | null) => void;
}

export function StageStatsPanel({ items, selectedGroup, onGroupClick }: StageStatsPanelProps) {
  // Count items per group
  const groupCounts = STAGE_GROUPS.reduce((acc, group) => {
    acc[group.key] = items.filter(item => {
      const normalizedStatus = normalizeStatus(item.status);
      return group.stages.includes(normalizedStatus);
    }).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex flex-wrap gap-3">
      {/* All items stat */}
      <button
        onClick={() => onGroupClick(null)}
        className={cn(
          "flex flex-col items-center justify-center min-w-[100px] p-4 rounded-xl border transition-all",
          selectedGroup === null
            ? "border-primary bg-primary/10 shadow-sm"
            : "border-border bg-card hover:border-primary/50"
        )}
      >
        <span className="text-2xl font-serif">{items.length}</span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Todos</span>
      </button>

      {STAGE_GROUPS.map(group => {
        const count = groupCounts[group.key];
        const isSelected = selectedGroup === group.key;

        return (
          <button
            key={group.key}
            onClick={() => onGroupClick(isSelected ? null : group.key)}
            className={cn(
              "flex flex-col items-center justify-center min-w-[100px] p-4 rounded-xl border transition-all",
              isSelected
                ? `${group.borderColor} ${group.bgColor} shadow-sm`
                : "border-border bg-card hover:border-primary/50"
            )}
          >
            <span className={cn("text-2xl font-serif", isSelected ? group.color : "")}>
              {count}
            </span>
            <span className={cn("text-[10px] uppercase tracking-widest truncate max-w-[80px]", isSelected ? group.color : "text-muted-foreground")}>
              {group.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
