import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ReportStatsPanelProps {
  totalProjected: number;
  totalDelivered: number;
  rate: number;
  pending: number;
  weeklyBreakdown: { label: string; projected: number; delivered: number; rate: number }[];
}

export function ReportStatsPanel({ totalProjected, totalDelivered, rate, pending, weeklyBreakdown }: ReportStatsPanelProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="p-5">
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Total Projetado</p>
          <p className="mt-2 font-serif text-4xl text-foreground">{totalProjected}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Total Entregue</p>
          <p className="mt-2 font-serif text-4xl text-foreground">{totalDelivered}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Taxa Geral</p>
          <p className="mt-2 font-serif text-4xl text-foreground">{rate}%</p>
        </Card>
        <Card className="p-5">
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Pendentes</p>
          <p className="mt-2 font-serif text-4xl text-foreground">{pending}</p>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {weeklyBreakdown.map((w) => (
          <Card key={w.label} className="p-4">
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{w.label}</p>
            <p className="mt-1 font-serif text-2xl text-foreground">
              {w.delivered}/{w.projected}
            </p>
            <Progress value={w.rate} className="mt-2 h-2" />
            <p className="mt-1 text-[10px] text-muted-foreground">{w.rate}%</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
