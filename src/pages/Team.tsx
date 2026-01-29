import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { useCurrentUserRole } from "@/hooks/useCurrentUserRole";
import { TeamMemberCard } from "@/components/team/TeamMemberCard";
import { TeamFilters } from "@/components/team/TeamFilters";

const Team = () => {
  const { teamMembers, areas, leaders, isLoading, error } = useTeamMembers();
  const { isAdmin } = useCurrentUserRole();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedSeniority, setSelectedSeniority] = useState("all");
  const [selectedLeader, setSelectedLeader] = useState("all");

  const filteredTeam = useMemo(() => {
    return teamMembers.filter((member) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          member.full_name.toLowerCase().includes(query) ||
          member.email.toLowerCase().includes(query) ||
          member.clients.some((c) => c.name.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Area filter
      if (selectedArea !== "all" && member.area !== selectedArea) {
        return false;
      }

      // Seniority filter
      if (selectedSeniority !== "all" && member.seniority !== selectedSeniority) {
        return false;
      }

      // Leader filter
      if (selectedLeader !== "all" && member.leader_id !== selectedLeader) {
        return false;
      }

      return true;
    });
  }, [teamMembers, searchQuery, selectedArea, selectedSeniority, selectedLeader]);

  // Stats
  const stats = useMemo(() => {
    const byArea = new Map<string, number>();
    const bySeniority = new Map<string, number>();

    teamMembers.forEach((member) => {
      if (member.area) {
        byArea.set(member.area, (byArea.get(member.area) || 0) + 1);
      }
      if (member.seniority) {
        bySeniority.set(member.seniority, (bySeniority.get(member.seniority) || 0) + 1);
      }
    });

    return {
      total: teamMembers.length,
      byArea,
      bySeniority,
    };
  }, [teamMembers]);

  if (isLoading) {
    return (
      <AppLayout title="Equipe">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="Equipe">
        <div className="flex items-center justify-center h-64 text-destructive">
          Erro ao carregar equipe: {error.message}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Equipe">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TeamFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedArea={selectedArea}
            onAreaChange={setSelectedArea}
            selectedSeniority={selectedSeniority}
            onSeniorityChange={setSelectedSeniority}
            selectedLeader={selectedLeader}
            onLeaderChange={setSelectedLeader}
            areas={areas}
            leaders={leaders}
          />
          {isAdmin && (
            <Button className="gap-2 shrink-0">
              <Plus className="h-4 w-4" />
              Adicionar Membro
            </Button>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Membros
              </p>
              <p className="mt-2 font-serif text-5xl font-normal tracking-tight text-foreground">
                {stats.total}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Total na equipe</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Sênior
              </p>
              <p className="mt-2 font-serif text-5xl font-normal tracking-tight text-success">
                {stats.bySeniority.get("Sênior") || 0}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Colaboradores sênior</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Pleno
              </p>
              <p className="mt-2 font-serif text-5xl font-normal tracking-tight text-accent-orange">
                {stats.bySeniority.get("Pleno") || 0}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Colaboradores pleno</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Júnior
              </p>
              <p className="mt-2 font-serif text-5xl font-normal tracking-tight text-primary">
                {stats.bySeniority.get("Júnior") || 0}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Colaboradores júnior</p>
            </CardContent>
          </Card>
        </div>

        {/* Team Grid */}
        {filteredTeam.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            {teamMembers.length === 0
              ? "Nenhum membro na equipe ainda. Importe os dados do CSV para começar."
              : "Nenhum membro encontrado com os filtros selecionados."}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTeam.map((member) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                isAdmin={isAdmin}
                onEdit={() => {
                  // TODO: Open edit dialog
                }}
                onDelete={() => {
                  // TODO: Open delete confirmation
                }}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Team;
