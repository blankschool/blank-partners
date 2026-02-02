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
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClientScopeInput, defaultScopeData, type ClientScopeData } from "./ClientScopeInput";
import type { ClientWithStats } from "@/hooks/useClients";

interface EditClientDialogProps {
  client: ClientWithStats | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, name: string, scope: ClientScopeData) => void;
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
  const [scope, setScope] = useState<ClientScopeData>(defaultScopeData);

  useEffect(() => {
    if (client) {
      setName(client.name);
      if (client.scope) {
        setScope({
          instagram_posts: client.scope.instagram_posts,
          instagram_reels: client.scope.instagram_reels,
          instagram_stories: client.scope.instagram_stories,
          tiktok_posts: client.scope.tiktok_posts,
          linkedin_posts: client.scope.linkedin_posts,
          youtube_videos: client.scope.youtube_videos,
          youtube_shorts: client.scope.youtube_shorts,
          recordings: client.scope.recordings,
        });
      } else {
        setScope(defaultScopeData);
      }
    }
  }, [client]);

  const handleSave = () => {
    if (client && name.trim()) {
      onSave(client.id, name.trim(), scope);
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
