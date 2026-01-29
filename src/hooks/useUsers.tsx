import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type TeamType = "Creative" | "Marketing" | "Client Services" | "Operations";
export type AppRole = "admin" | "user";

export interface Position {
  id: string;
  name: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  position_id: string | null;
  team: TeamType | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  positions: { name: string } | null;
  user_roles: { role: AppRole }[];
}

export interface UpdateProfileData {
  id: string;
  full_name: string;
  position_id: string | null;
  team: TeamType | null;
}

export function useUsers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profiles, isLoading: profilesLoading, error: profilesError } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      // Fetch profiles with positions
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select(`
          *,
          positions (name)
        `)
        .order("full_name");

      if (profilesError) throw profilesError;

      // Fetch all user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Merge roles into profiles
      const rolesMap = new Map<string, { role: AppRole }[]>();
      rolesData?.forEach((r) => {
        const existing = rolesMap.get(r.user_id) || [];
        existing.push({ role: r.role as AppRole });
        rolesMap.set(r.user_id, existing);
      });

      return profilesData.map((p) => ({
        ...p,
        user_roles: rolesMap.get(p.user_id) || [],
      })) as Profile[];
    },
  });

  const { data: positions, isLoading: positionsLoading } = useQuery({
    queryKey: ["positions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("positions")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Position[];
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.full_name,
          position_id: data.position_id,
          team: data.team,
        })
        .eq("id", data.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast({
        title: "Profile updated",
        description: "The user profile has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteProfileMutation = useMutation({
    mutationFn: async (profileId: string) => {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", profileId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast({
        title: "Profile deleted",
        description: "The user profile has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleAdminMutation = useMutation({
    mutationFn: async ({ userId, makeAdmin }: { userId: string; makeAdmin: boolean }) => {
      if (makeAdmin) {
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role: "admin" as AppRole });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", "admin");
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast({
        title: "Role updated",
        description: "User role has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating role",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    profiles: profiles ?? [],
    positions: positions ?? [],
    isLoading: profilesLoading || positionsLoading,
    error: profilesError,
    updateProfile: updateProfileMutation.mutate,
    deleteProfile: deleteProfileMutation.mutate,
    toggleAdmin: toggleAdminMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    isDeleting: deleteProfileMutation.isPending,
  };
}

export const TEAMS: TeamType[] = ["Creative", "Marketing", "Client Services", "Operations"];
