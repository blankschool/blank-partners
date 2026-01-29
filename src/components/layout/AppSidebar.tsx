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
  { 
    title: "Dashboard", 
    url: "/", 
    icon: LayoutDashboard,
    description: "Overview of agency performance and key metrics."
  },
  { 
    title: "Clients", 
    url: "/clients", 
    icon: Users,
    description: "Manage client accounts and relationships."
  },
  { 
    title: "Contents", 
    url: "/contents", 
    icon: FileText,
    description: "Create and organize marketing content and assets."
  },
  { 
    title: "Team", 
    url: "/team", 
    icon: UsersRound,
    description: "View team members and manage assignments."
  },
  { 
    title: "Healthscore", 
    url: "/healthscore", 
    icon: HeartPulse,
    description: "Monitor system health and performance metrics."
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-none">
      <SidebarHeader className="p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-orange to-chart-3">
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
                      className="flex flex-col justify-center h-24 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/5 [&.active]:bg-white/10"
                      activeClassName="bg-white/10"
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4 shrink-0 text-white/70" />
                        <p className="text-[15px] font-medium text-white">{item.title}</p>
                      </div>
                      {!isCollapsed && (
                        <p className="text-xs text-white/70 leading-relaxed mt-1 pl-6">
                          {item.description}
                        </p>
                      )}
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
