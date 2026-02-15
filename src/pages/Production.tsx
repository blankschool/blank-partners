import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Clapperboard } from "lucide-react";
import { WeekSelector } from "@/components/production/WeekSelector";
import { ProductionFilters } from "@/components/production/ProductionFilters";
import { ProductionKanbanColumn } from "@/components/production/ProductionKanbanColumn";
import {
  useCreationTeamMembers,
  useProductionContents,
  useAssignContent,
} from "@/hooks/useProductionBoard";
import { startOfWeek, addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const DAY_LABELS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

export default function Production() {
  const [currentWeek, setCurrentWeek] = useState(() => new Date());
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [stageFilters, setStageFilters] = useState<string[]>([]);
  const { toast } = useToast();

  const { data: teamMembers = [] } = useCreationTeamMembers();
  const weekStartDate = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekStartStr = format(weekStartDate, "yyyy-MM-dd");

  const { data, isLoading } = useProductionContents(
    selectedMemberId,
    currentWeek,
    stageFilters
  );

  const assignMutation = useAssignContent();

  // Auto-select first member
  if (!selectedMemberId && teamMembers.length > 0) {
    setSelectedMemberId(teamMembers[0].id);
  }

  const handleDragStart = (e: React.DragEvent, contentId: string) => {
    e.dataTransfer.setData("text/plain", contentId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (contentId: string, dayOfWeek: number | null) => {
    if (!selectedMemberId) return;

    assignMutation.mutate(
      {
        contentId,
        teamMemberId: selectedMemberId,
        weekStart: weekStartStr,
        dayOfWeek,
        sortOrder: 0,
      },
      {
        onError: () => {
          toast({
            title: "Erro ao alocar conteúdo",
            variant: "destructive",
          });
        },
      }
    );
  };

  // Build columns
  const backlogItems = data?.unassigned || [];
  const dayColumns = DAY_LABELS.map((label, i) => {
    const dayNum = i + 1;
    const dayDate = addDays(weekStartDate, i);
    const dateStr = format(dayDate, "dd/MM", { locale: ptBR });
    const items =
      data?.assigned.filter((a) => a.assignment?.day_of_week === dayNum) || [];
    return { label, dateStr, dayNum, items };
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
              <Clapperboard className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-serif">Controle de Produção</h1>
              <p className="text-sm text-muted-foreground">
                Organize as demandas de criação por editor e dia da semana
              </p>
            </div>
          </div>
        </div>

        {/* Filters + Week Selector */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <ProductionFilters
            teamMembers={teamMembers}
            selectedMemberId={selectedMemberId}
            onMemberChange={setSelectedMemberId}
            stageFilters={stageFilters}
            onStageFiltersChange={setStageFilters}
          />
          <WeekSelector
            currentWeek={currentWeek}
            onWeekChange={setCurrentWeek}
          />
        </div>

        {/* Kanban */}
        {!selectedMemberId ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Selecione um membro da equipe para ver o quadro
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-4">
            <ProductionKanbanColumn
              title="Não alocado"
              subtitle="Backlog"
              items={backlogItems}
              dayOfWeek={null}
              onDrop={handleDrop}
              onDragStart={handleDragStart}
            />
            {dayColumns.map((col) => (
              <ProductionKanbanColumn
                key={col.dayNum}
                title={col.label}
                subtitle={col.dateStr}
                items={col.items}
                dayOfWeek={col.dayNum}
                onDrop={handleDrop}
                onDragStart={handleDragStart}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
