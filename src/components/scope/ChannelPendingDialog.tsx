import { useMemo } from "react";
import { CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { ClientScope, ChannelCode } from "@/lib/scopeCalculations";

interface ChannelPendingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channel: ChannelCode | null;
  channelLabel: string;
  channelIcon: React.ReactNode;
  clients: ClientScope[];
}

const getProgressColor = (percentage: number) => {
  if (percentage >= 100) return "bg-green-500";
  if (percentage >= 50) return "bg-yellow-500";
  return "bg-red-500";
};

export function ChannelPendingDialog({
  open,
  onOpenChange,
  channel,
  channelLabel,
  channelIcon,
  clients,
}: ChannelPendingDialogProps) {
  const pendingClients = useMemo(() => {
    if (!channel) return [];

    return clients
      .filter((client) => {
        const channelData = client.by_channel.find((c) => c.code === channel);
        if (!channelData) return false;
        return channelData.planned > 0 && channelData.actual < channelData.planned;
      })
      .map((client) => {
        const channelData = client.by_channel.find((c) => c.code === channel);
        const planned = channelData?.planned || 0;
        const actual = channelData?.actual || 0;
        return {
          id: client.client_id,
          name: client.client_name,
          planned,
          actual,
          missing: planned - actual,
          percentage: Math.round((actual / planned) * 100),
        };
      })
      .sort((a, b) => a.percentage - b.percentage);
  }, [clients, channel]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white text-gray-900 border-gray-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {channelIcon}
            <span>Clientes Pendentes - {channelLabel}</span>
          </DialogTitle>
        </DialogHeader>

        {pendingClients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-3" />
            <p className="text-lg font-medium">Todos os clientes estão em dia!</p>
            <p className="text-sm text-muted-foreground mt-1">
              Nenhuma entrega pendente para {channelLabel}
            </p>
          </div>
        ) : (
          <>
            <ScrollArea className="max-h-[400px] pr-4">
              <div className="space-y-3">
                {pendingClients.map((client) => (
                  <div
                    key={client.id}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">{client.name}</span>
                      <span className="text-sm text-gray-500 whitespace-nowrap ml-2">
                        Faltam {client.missing} de {client.planned}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={cn("h-full transition-all duration-500", getProgressColor(client.percentage))}
                          style={{ width: `${client.percentage}%` }}
                        />
                      </div>
                      <span className={cn(
                        "text-sm font-medium min-w-[40px] text-right",
                        client.percentage >= 50 ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400"
                      )}>
                        {client.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="pt-2 border-t border-gray-200 text-sm text-gray-500">
              Total: {pendingClients.length} {pendingClients.length === 1 ? "cliente pendente" : "clientes pendentes"}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
