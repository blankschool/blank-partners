import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useIsAgencyOrAdmin } from "@/hooks/useIsAgencyOrAdmin";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef } from "react";

interface AgencyRouteProps {
  children: React.ReactNode;
}

export function AgencyRoute({ children }: AgencyRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { isAgencyOrAdmin, isLoading: roleLoading } = useIsAgencyOrAdmin();
  const { toast } = useToast();
  const hasShownToast = useRef(false);

  const isLoading = authLoading || roleLoading;

  useEffect(() => {
    if (!isLoading && user && !isAgencyOrAdmin && !hasShownToast.current) {
      hasShownToast.current = true;
      toast({
        title: "Acesso restrito",
        description: "Esta página é acessível apenas para o time interno.",
        variant: "destructive",
      });
    }
  }, [isLoading, user, isAgencyOrAdmin, toast]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAgencyOrAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
