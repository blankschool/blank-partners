import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfWeek, format } from "date-fns";

export interface ProductionAssignment {
  id: string;
  content_id: string;
  team_member_id: string;
  week_start: string;
  day_of_week: number | null;
  production_status: string | null;
  sort_order: number;
}

export interface ContentWithAssignment {
  contentId: string;
  cliente: string;
  titulo: string | null;
  formato: string | null;
  estagio: string | null;
  plataforma: string | null;
  assignment: ProductionAssignment | null;
}

export function useCreationTeamMembers() {
  return useQuery({
    queryKey: ["creation-team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("id, full_name, position, area")
        .eq("area", "Criação")
        .eq("visible", true)
        .order("full_name");
      if (error) throw error;
      return data;
    },
  });
}

export function useProductionContents(
  teamMemberId: string | null,
  weekStart: Date,
  stageFilters: string[]
) {
  const weekStartStr = format(
    startOfWeek(weekStart, { weekStartsOn: 1 }),
    "yyyy-MM-dd"
  );

  return useQuery({
    queryKey: ["production-board", teamMemberId, weekStartStr, stageFilters],
    queryFn: async () => {
      // Fetch all contents
      let contentQuery = supabase
        .from("painel_de_conteudos")
        .select('*');

      const { data: contents, error: contentsError } = await contentQuery;
      if (contentsError) throw contentsError;

      // Fetch assignments for this member + week
      let assignmentsData: ProductionAssignment[] = [];
      if (teamMemberId) {
        const { data, error } = await supabase
          .from("production_assignments")
          .select("*")
          .eq("team_member_id", teamMemberId)
          .eq("week_start", weekStartStr);
        if (error) throw error;
        assignmentsData = (data || []) as ProductionAssignment[];
      }

      const assignmentMap = new Map(
        assignmentsData.map((a) => [a.content_id, a])
      );

      // Filter contents by stage if filters active
      let filteredContents = contents || [];
      if (stageFilters.length > 0) {
        const normalizeForCompare = (s: string) =>
          s
            .replace(/[\u{1F300}-\u{1F9FF}]/gu, "")
            .replace(/[^\w\sáàâãéèêíïóôõöúçñ]/gi, "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();

        filteredContents = filteredContents.filter((c) => {
          const stage = c.estagio || c.status || "";
          return stageFilters.includes(normalizeForCompare(stage));
        });
      }

      // Only show contents that are assigned to this member OR not assigned to anyone for this week
      const result: ContentWithAssignment[] = filteredContents.map((c) => {
        const contentId = c["id do conteúdo"];
        return {
          contentId,
          cliente: c.cliente,
          titulo: c.titulo,
          formato: c.formato,
          estagio: c.estagio || c.status,
          plataforma: c.plataforma,
          assignment: assignmentMap.get(contentId) || null,
        };
      });

      // Filter: only show items assigned to this member, or unassigned (backlog)
      const assigned = result.filter((r) => r.assignment !== null);
      const assignedContentIds = new Set(assignmentsData.map((a) => a.content_id));

      // For backlog: show contents NOT assigned to ANY member this week
      // We need all assignments for this week to filter properly
      const { data: allWeekAssignments } = await supabase
        .from("production_assignments")
        .select("content_id")
        .eq("week_start", weekStartStr);

      const allAssignedIds = new Set(
        (allWeekAssignments || []).map((a: any) => a.content_id)
      );

      const unassigned = result.filter(
        (r) => !allAssignedIds.has(r.contentId)
      );

      return { assigned, unassigned };
    },
    enabled: !!teamMemberId,
  });
}

export function useAssignContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contentId,
      teamMemberId,
      weekStart,
      dayOfWeek,
      sortOrder,
    }: {
      contentId: string;
      teamMemberId: string;
      weekStart: string;
      dayOfWeek: number | null;
      sortOrder: number;
    }) => {
      if (dayOfWeek === null) {
        // Remove assignment (move back to backlog)
        const { error } = await supabase
          .from("production_assignments")
          .delete()
          .eq("content_id", contentId)
          .eq("week_start", weekStart);
        if (error) throw error;
        return null;
      }

      // Upsert assignment
      const { data, error } = await supabase
        .from("production_assignments")
        .upsert(
          {
            content_id: contentId,
            team_member_id: teamMemberId,
            week_start: weekStart,
            day_of_week: dayOfWeek,
            sort_order: sortOrder,
          },
          { onConflict: "content_id,week_start" }
        )
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["production-board"] });
    },
  });
}
