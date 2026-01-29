import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TeamMemberInfo {
  id: string;
  full_name: string;
}

export interface ClientWithStats {
  id: string;
  name: string;
  created_at: string;
  member_count: number;
  members: TeamMemberInfo[];
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
            full_name
          )
        `);

      if (assignmentsError) throw assignmentsError;

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
          });
        }
      });

      // Merge clients with their members
      return (clients || []).map((client) => ({
        id: client.id,
        name: client.name,
        created_at: client.created_at,
        members: membersByClient.get(client.id) || [],
        member_count: membersByClient.get(client.id)?.length || 0,
      }));
    },
  });

  const createClientMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from("clients")
        .insert({ name })
        .select()
        .single();

      if (error) throw error;
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
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { error } = await supabase
        .from("clients")
        .update({ name })
        .eq("id", id);

      if (error) throw error;
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
