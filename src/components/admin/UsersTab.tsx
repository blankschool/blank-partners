import { useState } from "react";
import { Search, Pencil, Trash2, Shield, ShieldOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUsers } from "@/hooks/useUsers";
import { EditUserDialog } from "@/components/users/EditUserDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import type { Profile } from "@/hooks/useUsers";

export function UsersTab() {
  const {
    profiles,
    positions,
    isLoading,
    updateProfile,
    deleteProfile,
    toggleAdmin,
    isUpdating,
    isDeleting,
  } = useUsers();

  const [searchQuery, setSearchQuery] = useState("");
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [deletingProfile, setDeletingProfile] = useState<Profile | null>(null);

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string, email: string) => {
    if (name) {
      const words = name.split(" ");
      if (words.length >= 2) {
        return `${words[0][0]}${words[1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  const isAdmin = (profile: Profile) =>
    profile.user_roles?.some((r) => r.role === "admin");

  const handleDelete = () => {
    if (deletingProfile) {
      deleteProfile(deletingProfile.id);
      setDeletingProfile(null);
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
            placeholder="Buscar usuários..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {profiles.length} usuários cadastrados
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Header row */}
        <div className="flex items-center gap-4 px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border bg-muted/30">
          <span className="w-8"></span>
          <span className="flex-1 min-w-0">Nome</span>
          <span className="w-48 hidden sm:block">Email</span>
          <span className="w-24 hidden md:block text-center">Equipe</span>
          <span className="w-28 hidden lg:block">Cargo</span>
          <span className="w-20 hidden xl:block text-center">Tipo</span>
          <span className="w-20 text-right">Ações</span>
        </div>

        {/* List items */}
        <div className="divide-y divide-border">
          {filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/50"
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={profile.avatar_url ?? undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                  {getInitials(profile.full_name, profile.email)}
                </AvatarFallback>
              </Avatar>

              <span className="flex-1 min-w-0 flex items-center gap-2">
                <span className="font-medium text-foreground truncate">
                  {profile.full_name || "Sem nome"}
                </span>
                {isAdmin(profile) && (
                  <Shield className="h-4 w-4 text-primary shrink-0" />
                )}
              </span>

              <span className="w-48 hidden sm:block text-sm text-muted-foreground truncate">
                {profile.email}
              </span>

              <span className="w-24 hidden md:flex justify-center">
                {profile.team && (
                  <Badge variant="secondary" className="text-xs">
                    {profile.team}
                  </Badge>
                )}
              </span>

              <span className="w-28 hidden lg:block text-sm text-muted-foreground truncate">
                {profile.positions?.name || "-"}
              </span>

              <span className="w-20 hidden xl:flex justify-center">
                {isAdmin(profile) ? (
                  <Badge className="text-xs bg-primary/20 text-primary hover:bg-primary/30">
                    Admin
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    Usuário
                  </Badge>
                )}
              </span>

              <div className="w-20 flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setEditingProfile(profile)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => setDeletingProfile(profile)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {filteredProfiles.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery
                ? "Nenhum usuário encontrado com esse termo."
                : "Nenhum usuário cadastrado."}
            </div>
          )}
        </div>
      </div>

      <EditUserDialog
        profile={editingProfile}
        positions={positions}
        open={!!editingProfile}
        onOpenChange={(open) => !open && setEditingProfile(null)}
        onSave={updateProfile}
        onToggleAdmin={(userId, makeAdmin) => toggleAdmin({ userId, makeAdmin })}
        isLoading={isUpdating}
      />

      <DeleteConfirmDialog
        open={!!deletingProfile}
        onOpenChange={(open) => !open && setDeletingProfile(null)}
        title="Excluir Usuário"
        description={`Tem certeza que deseja excluir "${deletingProfile?.full_name || deletingProfile?.email}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
