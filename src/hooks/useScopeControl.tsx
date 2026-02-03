import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, startOfMonth } from "date-fns";

export interface ClientWithScope {
  id: string;
  name: string;
  scope: {
    instagram: number;
    tiktok_posts: number;
    linkedin_posts: number;
    youtube_shorts: number;
    youtube_videos: number;
    recordings: number;
  } | null;
}

export interface ScopeActual {
  id: string;
  client_id: string;
  month: string;
  instagram: number;
  tiktok_posts: number;
  linkedin_posts: number;
  youtube_shorts: number;
  youtube_videos: number;
  recordings: number;
}

export interface ScopeControlData {
  client: ClientWithScope;
  actual: ScopeActual | null;
}

export const useScopeControl = (selectedMonth: Date) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const monthStr = format(startOfMonth(selectedMonth), "yyyy-MM-dd");

  const query = useQuery({
    queryKey: ["scope-control", monthStr],
    queryFn: async (): Promise<ScopeControlData[]> => {
      // Fetch clients with their scopes
      const { data: clients, error: clientsError } = await supabase
        .from("clients")
        .select("id, name")
        .order("name");

      if (clientsError) throw clientsError;

      // Fetch scopes
      const { data: scopes, error: scopesError } = await supabase
        .from("client_scopes")
        .select("*");

      if (scopesError) throw scopesError;

      // Fetch actuals for the selected month
      const { data: actuals, error: actualsError } = await supabase
        .from("client_scope_actuals")
        .select("*")
        .eq("month", monthStr);

      if (actualsError) throw actualsError;

      // Map scopes and actuals by client_id
      const scopesByClient = new Map(scopes?.map((s) => [s.client_id, s]));
      const actualsByClient = new Map(actuals?.map((a) => [a.client_id, a]));

      return (clients || []).map((client) => {
        const scope = scopesByClient.get(client.id);
        const actual = actualsByClient.get(client.id);

        return {
          client: {
            id: client.id,
            name: client.name,
            scope: scope
              ? {
                  instagram: scope.instagram || 0,
                  tiktok_posts: scope.tiktok_posts || 0,
                  linkedin_posts: scope.linkedin_posts || 0,
                  youtube_shorts: scope.youtube_shorts || 0,
                  youtube_videos: scope.youtube_videos || 0,
                  recordings: scope.recordings || 0,
                }
              : null,
          },
          actual: actual
            ? {
                id: actual.id,
                client_id: actual.client_id,
                month: actual.month,
                instagram: actual.instagram || 0,
                tiktok_posts: actual.tiktok_posts || 0,
                linkedin_posts: actual.linkedin_posts || 0,
                youtube_shorts: actual.youtube_shorts || 0,
                youtube_videos: actual.youtube_videos || 0,
                recordings: actual.recordings || 0,
              }
            : null,
        };
      });
    },
  });

  const upsertActualMutation = useMutation({
    mutationFn: async ({
      clientId,
      field,
      value,
    }: {
      clientId: string;
      field: keyof Omit<ScopeActual, "id" | "client_id" | "month">;
      value: number;
    }) => {
      // Check if record exists
      const { data: existing } = await supabase
        .from("client_scope_actuals")
        .select("id")
        .eq("client_id", clientId)
        .eq("month", monthStr)
        .single();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from("client_scope_actuals")
          .update({ [field]: value })
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase.from("client_scope_actuals").insert({
          client_id: clientId,
          month: monthStr,
          [field]: value,
        });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scope-control", monthStr] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    ...query,
    upsertActual: upsertActualMutation.mutate,
    isUpdating: upsertActualMutation.isPending,
  };
};
