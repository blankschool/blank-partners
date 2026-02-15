import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ChartDataItem {
  label: string;
  projetado: number;
  realizado: number;
}

interface ReportDeliveryChartProps {
  data: ChartDataItem[];
}

export function ReportDeliveryChart({ data }: ReportDeliveryChartProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Projetado vs Realizado</CardTitle>
        <CardDescription>Entregas de relatórios por semana</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  color: "var(--popover-foreground)",
                }}
              />
              <Bar dataKey="projetado" fill="var(--chart-1)" radius={[4, 4, 0, 0]} name="Projetado" />
              <Bar dataKey="realizado" fill="var(--chart-3)" radius={[4, 4, 0, 0]} name="Realizado" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
