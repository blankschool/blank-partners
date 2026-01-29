import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AppHeaderProps {
  title?: string;
}

export function AppHeader({ title = "Dashboard" }: AppHeaderProps) {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["headerProfile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("user_id", user.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-white/5 bg-background/60 px-4 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-muted-foreground transition-colors duration-300 hover:text-foreground" />
        <h1 className="font-serif text-xl font-normal text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-64 pl-11 border-border bg-muted/50"
          />
        </div>

        <NotificationDropdown />

        <Link
          to="/profile"
          className="flex items-center gap-3 border-l border-border pl-4 transition-opacity hover:opacity-80"
        >
          <Avatar className="h-9 w-9 ring-2 ring-border">
            <AvatarImage src={profile?.avatar_url || ""} alt={displayName} />
            <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-foreground">{displayName}</p>
            <p className="text-xs text-muted-foreground">View Profile</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
