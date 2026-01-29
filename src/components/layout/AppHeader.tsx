import { Bell, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AppHeaderProps {
  title?: string;
}

export function AppHeader({ title = "Dashboard" }: AppHeaderProps) {
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

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent-orange text-[10px] font-medium text-accent-orange-foreground">
            3
          </span>
        </Button>

        <div className="flex items-center gap-3 border-l border-border pl-4">
          <Avatar className="h-9 w-9 ring-2 ring-border">
            <AvatarImage src="" alt="User" />
            <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-medium">JD</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-foreground">John Doe</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
