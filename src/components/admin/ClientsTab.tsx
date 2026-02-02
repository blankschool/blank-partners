import { useState } from "react";
import { Search, Plus, Pencil, Trash2, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useClients } from "@/hooks/useClients";
import { AddClientDialog } from "./AddClientDialog";
import { EditClientDialog } from "./EditClientDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import type { ClientWithStats } from "@/hooks/useClients";
import type { ClientScopeData } from "./ClientScopeInput";

export function ClientsTab() {
  const {
    data: clients,
    isLoading,
    createClient,
    updateClient,
    deleteClient,
    isCreating,
    isUpdating,
    isDeleting,
  } = useClients();

  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientWithStats | null>(null);
  const [deletingClient, setDeletingClient] = useState<ClientWithStats | null>(null);

  const filteredClients = (clients ?? []).filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    const words = name.split(" ");
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatScope = (scope: ClientScopeData) => {
    const parts: string[] = [];
    const igTotal = scope.instagram_posts + scope.instagram_reels + scope.instagram_stories;
    if (igTotal > 0) parts.push(`IG: ${igTotal}`);
    if (scope.tiktok_posts > 0) parts.push(`TT: ${scope.tiktok_posts}`);
    if (scope.linkedin_posts > 0) parts.push(`LI: ${scope.linkedin_posts}`);
    const ytTotal = scope.youtube_videos + scope.youtube_shorts;
    if (ytTotal > 0) parts.push(`YT: ${ytTotal}`);
    if (scope.recordings > 0) parts.push(`Grav: ${scope.recordings}`);
    return parts.length > 0 ? parts.join(" | ") : "—";
  };

  const handleCreate = (name: string, scope: ClientScopeData) => {
    createClient({ name, scope });
  };

  const handleUpdate = (id: string, name: string, scope: ClientScopeData) => {
    updateClient({ id, name, scope });
  };

  const handleDelete = () => {
    if (deletingClient) {
      deleteClient(deletingClient.id);
      setDeletingClient(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Cliente
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* List header */}
        <div className="flex items-center gap-4 px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border bg-muted/30">
          <span className="w-8"></span>
          <span className="flex-1 min-w-0">Cliente</span>
          <span className="w-24 text-center hidden sm:block">Membros</span>
          <span className="w-48 hidden lg:block">Escopo</span>
          <span className="flex-1 min-w-0 hidden md:block">Responsáveis</span>
          <span className="w-20 text-right">Ações</span>
        </div>

        {/* List items */}
        <div className="divide-y divide-border">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/50"
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                  {getInitials(client.name)}
                </AvatarFallback>
              </Avatar>
              <span className="flex-1 min-w-0 font-medium text-foreground truncate">
                {client.name}
              </span>
              <span className="w-24 text-center text-sm text-muted-foreground hidden sm:flex items-center justify-center gap-1">
                <Users className="h-3 w-3" />
                {client.member_count}
              </span>
              <span className="w-48 text-xs text-muted-foreground hidden lg:block truncate">
                {client.scope ? formatScope(client.scope) : "—"}
              </span>
              <span className="flex-1 min-w-0 text-sm text-muted-foreground truncate hidden md:block">
                {client.members.length > 0
                  ? client.members.map((m) => m.full_name).join(", ")
                  : "—"}
              </span>
              <div className="w-20 flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setEditingClient(client)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setDeletingClient(client)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {filteredClients.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery
                ? "Nenhum cliente encontrado com esse termo."
                : "Nenhum cliente cadastrado."}
            </div>
          )}
        </div>
      </div>

      <AddClientDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSave={handleCreate}
        isLoading={isCreating}
      />

      <EditClientDialog
        client={editingClient}
        open={!!editingClient}
        onOpenChange={(open) => !open && setEditingClient(null)}
        onSave={handleUpdate}
        isLoading={isUpdating}
      />

      <DeleteConfirmDialog
        open={!!deletingClient}
        onOpenChange={(open) => !open && setDeletingClient(null)}
        title="Excluir Cliente"
        description={`Tem certeza que deseja excluir "${deletingClient?.name}"? Esta ação não pode ser desfeita e removerá todas as atribuições de membros.`}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
