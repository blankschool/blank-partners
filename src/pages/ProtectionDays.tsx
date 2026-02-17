import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useGoogleSheetsContent } from "@/hooks/useGoogleSheetsContent";
import { useClients } from "@/hooks/useClients";
import { ProtectionDaysFullPage } from "@/components/contents/ProtectionDaysFullPage";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

const ProtectionDays = () => {
  const navigate = useNavigate();
  const { data: sheetsData, isLoading: sheetsLoading } = useGoogleSheetsContent();
  const { data: clients, isLoading: clientsLoading } = useClients();

  const isLoading = sheetsLoading || clientsLoading;

  // Build set of active client names (case-insensitive)
  const activeClientNames = useMemo(() => {
    if (!clients) return null;
    const set = new Set<string>();
    clients.forEach((c) => {
      if (c.status !== "cancelado") {
        set.add(c.name.toLowerCase().trim());
      }
    });
    return set;
  }, [clients]);

  // Filter items to only active clients
  const filteredItems = useMemo(() => {
    const items = sheetsData?.items || [];
    if (!activeClientNames) return items;
    return items.filter((item) => {
      if (!item.client) return false;
      const key = item.client.toLowerCase().trim();
      // Keep if client is active OR not found in Supabase (can't determine status)
      return activeClientNames.has(key) || !clients?.some(
        (c) => c.name.toLowerCase().trim() === key
      );
    });
  }, [sheetsData?.items, activeClientNames, clients]);

  return (
    <AppLayout title="Dias de Proteção">
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/contents")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar para Conteúdos
        </Button>

        {isLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
            </div>
            <Skeleton className="h-64" />
          </div>
        ) : (
          <ProtectionDaysFullPage allItems={filteredItems} />
        )}
      </div>
    </AppLayout>
  );
};

export default ProtectionDays;
