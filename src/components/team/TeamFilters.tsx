import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import type { TeamType, SeniorityLevel } from "@/hooks/useUsers";
import type { TeamMember } from "@/hooks/useTeamMembers";
import { SENIORITY_LEVELS } from "@/hooks/useTeamMembers";

interface TeamFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedArea: string;
  onAreaChange: (value: string) => void;
  selectedSeniority: string;
  onSeniorityChange: (value: string) => void;
  selectedLeader: string;
  onLeaderChange: (value: string) => void;
  areas: TeamType[];
  leaders: TeamMember[];
}

export function TeamFilters({
  searchQuery,
  onSearchChange,
  selectedArea,
  onAreaChange,
  selectedSeniority,
  onSeniorityChange,
  selectedLeader,
  onLeaderChange,
  areas,
  leaders,
}: TeamFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative max-w-sm flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por nome, email ou cliente..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={selectedArea} onValueChange={onAreaChange}>
        <SelectTrigger className="w-[160px] bg-background">
          <SelectValue placeholder="Área" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border z-50">
          <SelectItem value="all">Todas as áreas</SelectItem>
          {areas.map((area) => (
            <SelectItem key={area} value={area}>
              {area}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedSeniority} onValueChange={onSeniorityChange}>
        <SelectTrigger className="w-[160px] bg-background">
          <SelectValue placeholder="Senioridade" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border z-50">
          <SelectItem value="all">Todas</SelectItem>
          {SENIORITY_LEVELS.map((level) => (
            <SelectItem key={level} value={level}>
              {level}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedLeader} onValueChange={onLeaderChange}>
        <SelectTrigger className="w-[180px] bg-background">
          <SelectValue placeholder="Líder" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border z-50">
          <SelectItem value="all">Todos os líderes</SelectItem>
          {leaders.map((leader) => (
            <SelectItem key={leader.id} value={leader.id}>
              {leader.full_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
