import { useState } from "react";
import { Target } from "lucide-react";
import { startOfMonth } from "date-fns";
import { AppLayout } from "@/components/layout/AppLayout";
import { ScopeMonthSelector } from "@/components/scope/ScopeMonthSelector";
import { ScopeControlTable } from "@/components/scope/ScopeControlTable";
import { useScopeControl } from "@/hooks/useScopeControl";

export default function ScopeControl() {
  const [selectedMonth, setSelectedMonth] = useState(() => startOfMonth(new Date()));
  const { data, isLoading, upsertActual, isUpdating } = useScopeControl(selectedMonth);

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Controle de Escopo</h1>
              <p className="text-sm text-muted-foreground">
                Compare o planejado vs. realizado de cada cliente
              </p>
            </div>
          </div>
          <ScopeMonthSelector
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
          </div>
        ) : (
          <ScopeControlTable
            data={data || []}
            onUpdateActual={upsertActual}
            isUpdating={isUpdating}
          />
        )}

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded bg-green-100 dark:bg-green-900/30" />
            <span>No prazo (Real = Plan)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded bg-yellow-100 dark:bg-yellow-900/30" />
            <span>Abaixo (Real &lt; Plan)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded bg-blue-100 dark:bg-blue-900/30" />
            <span>Acima (Real &gt; Plan)</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
