import { useState } from "react";
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
import { ClientScopeInput, defaultScopeData, type ClientScopeData } from "./ClientScopeInput";

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string, scope: ClientScopeData) => void;
  isLoading: boolean;
}

export function AddClientDialog({
  open,
  onOpenChange,
  onSave,
  isLoading,
}: AddClientDialogProps) {
  const [name, setName] = useState("");
  const [scope, setScope] = useState<ClientScopeData>(defaultScopeData);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), scope);
      setName("");
      setScope(defaultScopeData);
      onOpenChange(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setName("");
      setScope(defaultScopeData);
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
