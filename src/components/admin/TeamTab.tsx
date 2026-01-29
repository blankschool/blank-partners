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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="group relative rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                    {getInitials(member.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-foreground">{member.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
              </div>

              <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
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

            <div className="mt-3 flex flex-wrap gap-2">
              {member.area && (
                <Badge variant="secondary" className="text-xs">
                  {member.area}
                </Badge>
              )}
              {member.seniority && (
                <Badge variant="outline" className="text-xs">
                  {member.seniority}
                </Badge>
              )}
              {member.position && (
                <Badge variant="outline" className="text-xs">
                  <Briefcase className="mr-1 h-3 w-3" />
                  {member.position}
                </Badge>
              )}
            </div>

            {member.start_date && (
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Início: {formatDate(member.start_date)}
              </div>
            )}

            {member.clients.length > 0 && (
              <p className="mt-2 text-xs text-muted-foreground truncate">
                Clientes: {member.clients.map((c) => c.name).join(", ")}
              </p>
            )}
          </div>
        ))}

        {filteredMembers.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            {searchQuery || areaFilter !== "all" || seniorityFilter !== "all"
              ? "Nenhum membro encontrado com esses filtros."
              : "Nenhum membro cadastrado."}
          </div>
        )}
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
