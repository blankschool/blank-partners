import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { ClientScopeData } from "@/components/admin/ClientScopeInput";

interface TeamMemberInfo {
  id: string;
  full_name: string;
  area: string | null;
  position: string | null;
}

export interface ClientScope {
  id: string;
  client_id: string;
  instagram: number;
  tiktok_posts: number;
  linkedin_posts: number;
  youtube: number;
  recordings: number;
}

export interface ClientWithStats {
  id: string;
  name: string;
  created_at: string;
  member_count: number;
  members: TeamMemberInfo[];
  scope?: ClientScope;
}

export const useClients = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["clients-with-members"],
    queryFn: async (): Promise<ClientWithStats[]> => {
      // Fetch clients
      const { data: clients, error: clientsError } = await supabase
        .from("clients")
        .select("id, name, created_at")
        .order("name");

      if (clientsError) throw clientsError;

      // Fetch team_member_clients with team member info
      const { data: assignments, error: assignmentsError } = await supabase
        .from("team_member_clients")
        .select(`
          client_id,
          team_members (
            id,
            full_name,
            area,
            position
          )
        `);

      if (assignmentsError) throw assignmentsError;

      // Fetch client scopes
      const { data: scopes, error: scopesError } = await supabase
        .from("client_scopes")
        .select("*");

      if (scopesError) throw scopesError;

      // Map scopes by client_id
      const scopesByClient = new Map<string, ClientScope>();
      scopes?.forEach((scope) => {
        scopesByClient.set(scope.client_id, scope as ClientScope);
      });

      // Map assignments by client_id
      const membersByClient = new Map<string, TeamMemberInfo[]>();
      
      assignments?.forEach((assignment) => {
        const clientId = assignment.client_id;
        const member = assignment.team_members as unknown as TeamMemberInfo | null;
        
        if (member) {
          if (!membersByClient.has(clientId)) {
            membersByClient.set(clientId, []);
          }
          membersByClient.get(clientId)!.push({
            id: member.id,
            full_name: member.full_name,
            area: member.area,
            position: member.position,
          });
        }
      });

      // Merge clients with their members and scopes
      return (clients || []).map((client) => ({
        id: client.id,
        name: client.name,
        created_at: client.created_at,
        members: membersByClient.get(client.id) || [],
        member_count: membersByClient.get(client.id)?.length || 0,
        scope: scopesByClient.get(client.id),
      }));
    },
  });

  const createClientMutation = useMutation({
    mutationFn: async ({ name, scope }: { name: string; scope?: ClientScopeData }) => {
      const { data, error } = await supabase
        .from("clients")
        .insert({ name })
        .select()
        .single();

      if (error) throw error;

      // Create scope if provided
      if (scope) {
        const { error: scopeError } = await supabase
          .from("client_scopes")
          .insert({ client_id: data.id, ...scope });

        if (scopeError) throw scopeError;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients-with-members"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Cliente criado",
        description: "O cliente foi criado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar cliente",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: async ({ id, name, scope }: { id: string; name: string; scope?: ClientScopeData }) => {
      const { error } = await supabase
        .from("clients")
        .update({ name })
        .eq("id", id);

      if (error) throw error;

      // Upsert scope if provided
      if (scope) {
        const { error: scopeError } = await supabase
          .from("client_scopes")
          .upsert({ client_id: id, ...scope }, { onConflict: "client_id" });

        if (scopeError) throw scopeError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients-with-members"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Cliente atualizado",
        description: "O cliente foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar cliente",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients-with-members"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Cliente excluído",
        description: "O cliente foi excluído com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir cliente",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    ...query,
    createClient: createClientMutation.mutate,
    updateClient: updateClientMutation.mutate,
    deleteClient: deleteClientMutation.mutate,
    isCreating: createClientMutation.isPending,
    isUpdating: updateClientMutation.isPending,
    isDeleting: deleteClientMutation.isPending,
  };
};
