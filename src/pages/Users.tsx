import { useState, useMemo } from "react";
import { Search, Users as UsersIcon, Shield, Building2, UserPlus } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { UserCard } from "@/components/users/UserCard";
import { EditUserDialog } from "@/components/users/EditUserDialog";
import { useUsers, type Profile } from "@/hooks/useUsers";
import { useCurrentUserRole } from "@/hooks/useCurrentUserRole";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Users() {
  const { profiles, positions, isLoading, updateProfile, deleteProfile, toggleAdmin, isUpdating } = useUsers();
  const { isAdmin } = useCurrentUserRole();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [deletingProfileId, setDeletingProfileId] = useState<string | null>(null);

  const filteredProfiles = useMemo(() => {
    if (!searchQuery.trim()) return profiles;
    
    const query = searchQuery.toLowerCase();
    return profiles.filter(
      (p) =>
        p.full_name.toLowerCase().includes(query) ||
        p.email.toLowerCase().includes(query) ||
        p.positions?.name?.toLowerCase().includes(query) ||
        p.team?.toLowerCase().includes(query)
    );
  }, [profiles, searchQuery]);

  const stats = useMemo(() => {
    const totalUsers = profiles.length;
    const admins = profiles.filter((p) => p.user_roles?.some((r) => r.role === "admin")).length;
    const teamsCount = new Set(profiles.map((p) => p.team).filter(Boolean)).size;
    const recentUsers = profiles.filter((p) => {
      const createdAt = new Date(p.created_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdAt >= thirtyDaysAgo;
    }).length;

    return { totalUsers, admins, teamsCount, recentUsers };
  }, [profiles]);

  const handleConfirmDelete = () => {
    if (deletingProfileId) {
      deleteProfile(deletingProfileId);
      setDeletingProfileId(null);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Users</h1>
            <p className="text-muted-foreground mt-1">
              Manage team members and their roles
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={UsersIcon}
          />
          <StatCard
            title="Admins"
            value={stats.admins}
            icon={Shield}
          />
          <StatCard
            title="Teams"
            value={stats.teamsCount}
            icon={Building2}
          />
          <StatCard
            title="New (30 days)"
            value={stats.recentUsers}
            icon={UserPlus}
          />
        </div>

        {/* Users Grid */}
        {filteredProfiles.length === 0 ? (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <UsersIcon className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium text-foreground">No users found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "Try adjusting your search query" : "Users will appear here once they sign up"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProfiles.map((profile) => (
              <UserCard
                key={profile.id}
                profile={profile}
                isAdmin={isAdmin}
                onEdit={setEditingProfile}
                onDelete={setDeletingProfileId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <EditUserDialog
        profile={editingProfile}
        positions={positions}
        open={!!editingProfile}
        onOpenChange={(open) => !open && setEditingProfile(null)}
        onSave={updateProfile}
        onToggleAdmin={(userId, makeAdmin) => toggleAdmin({ userId, makeAdmin })}
        isLoading={isUpdating}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingProfileId} onOpenChange={(open) => !open && setDeletingProfileId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user profile? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
