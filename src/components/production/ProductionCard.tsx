import { Badge } from "@/components/ui/badge";
import { getStageConfig, getPlatformConfig } from "@/lib/contentStages";
import type { ContentWithAssignment } from "@/hooks/useProductionBoard";

interface ProductionCardProps {
  item: ContentWithAssignment;
  onDragStart: (e: React.DragEvent, contentId: string) => void;
}

export function ProductionCard({ item, onDragStart }: ProductionCardProps) {
  const stageConfig = item.estagio ? getStageConfig(item.estagio) : null;
  const platformConfig = item.plataforma
    ? getPlatformConfig(item.plataforma)
    : null;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item.contentId)}
      className="rounded-lg border bg-card p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow space-y-2"
    >
      <p className="text-sm font-semibold text-foreground truncate">
        {item.cliente}
      </p>
      {(item.formato || item.titulo) && (
        <p className="text-xs text-muted-foreground truncate">
          {item.formato || item.titulo}
        </p>
      )}
      <div className="flex flex-wrap gap-1">
        {stageConfig && (
          <Badge
            variant="outline"
            className={`text-[10px] px-1.5 py-0 ${stageConfig.bgColor} ${stageConfig.color} ${stageConfig.borderColor}`}
          >
            {stageConfig.label}
          </Badge>
        )}
        {platformConfig && (
          <Badge
            variant="outline"
            className={`text-[10px] px-1.5 py-0 ${platformConfig.bgColor} ${platformConfig.color}`}
          >
            {platformConfig.label}
          </Badge>
        )}
      </div>
    </div>
  );
}
