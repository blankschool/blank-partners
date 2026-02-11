import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Report {
  id: string;
  client_id: string;
  title: string;
  content: string;
  report_period: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  client_name?: string;
}

interface CreateReportInput {
  client_id: string;
  title: string;
  content: string;
  report_period: "weekly" | "monthly";
}

interface UpdateReportInput extends CreateReportInput {
  id: string;
}

export function useReports() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_reports")
        .select("*, clients(name)")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data || []).map((r: any) => ({
        ...r,
        client_name: r.clients?.name ?? "—",
      })) as Report[];
    },
  });

  const createReport = useMutation({
    mutationFn: async (input: CreateReportInput) => {
      const { error } = await supabase.from("client_reports").insert({
        client_id: input.client_id,
        title: input.title,
        content: input.content,
        report_period: input.report_period,
        created_by: user?.id ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reports"] }),
  });

  const updateReport = useMutation({
    mutationFn: async (input: UpdateReportInput) => {
      const { error } = await supabase
        .from("client_reports")
        .update({
          client_id: input.client_id,
          title: input.title,
          content: input.content,
          report_period: input.report_period,
        })
        .eq("id", input.id);
      if (error) throw error;
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

  return { reports, isLoading, createReport, updateReport, deleteReport };
}
