import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CHANNEL_CONFIG,
  type ScopeData,
  type ClientScope,
  type ChannelTotals,
  type ChannelCode,
  type ChannelData,
} from "@/lib/scopeCalculations";

// Legacy interface for backward compatibility (can be removed later)
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

export const useScopeControl = (selectedMonth: Date) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const monthStr = format(startOfMonth(selectedMonth), "yyyy-MM-dd");

  const query = useQuery({
    queryKey: ["scope-control", monthStr],
    queryFn: async (): Promise<ScopeData> => {
      // Fetch clients
      const { data: clients, error: clientsError } = await supabase
        .from("clients")
        .select("id, name")
        .order("name");

      if (clientsError) throw clientsError;

      // Fetch scopes (planned)
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

      // Find last updated timestamp
      const lastUpdated = actuals?.reduce<string | null>((latest, actual) => {
        if (!latest || actual.updated_at > latest) {
          return actual.updated_at;
        }
        return latest;
      }, null);

      // Build channel totals
      const channelTotals: ChannelTotals[] = CHANNEL_CONFIG.map((config) => {
        let planned = 0;
        let actual = 0;

        clients?.forEach((client) => {
          const scope = scopesByClient.get(client.id);
          const actualData = actualsByClient.get(client.id);
          planned += scope?.[config.code] || 0;
          actual += actualData?.[config.code] || 0;
        });

        return {
          code: config.code,
          name: config.name,
          planned,
          actual,
        };
      });

      // Build client data
      const clientsData: ClientScope[] = (clients || []).map((client) => {
        const scope = scopesByClient.get(client.id);
        const actualData = actualsByClient.get(client.id);

        // Calculate totals
        let totalPlanned = 0;
        let totalActual = 0;

        // Build per-channel data
        const byChannel: ChannelData[] = CHANNEL_CONFIG.map((config) => {
          const planned = scope?.[config.code] || 0;
          const actual = actualData?.[config.code] || 0;
          totalPlanned += planned;
          totalActual += actual;

          return {
            code: config.code,
            name: config.name,
            planned,
            actual,
          };
        });

        return {
          client_id: client.id,
          client_name: client.name,
          totals: { planned: totalPlanned, actual: totalActual },
          by_channel: byChannel,
        };
      });

      return {
        period: {
          id: monthStr,
          label: format(selectedMonth, "MMMM yyyy", { locale: ptBR }),
          type: 'month' as const,
        },
        lastUpdated,
        channels: channelTotals,
        clients: clientsData,
      };
    },
  });

  const upsertActualMutation = useMutation({
    mutationFn: async ({
      clientId,
      field,
      value,
    }: {
      clientId: string;
      field: ChannelCode;
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
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    upsertActual: upsertActualMutation.mutate,
    isUpdating: upsertActualMutation.isPending,
  };
};
