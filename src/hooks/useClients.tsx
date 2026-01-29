import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  return useQuery({
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
};
