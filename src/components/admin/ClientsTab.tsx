import { useState } from "react";
import { Search, Plus, Pencil, Trash2, Users, Instagram, Video, Linkedin, Youtube, Camera, Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useClients, type ClientWithStats } from "@/hooks/useClients";
import { AddClientDialog } from "./AddClientDialog";
import { EditClientDialog } from "./EditClientDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import type { ClientScopeData } from "./ClientScopeInput";
import { getStatusConfig, type ClientStatus } from "@/lib/clientStatus";

interface TeamMemberInfo {
  id: string;
  full_name: string;
  area: string | null;
  position: string | null;
}

const getMemberByPosition = (members: TeamMemberInfo[], positions: string[]) => {
  const member = members.find(
    (m) => m.position && positions.includes(m.position)
  );
  return member ? member.full_name.split(" ")[0] : null;
};

const getSocialMedia = (members: TeamMemberInfo[]) =>
  getMemberByPosition(members, [
    "Social Media",
    "Líder de Social Media",
    "Coordenador de Social Media",
  ]);

const getEditor = (members: TeamMemberInfo[]) =>
  getMemberByPosition(members, ["Editor de Vídeos"]);

const getDesigner = (members: TeamMemberInfo[]) =>
  getMemberByPosition(members, ["Designer", "Líder de Design"]);

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


  const handleCreate = (name: string, status: ClientStatus, scope: ClientScopeData, contractStartDate: Date | undefined) => {
    createClient({ name, status, scope, contract_start_date: contractStartDate ? format(contractStartDate, "yyyy-MM-dd") : null });
  };

  const handleUpdate = (id: string, name: string, status: ClientStatus, scope: ClientScopeData, contractStartDate: Date | undefined) => {
    updateClient({ id, name, status, scope, contract_start_date: contractStartDate ? format(contractStartDate, "yyyy-MM-dd") : null });
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    try {
      return format(parseISO(dateStr), "dd/MM/yyyy");
    } catch {
      return null;
    }
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
        <div className="flex items-center gap-4 px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border bg-muted/30">
          <span className="w-8"></span>
          <span className="flex-1 min-w-0">Cliente</span>
          <span className="w-28 hidden md:block">Status</span>
          <span className="w-24 hidden md:flex items-center gap-1" title="Data de início do contrato">
            <Calendar className="h-3.5 w-3.5" />
            Início
          </span>
          <span className="w-16 text-center hidden sm:block">Membros</span>
          <span className="w-10 text-center hidden lg:flex items-center justify-center" title="Instagram">
            <Instagram className="h-3.5 w-3.5 text-pink-500" />
          </span>
          <span className="w-10 text-center hidden lg:flex items-center justify-center" title="TikTok">
            <Video className="h-3.5 w-3.5" />
          </span>
          <span className="w-10 text-center hidden lg:flex items-center justify-center" title="LinkedIn">
            <Linkedin className="h-3.5 w-3.5 text-blue-600" />
          </span>
          <span className="w-10 text-center hidden lg:flex items-center justify-center" title="YouTube Shorts">
            <Youtube className="h-3.5 w-3.5 text-red-500" />
          </span>
          <span className="w-10 text-center hidden lg:flex items-center justify-center" title="YouTube Videos">
            <Youtube className="h-3.5 w-3.5 text-red-500" />
          </span>
          <span className="w-10 text-center hidden lg:flex items-center justify-center" title="Gravações">
            <Camera className="h-3.5 w-3.5 text-purple-500" />
          </span>
          <span className="w-20 hidden md:block">SM</span>
          <span className="w-20 hidden md:block">Editor</span>
          <span className="w-20 hidden md:block">Designer</span>
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
              <span className="w-28 hidden md:flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${getStatusConfig(client.status).color}`} />
                <span className="text-sm truncate">{getStatusConfig(client.status).label}</span>
              </span>
              <span className="w-24 text-sm hidden md:block">
                {formatDate(client.contract_start_date) || <span className="text-muted-foreground">—</span>}
              </span>
              <span className="w-16 text-center text-sm text-muted-foreground hidden sm:flex items-center justify-center gap-1">
                <Users className="h-3 w-3" />
                {client.member_count}
              </span>
              <span className="w-10 text-center text-sm hidden lg:block">
                {client.scope?.instagram || <span className="text-muted-foreground">—</span>}
              </span>
              <span className="w-10 text-center text-sm hidden lg:block">
                {client.scope?.tiktok_posts || <span className="text-muted-foreground">—</span>}
              </span>
              <span className="w-10 text-center text-sm hidden lg:block">
                {client.scope?.linkedin_posts || <span className="text-muted-foreground">—</span>}
              </span>
              <span className="w-10 text-center text-sm hidden lg:block">
                {client.scope?.youtube_shorts || <span className="text-muted-foreground">—</span>}
              </span>
              <span className="w-10 text-center text-sm hidden lg:block">
                {client.scope?.youtube_videos || <span className="text-muted-foreground">—</span>}
              </span>
              <span className="w-10 text-center text-sm hidden lg:block">
                {client.scope?.recordings || <span className="text-muted-foreground">—</span>}
              </span>
              <span className="w-20 text-sm hidden md:block truncate">
                {getSocialMedia(client.members as TeamMemberInfo[]) || (
                  <span className="text-muted-foreground">—</span>
                )}
              </span>
              <span className="w-20 text-sm hidden md:block truncate">
                {getEditor(client.members as TeamMemberInfo[]) || (
                  <span className="text-muted-foreground">—</span>
                )}
              </span>
              <span className="w-20 text-sm hidden md:block truncate">
                {getDesigner(client.members as TeamMemberInfo[]) || (
                  <span className="text-muted-foreground">—</span>
                )}
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
