import { useState } from "react";
import { format } from "date-fns";
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

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string, status: ClientStatus, scope: ClientScopeData, contractStartDate: Date | undefined) => void;
  isLoading: boolean;
}

export function AddClientDialog({
  open,
  onOpenChange,
  onSave,
  isLoading,
}: AddClientDialogProps) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<ClientStatus>("kickoff");
  const [scope, setScope] = useState<ClientScopeData>(defaultScopeData);
  const [contractStartDate, setContractStartDate] = useState<Date | undefined>(undefined);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), status, scope, contractStartDate);
      setName("");
      setStatus("kickoff");
      setScope(defaultScopeData);
      setContractStartDate(undefined);
      onOpenChange(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setName("");
      setStatus("kickoff");
      setScope(defaultScopeData);
      setContractStartDate(undefined);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-background text-foreground border-border max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Adicionar Cliente</DialogTitle>
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
            onClick={() => handleOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading || !name.trim()}
          >
            {isLoading ? "Salvando..." : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
