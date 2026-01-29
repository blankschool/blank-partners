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

  const handleCreate = (name: string) => {
    createClient(name);
  };

  const handleUpdate = (id: string, name: string) => {
    updateClient({ id, name });
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="group relative rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                    {getInitials(client.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-foreground">{client.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>
                      {client.member_count}{" "}
                      {client.member_count === 1 ? "membro" : "membros"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setEditingClient(client)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => setDeletingClient(client)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {client.members.length > 0 && (
              <p className="mt-2 text-xs text-muted-foreground truncate">
                {client.members.map((m) => m.full_name).join(", ")}
              </p>
            )}
          </div>
        ))}

        {filteredClients.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            {searchQuery
              ? "Nenhum cliente encontrado com esse termo."
              : "Nenhum cliente cadastrado."}
          </div>
        )}
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
