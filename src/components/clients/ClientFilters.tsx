import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface TeamMemberOption {
  id: string;
  full_name: string;
}

interface ClientFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedMember: string;
  onMemberChange: (value: string) => void;
  selectedAllocation: string;
  onAllocationChange: (value: string) => void;
  members: TeamMemberOption[];
}

export function ClientFilters({
  searchQuery,
  onSearchChange,
  selectedMember,
  onMemberChange,
  selectedAllocation,
  onAllocationChange,
  members,
}: ClientFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative max-w-sm flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar clientes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={selectedMember} onValueChange={onMemberChange}>
        <SelectTrigger className="w-[180px] bg-background">
          <SelectValue placeholder="Responsável" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border z-50">
          <SelectItem value="all">Todos os responsáveis</SelectItem>
          {members.map((member) => (
            <SelectItem key={member.id} value={member.id}>
              {member.full_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedAllocation} onValueChange={onAllocationChange}>
        <SelectTrigger className="w-[180px] bg-background">
          <SelectValue placeholder="Alocação SM" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border z-50">
          <SelectItem value="all">Todas alocações</SelectItem>
          <SelectItem value="with-sm">Com Social Media</SelectItem>
          <SelectItem value="without-sm">Sem Social Media</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
