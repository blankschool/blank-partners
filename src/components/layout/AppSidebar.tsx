import { LayoutDashboard, Users, FileText, UsersRound, HeartPulse } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-orange">
            <span className="font-serif text-lg font-normal text-accent-orange-foreground">M</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-serif text-base font-normal text-sidebar-foreground">MediaFlow</span>
              <span className="text-xs text-sidebar-muted-foreground">Agency ERP</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-sidebar-muted-foreground">
            {!isCollapsed && (
              <>
                <span className="flex h-1.5 w-1.5 rounded-full bg-accent-orange" />
                Navigation
              </>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sidebar-foreground transition-all duration-300 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="bg-sidebar-accent text-accent-orange font-medium"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!isCollapsed && (
          <div className="rounded-xl bg-sidebar-accent p-4">
            <p className="text-xs font-medium text-sidebar-foreground">Need help?</p>
            <p className="mt-1 text-xs text-sidebar-muted-foreground">Contact support for assistance</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
