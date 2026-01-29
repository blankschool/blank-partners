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
    <div className="grid grid-cols-4 gap-4 w-full">
      {/* All items stat */}
      <button
        onClick={() => onGroupClick(null)}
        className={cn(
          "flex flex-col items-start w-full p-5 rounded-2xl border transition-all",
          selectedGroup === null
            ? "border-primary bg-primary/10 shadow-sm"
            : "border-border bg-card hover:border-primary/50"
        )}
      >
        <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Todos</span>
        <span className="mt-2 font-serif text-5xl font-normal tracking-tight text-foreground">{items.length}</span>
      </button>

      {STAGE_GROUPS.map(group => {
        const count = groupCounts[group.key];
        const isSelected = selectedGroup === group.key;

        return (
          <button
            key={group.key}
            onClick={() => onGroupClick(isSelected ? null : group.key)}
            className={cn(
              "flex flex-col items-start w-full p-5 rounded-2xl border transition-all",
              isSelected
                ? `${group.borderColor} ${group.bgColor} shadow-sm`
                : "border-border bg-card hover:border-primary/50"
            )}
          >
            <span className={cn("text-[10px] font-medium uppercase tracking-widest truncate max-w-[100px]", isSelected ? group.color : "text-muted-foreground")}>
              {group.label}
            </span>
            <span className={cn("mt-2 font-serif text-5xl font-normal tracking-tight", isSelected ? group.color : "text-foreground")}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
