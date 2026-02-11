import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useIsAgencyOrAdmin() {
  const { user } = useAuth();

  const { data: isAgencyOrAdmin, isLoading } = useQuery({
    queryKey: ["isAgencyOrAdmin", user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase.rpc("is_admin_or_agency");
      if (error) {
        console.error("Error checking agency/admin status:", error);
        return false;
      }
      return data ?? false;
    },
    enabled: !!user,
  });

  return { isAgencyOrAdmin: isAgencyOrAdmin ?? false, isLoading };
}
