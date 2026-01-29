import { LayoutDashboard, Users, FileText, UsersRound, HeartPulse } from "lucide-react";
import { NavLink } from "@/components/NavLink";
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
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-none">
      <SidebarHeader className="p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-foreground to-muted-foreground">
            <span className="font-serif text-lg font-normal text-white">M</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-serif text-base font-normal text-white">MediaFlow</span>
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-5">
        {!isCollapsed && (
          <div className="rounded-lg border border-white/10 p-4">
            <p className="text-xs font-medium text-white">Need help?</p>
            <p className="mt-1 text-[10px] text-white/50">Contact support for assistance</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
