import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, description, icon: Icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("group", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{title}</p>
            <p className="mt-2 font-sans text-5xl font-semibold tabular-nums tracking-tight text-foreground">{value}</p>
            {description && (
              <p className="mt-3 font-sans text-sm text-muted-foreground">{description}</p>
            )}
            {trend && (
              <div className="mt-4 flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-accent-orange" />
                <p className={cn(
                  "font-sans text-xs font-medium",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}>
                  {trend.isPositive ? "+" : ""}{trend.value}% from last month
                </p>
              </div>
            )}
          </div>
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground transition-all duration-300 group-hover:bg-accent-orange group-hover:text-accent-orange-foreground">
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
