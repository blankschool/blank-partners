import { useState, useEffect } from "react";
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
import type { ClientWithStats } from "@/hooks/useClients";

interface EditClientDialogProps {
  client: ClientWithStats | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, name: string) => void;
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

  useEffect(() => {
    if (client) {
      setName(client.name);
    }
  }, [client]);

  const handleSave = () => {
    if (client && name.trim()) {
      onSave(client.id, name.trim());
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white text-gray-900 border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Editar Cliente</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="clientName" className="text-gray-700">Nome do Cliente</Label>
            <Input
              id="clientName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome do cliente"
              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading || !name.trim()}
            className="bg-gray-900 text-white hover:bg-gray-800"
          >
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
