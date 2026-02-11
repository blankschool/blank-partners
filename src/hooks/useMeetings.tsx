import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Meeting {
  id: string;
  client_id: string;
  title: string;
  description: string | null;
  meeting_period: string | null;
  meeting_link: string;
  meeting_date: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

interface UpsertMeetingInput {
  client_id: string;
  meeting_period: "weekly" | "monthly";
  meeting_date: string; // YYYY-MM-DD
  meeting_link: string;
  title: string;
}

export function useMeetings(month?: Date) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: meetings = [], isLoading } = useQuery({
    queryKey: ["meetings", month?.toISOString()],
    queryFn: async () => {
      if (!month) return [];
      const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
      const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      const startStr = startOfMonth.toISOString().split("T")[0];
      const endStr = endOfMonth.toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("client_meetings")
        .select("*")
        .gte("meeting_date", startStr + "T00:00:00")
        .lte("meeting_date", endStr + "T23:59:59")
        .order("meeting_date");

      if (error) throw error;
      return (data || []) as Meeting[];
    },
    enabled: !!month,
  });

  const upsertMeeting = useMutation({
    mutationFn: async (input: UpsertMeetingInput) => {
      const meetingDateISO = input.meeting_date + "T00:00:00";

      const { data: existing } = await supabase
        .from("client_meetings")
        .select("id")
        .eq("client_id", input.client_id)
        .eq("meeting_period", input.meeting_period)
        .eq("meeting_date", meetingDateISO)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("client_meetings")
          .update({
            meeting_link: input.meeting_link,
            title: input.title,
          })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("client_meetings")
          .insert({
            client_id: input.client_id,
            meeting_period: input.meeting_period,
            meeting_date: meetingDateISO,
            meeting_link: input.meeting_link,
            title: input.title,
            created_by: user?.id ?? null,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["meetings"] }),
  });

  const deleteMeeting = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("client_meetings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["meetings"] }),
  });

  return { meetings, isLoading, upsertMeeting, deleteMeeting };
}
