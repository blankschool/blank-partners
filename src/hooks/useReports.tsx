import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Report {
  id: string;
  client_id: string;
  title: string;
  content: string;
  report_period: string | null;
  report_link: string | null;
  reference_date: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

interface UpsertReportInput {
  client_id: string;
  report_period: "weekly" | "monthly";
  reference_date: string; // YYYY-MM-DD
  report_link: string;
  title: string;
}

export function useReports(month?: Date) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["reports", month?.toISOString()],
    queryFn: async () => {
      if (!month) return [];
      const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
      const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      const startStr = startOfMonth.toISOString().split("T")[0];
      const endStr = endOfMonth.toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("client_reports")
        .select("*")
        .gte("reference_date", startStr)
        .lte("reference_date", endStr)
        .order("reference_date");

      if (error) throw error;
      return (data || []) as Report[];
    },
    enabled: !!month,
  });

  const upsertReport = useMutation({
    mutationFn: async (input: UpsertReportInput) => {
      // Check if report already exists
      const { data: existing } = await supabase
        .from("client_reports")
        .select("id")
        .eq("client_id", input.client_id)
        .eq("report_period", input.report_period)
        .eq("reference_date", input.reference_date)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("client_reports")
          .update({
            report_link: input.report_link,
            title: input.title,
          })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("client_reports")
          .insert({
            client_id: input.client_id,
            report_period: input.report_period,
            reference_date: input.reference_date,
            report_link: input.report_link,
            title: input.title,
            content: "",
            created_by: user?.id ?? null,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reports"] }),
  });

  const deleteReport = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("client_reports").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reports"] }),
  });

  return { reports, isLoading, upsertReport, deleteReport };
}
