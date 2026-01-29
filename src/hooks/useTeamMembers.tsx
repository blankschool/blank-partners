import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { TeamType, SeniorityLevel } from "@/hooks/useUsers";

export interface Client {
  id: string;
  name: string;
}

export interface TeamMember {
  id: string;
  profile_id: string | null;
  full_name: string;
  email: string;
  birth_date: string | null;
  start_date: string | null;
  area: TeamType | null;
  position: string | null;
  seniority: SeniorityLevel | null;
  leader_id: string | null;
  squad: string | null;
  created_at: string;
  updated_at: string;
  leader?: { full_name: string } | null;
  clients: Client[];
}

export interface CreateTeamMemberData {
  full_name: string;
  email: string;
  birth_date?: string | null;
  start_date?: string | null;
  area?: TeamType | null;
  position?: string | null;
  seniority?: SeniorityLevel | null;
  leader_id?: string | null;
  squad?: string | null;
  client_ids?: string[];
}

export interface UpdateTeamMemberData extends CreateTeamMemberData {
  id: string;
}

export function useTeamMembers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: teamMembers, isLoading: teamMembersLoading, error } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      // Fetch team members (no self-join - PostgREST doesn't handle it well)
      const { data: membersData, error: membersError } = await supabase
        .from("team_members")
        .select("*")
        .order("full_name");

      if (membersError) throw membersError;

      // Fetch all client assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from("team_member_clients")
        .select(`
          team_member_id,
          clients(id, name)
        `);

      if (assignmentsError) throw assignmentsError;

      // Build a map of team_member_id -> clients[]
      const clientsMap = new Map<string, Client[]>();
      assignmentsData?.forEach((assignment) => {
        const existing = clientsMap.get(assignment.team_member_id) || [];
        if (assignment.clients) {
          existing.push(assignment.clients as unknown as Client);
        }
        clientsMap.set(assignment.team_member_id, existing);
      });

      // Create a map for leader lookup
      const leaderMap = new Map<string, string>();
      membersData.forEach((member) => {
        leaderMap.set(member.id, member.full_name);
      });

      // Merge clients and leader into team members
      return membersData.map((member) => {
        const leaderName = member.leader_id ? leaderMap.get(member.leader_id) : null;

        return {
          ...member,
          leader: leaderName ? { full_name: leaderName } : null,
          clients: clientsMap.get(member.id) || [],
        };
      }) as TeamMember[];
    },
  });

  const { data: clients, isLoading: clientsLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Client[];
    },
  });

  const createTeamMemberMutation = useMutation({
    mutationFn: async (data: CreateTeamMemberData) => {
      const { client_ids, ...memberData } = data;
      
      // Insert team member
      const { data: newMember, error: memberError } = await supabase
        .from("team_members")
        .insert(memberData)
        .select()
        .single();

      if (memberError) throw memberError;

      // Insert client assignments
      if (client_ids && client_ids.length > 0) {
        const assignments = client_ids.map((clientId) => ({
          team_member_id: newMember.id,
          client_id: clientId,
        }));

        const { error: assignError } = await supabase
          .from("team_member_clients")
          .insert(assignments);

        if (assignError) throw assignError;
      }

      return newMember;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      toast({
        title: "Membro criado",
        description: "O membro da equipe foi criado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar membro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateTeamMemberMutation = useMutation({
    mutationFn: async (data: UpdateTeamMemberData) => {
      const { id, client_ids, ...memberData } = data;

      // Update team member
      const { error: memberError } = await supabase
        .from("team_members")
        .update(memberData)
        .eq("id", id);

      if (memberError) throw memberError;

      // Update client assignments if provided
      if (client_ids !== undefined) {
        // Remove existing assignments
        const { error: deleteError } = await supabase
          .from("team_member_clients")
          .delete()
          .eq("team_member_id", id);

        if (deleteError) throw deleteError;

        // Insert new assignments
        if (client_ids.length > 0) {
          const assignments = client_ids.map((clientId) => ({
            team_member_id: id,
            client_id: clientId,
          }));

          const { error: assignError } = await supabase
            .from("team_member_clients")
            .insert(assignments);

          if (assignError) throw assignError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      toast({
        title: "Membro atualizado",
        description: "O membro da equipe foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar membro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTeamMemberMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      toast({
        title: "Membro removido",
        description: "O membro da equipe foi removido com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao remover membro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Get unique areas from team members
  const areas = teamMembers
    ? [...new Set(teamMembers.map((m) => m.area).filter(Boolean))] as TeamType[]
    : [];

  // Get unique leaders from team members
  const leaders = teamMembers
    ? teamMembers.filter((m) => teamMembers.some((other) => other.leader_id === m.id))
    : [];

  return {
    teamMembers: teamMembers ?? [],
    clients: clients ?? [],
    areas,
    leaders,
    isLoading: teamMembersLoading || clientsLoading,
    error,
    createTeamMember: createTeamMemberMutation.mutate,
    updateTeamMember: updateTeamMemberMutation.mutate,
    deleteTeamMember: deleteTeamMemberMutation.mutate,
    isCreating: createTeamMemberMutation.isPending,
    isUpdating: updateTeamMemberMutation.isPending,
    isDeleting: deleteTeamMemberMutation.isPending,
  };
}

export const SENIORITY_LEVELS: SeniorityLevel[] = ["Júnior", "Pleno", "Sênior"];
