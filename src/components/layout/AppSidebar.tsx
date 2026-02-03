import { LayoutDashboard, Users, FileText, UsersRound, HeartPulse, LogOut, UserCog, Shield, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUserRole } from "@/hooks/useCurrentUserRole";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Clients", url: "/clients", icon: Users },
  { title: "Contents", url: "/contents", icon: FileText },
  { title: "Team", url: "/team", icon: UsersRound },
  { title: "Healthscore", url: "/healthscore", icon: HeartPulse },
  { title: "Users", url: "/users", icon: UserCog },
];

const adminNavigationItems = [
  { title: "Admin", url: "/admin", icon: Shield },
  { title: "Controle de Escopo", url: "/scope-control", icon: Target },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { user, signOut } = useAuth();
  const { isAdmin } = useCurrentUserRole();
  const { toast } = useToast();
  const isCollapsed = state === "collapsed";

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const userInitials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : "U";

  const userDisplayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <Sidebar collapsible="icon" className="border-none">
      <SidebarHeader className="p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-foreground to-muted-foreground">
            <span className="font-serif text-lg font-normal text-white">B</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-serif text-base font-normal text-white">Blank</span>
              <span className="text-[10px] uppercase tracking-widest text-white/50">Agency ERP</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-3 h-12 px-4 rounded-lg transition-all duration-300 hover:bg-white/10 [&.active]:bg-white/10"
                      activeClassName="bg-white/10"
                    >
                      <item.icon className="h-5 w-5 shrink-0 text-white/70" />
                      <span className="text-[15px] font-medium text-white">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {isAdmin && adminNavigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 h-12 px-4 rounded-lg transition-all duration-300 hover:bg-white/10 [&.active]:bg-white/10"
                      activeClassName="bg-white/10"
                    >
                      <item.icon className="h-5 w-5 shrink-0 text-white/70" />
                      <span className="text-[15px] font-medium text-white">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-5">
        {user && (
          <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
            <Link to="/profile">
              <Avatar className="h-9 w-9 ring-2 ring-white/20 transition-opacity hover:opacity-80">
                <AvatarImage src={user.user_metadata?.avatar_url} alt={userDisplayName} />
                <AvatarFallback className="bg-white/10 text-white text-xs font-medium">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Link>
            {!isCollapsed && (
              <div className="flex flex-1 items-center justify-between">
                <Link to="/profile" className="flex flex-col hover:opacity-80 transition-opacity">
                  <span className="text-sm font-medium text-white truncate max-w-[120px]">
                    {userDisplayName}
                  </span>
                  <span className="text-[10px] text-white/50 truncate max-w-[120px]">
                    {user.email}
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
        {!user && !isCollapsed && (
          <div className="rounded-lg border border-white/10 p-4">
            <p className="text-xs font-medium text-white">Need help?</p>
            <p className="mt-1 text-[10px] text-white/50">Contact support for assistance</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
