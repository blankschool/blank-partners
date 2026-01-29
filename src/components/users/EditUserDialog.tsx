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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Profile, Position, TeamType } from "@/hooks/useUsers";
import { TEAMS } from "@/hooks/useUsers";

interface EditUserDialogProps {
  profile: Profile | null;
  positions: Position[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    id: string;
    full_name: string;
    position_id: string | null;
    team: TeamType | null;
  }) => void;
  onToggleAdmin: (userId: string, makeAdmin: boolean) => void;
  isLoading: boolean;
}

export function EditUserDialog({
  profile,
  positions,
  open,
  onOpenChange,
  onSave,
  onToggleAdmin,
  isLoading,
}: EditUserDialogProps) {
  const [fullName, setFullName] = useState("");
  const [positionId, setPositionId] = useState<string | null>(null);
  const [team, setTeam] = useState<TeamType | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name);
      setPositionId(profile.position_id);
      setTeam(profile.team);
      setIsAdmin(profile.user_roles?.some((r) => r.role === "admin") ?? false);
    }
  }, [profile]);

  const handleSave = () => {
    if (!profile) return;

    const wasAdmin = profile.user_roles?.some((r) => r.role === "admin") ?? false;
    
    onSave({
      id: profile.id,
      full_name: fullName.trim(),
      position_id: positionId,
      team,
    });

    if (wasAdmin !== isAdmin) {
      onToggleAdmin(profile.user_id, isAdmin);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={profile?.email ?? ""}
              disabled
              className="bg-muted/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Select
              value={positionId ?? "none"}
              onValueChange={(value) => setPositionId(value === "none" ? null : value)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                <SelectItem value="none">No position</SelectItem>
                {positions.map((position) => (
                  <SelectItem key={position.id} value={position.id}>
                    {position.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="team">Team</Label>
            <Select
              value={team ?? "none"}
              onValueChange={(value) => setTeam(value === "none" ? null : (value as TeamType))}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                <SelectItem value="none">No team</SelectItem>
                {TEAMS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="admin-toggle">Administrator</Label>
              <p className="text-sm text-muted-foreground">
                Grant admin privileges to this user
              </p>
            </div>
            <Switch
              id="admin-toggle"
              checked={isAdmin}
              onCheckedChange={setIsAdmin}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
