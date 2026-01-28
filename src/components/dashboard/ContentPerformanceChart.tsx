import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const data = [
  { month: "Jan", posts: 45, stories: 30 },
  { month: "Feb", posts: 52, stories: 35 },
  { month: "Mar", posts: 48, stories: 42 },
  { month: "Apr", posts: 70, stories: 55 },
  { month: "May", posts: 65, stories: 48 },
  { month: "Jun", posts: 78, stories: 62 },
];

export function ContentPerformanceChart() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Content Output</CardTitle>
        <CardDescription>Monthly content production</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <YAxis
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
              <Bar dataKey="posts" fill="var(--chart-3)" radius={[4, 4, 0, 0]} name="Posts" />
              <Bar dataKey="stories" fill="var(--chart-1)" radius={[4, 4, 0, 0]} name="Stories" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
