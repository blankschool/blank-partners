import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { ClientScopeInput, defaultScopeData, type ClientScopeData } from "./ClientScopeInput";
import { clientStatusOptions, type ClientStatus } from "@/lib/clientStatus";
import type { ClientWithStats } from "@/hooks/useClients";

interface EditClientDialogProps {
  client: ClientWithStats | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, name: string, status: ClientStatus, scope: ClientScopeData, contractStartDate: Date | undefined) => void;
  isLoading: boolean;
}

export function EditClientDialog({
  client,
  open,
  onOpenChange,
  onSave,
  isLoading,
}: EditClientDialogProps) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<ClientStatus>("kickoff");
  const [scope, setScope] = useState<ClientScopeData>(defaultScopeData);
  const [contractStartDate, setContractStartDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (client) {
      setName(client.name);
      setStatus(client.status || "kickoff");
      if (client.scope) {
        setScope({
          instagram: client.scope.instagram,
          tiktok_posts: client.scope.tiktok_posts,
          linkedin_posts: client.scope.linkedin_posts,
          youtube_shorts: client.scope.youtube_shorts,
          youtube_videos: client.scope.youtube_videos,
          recordings: client.scope.recordings,
        });
      } else {
        setScope(defaultScopeData);
      }
      if (client.contract_start_date) {
        setContractStartDate(parseISO(client.contract_start_date));
      } else {
        setContractStartDate(undefined);
      }
    }
  }, [client]);

  const handleSave = () => {
    if (client && name.trim()) {
      onSave(client.id, name.trim(), status, scope, contractStartDate);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background text-foreground border-border max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Nome do Cliente</Label>
              <Input
                id="clientName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite o nome do cliente"
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as ClientStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {clientStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${option.color}`} />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data de Início do Contrato</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !contractStartDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {contractStartDate ? format(contractStartDate, "dd/MM/yyyy") : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={contractStartDate}
                    onSelect={setContractStartDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <ClientScopeInput value={scope} onChange={setScope} />
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading || !name.trim()}
          >
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
