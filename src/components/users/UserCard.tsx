import { Pencil, Trash2, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Profile } from "@/hooks/useUsers";

interface UserCardProps {
  profile: Profile;
  isAdmin: boolean;
  onEdit: (profile: Profile) => void;
  onDelete: (profileId: string) => void;
}

export function UserCard({ profile, isAdmin, onEdit, onDelete }: UserCardProps) {
  const userInitials = profile.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : profile.email.substring(0, 2).toUpperCase();

  const isUserAdmin = profile.user_roles?.some((r) => r.role === "admin");

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14 ring-2 ring-border/50">
            <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.full_name} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              {userInitials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-foreground truncate">
                {profile.full_name || "Unnamed User"}
              </h3>
              {isUserAdmin && (
                <Badge variant="accent" className="shrink-0">
                  <Shield className="mr-1 h-3 w-3" />
                  Admin
                </Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground truncate mt-0.5">
              {profile.email}
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              {profile.positions?.name && (
                <Badge variant="secondary" className="text-xs">
                  {profile.positions.name}
                </Badge>
              )}
              {profile.team && (
                <Badge variant="outline" className="text-xs">
                  {profile.team}
                </Badge>
              )}
            </div>
          </div>

          {isAdmin && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => onEdit(profile)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(profile.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
