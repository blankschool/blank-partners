import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUserRole } from "@/hooks/useCurrentUserRole";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef } from "react";

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useCurrentUserRole();
  const { toast } = useToast();
  const hasShownToast = useRef(false);

  const isLoading = authLoading || roleLoading;

  useEffect(() => {
    if (!isLoading && user && !isAdmin && !hasShownToast.current) {
      hasShownToast.current = true;
      toast({
        title: "Acesso restrito",
        description: "Esta página é acessível apenas para administradores.",
        variant: "destructive",
      });
    }
  }, [isLoading, user, isAdmin, toast]);

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

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
