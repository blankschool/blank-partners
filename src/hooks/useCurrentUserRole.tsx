import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useCurrentUserRole() {
  const { user } = useAuth();

  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["currentUserRole", user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase.rpc("is_admin");
      
      if (error) {
        console.error("Error checking admin status:", error);
        return false;
      }
      
      return data ?? false;
    },
    enabled: !!user,
  });

  return {
    isAdmin: isAdmin ?? false,
    isLoading,
  };
}
