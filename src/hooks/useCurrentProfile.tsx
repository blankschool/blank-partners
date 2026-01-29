import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Position = Database["public"]["Tables"]["positions"]["Row"];
type TeamType = Database["public"]["Enums"]["team_type"];

interface UpdateProfileData {
  full_name: string;
  position_id: string | null;
  team: TeamType | null;
}

export function useCurrentProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const { data: profile, isLoading: isLoadingProfile, error: profileError } = useQuery({
    queryKey: ["currentProfile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user?.id,
  });

  const { data: positions = [], isLoading: isLoadingPositions } = useQuery({
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

  const { data: userRole } = useQuery({
    queryKey: ["currentUserRole", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (error) return "user";
      return data?.role || "user";
    },
    enabled: !!user?.id,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      if (!user?.id) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.full_name,
          position_id: data.position_id,
          team: data.team,
        })
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentProfile"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
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

  const uploadAvatar = async (file: File): Promise<string> => {
    if (!user?.id) throw new Error("Not authenticated");
    
    setIsUploading(true);
    
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      // Delete existing avatar if any
      await supabase.storage.from("avatars").remove([filePath]);

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      queryClient.invalidateQueries({ queryKey: ["currentProfile"] });
      
      toast({
        title: "Avatar updated",
        description: "Your profile photo has been updated.",
      });

      return publicUrl;
    } catch (error: any) {
      toast({
        title: "Error uploading avatar",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    profile,
    positions,
    userRole,
    isLoading: isLoadingProfile || isLoadingPositions,
    error: profileError,
    updateProfile: updateProfileMutation.mutate,
    uploadAvatar,
    isUpdating: updateProfileMutation.isPending,
    isUploading,
  };
}
