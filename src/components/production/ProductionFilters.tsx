import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { CONTENT_STAGES } from "@/lib/contentStages";

interface ProductionFiltersProps {
  teamMembers: { id: string; full_name: string; position: string | null }[];
  selectedMemberId: string | null;
  onMemberChange: (id: string) => void;
  stageFilters: string[];
  onStageFiltersChange: (stages: string[]) => void;
}

export function ProductionFilters({
  teamMembers,
  selectedMemberId,
  onMemberChange,
  stageFilters,
  onStageFiltersChange,
}: ProductionFiltersProps) {
  const toggleStage = (key: string) => {
    if (stageFilters.includes(key)) {
      onStageFiltersChange(stageFilters.filter((s) => s !== key));
    } else {
      onStageFiltersChange([...stageFilters, key]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={selectedMemberId || ""}
          onValueChange={onMemberChange}
        >
          <SelectTrigger className="w-[260px]">
            <SelectValue placeholder="Selecione um membro..." />
          </SelectTrigger>
          <SelectContent>
            {teamMembers.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.full_name}
                {m.position && (
                  <span className="text-muted-foreground ml-1 text-xs">
                    · {m.position}
                  </span>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {CONTENT_STAGES.map((stage) => {
          const isActive = stageFilters.includes(stage.key);
          return (
            <Badge
              key={stage.key}
              variant={isActive ? "default" : "outline"}
              className={`cursor-pointer text-xs transition-all ${
                isActive
                  ? `${stage.bgColor} ${stage.color} ${stage.borderColor} border`
                  : "hover:bg-accent"
              }`}
              onClick={() => toggleStage(stage.key)}
            >
              {stage.label}
              {isActive && <X className="h-3 w-3 ml-1" />}
            </Badge>
          );
        })}
        {stageFilters.length > 0 && (
          <Badge
            variant="outline"
            className="cursor-pointer text-xs hover:bg-destructive/10 text-destructive"
            onClick={() => onStageFiltersChange([])}
          >
            Limpar filtros
          </Badge>
        )}
      </div>
    </div>
  );
}
