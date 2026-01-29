import { useState } from "react";
import { Search, Plus, Pencil, Trash2, Briefcase, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTeamMembers, SENIORITY_LEVELS } from "@/hooks/useTeamMembers";
import { TEAMS } from "@/hooks/useUsers";
import { AddTeamMemberDialog } from "./AddTeamMemberDialog";
import { EditTeamMemberDialog } from "./EditTeamMemberDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import type { TeamMember } from "@/hooks/useTeamMembers";
import type { TeamType, SeniorityLevel } from "@/hooks/useUsers";

export function TeamTab() {
  const {
    teamMembers,
    clients,
    leaders,
    isLoading,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    isCreating,
    isUpdating,
    isDeleting,
  } = useTeamMembers();

  const [searchQuery, setSearchQuery] = useState("");
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [seniorityFilter, setSeniorityFilter] = useState<string>("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null);

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArea = areaFilter === "all" || member.area === areaFilter;
    const matchesSeniority =
      seniorityFilter === "all" || member.seniority === seniorityFilter;
    return matchesSearch && matchesArea && matchesSeniority;
  });

  const getInitials = (name: string) => {
    const words = name.split(" ");
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("pt-BR");
  };

  const handleDelete = () => {
    if (deletingMember) {
      deleteTeamMember(deletingMember.id);
      setDeletingMember(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar membros..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          <Select value={areaFilter} onValueChange={setAreaFilter}>
            <SelectTrigger className="w-40 bg-background">
              <SelectValue placeholder="Área" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50">
              <SelectItem value="all">Todas as áreas</SelectItem>
              {TEAMS.map((team) => (
                <SelectItem key={team} value={team}>
                  {team}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={seniorityFilter} onValueChange={setSeniorityFilter}>
            <SelectTrigger className="w-40 bg-background">
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
        </div>

        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Membro
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Header row */}
        <div className="flex items-center gap-4 px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border bg-muted/30">
          <span className="w-8"></span>
          <span className="flex-1 min-w-0">Nome</span>
          <span className="w-48 hidden sm:block">Email</span>
          <span className="w-24 hidden md:block text-center">Área</span>
          <span className="w-20 hidden lg:block text-center">Senioridade</span>
          <span className="w-28 hidden xl:block">Cargo</span>
          <span className="w-20 text-right">Ações</span>
        </div>

        {/* List items */}
        <div className="divide-y divide-border">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/50"
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                  {getInitials(member.full_name)}
                </AvatarFallback>
              </Avatar>

              <span className="flex-1 min-w-0 font-medium text-foreground truncate">
                {member.full_name}
              </span>

              <span className="w-48 hidden sm:block text-sm text-muted-foreground truncate">
                {member.email}
              </span>

              <span className="w-24 hidden md:flex justify-center">
                {member.area && (
                  <Badge variant="secondary" className="text-xs">
                    {member.area}
                  </Badge>
                )}
              </span>

              <span className="w-20 hidden lg:flex justify-center">
                {member.seniority && (
                  <Badge variant="outline" className="text-xs">
                    {member.seniority}
                  </Badge>
                )}
              </span>

              <span className="w-28 hidden xl:block text-sm text-muted-foreground truncate">
                {member.position || "-"}
              </span>

              <div className="w-20 flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setEditingMember(member)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => setDeletingMember(member)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {filteredMembers.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery || areaFilter !== "all" || seniorityFilter !== "all"
                ? "Nenhum membro encontrado com esses filtros."
                : "Nenhum membro cadastrado."}
            </div>
          )}
        </div>
      </div>

      <AddTeamMemberDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSave={createTeamMember}
        clients={clients}
        leaders={teamMembers}
        isLoading={isCreating}
      />

      <EditTeamMemberDialog
        member={editingMember}
        open={!!editingMember}
        onOpenChange={(open) => !open && setEditingMember(null)}
        onSave={updateTeamMember}
        clients={clients}
        leaders={teamMembers}
        isLoading={isUpdating}
      />

      <DeleteConfirmDialog
        open={!!deletingMember}
        onOpenChange={(open) => !open && setDeletingMember(null)}
        title="Excluir Membro"
        description={`Tem certeza que deseja excluir "${deletingMember?.full_name}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
