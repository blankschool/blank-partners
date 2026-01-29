import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ExternalLink } from "lucide-react";
import { ContentItem } from "@/hooks/useGoogleSheetsContent";
import { getStageConfig } from "@/lib/contentStages";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DayContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | null;
  items: ContentItem[];
}

export function DayContentDialog({
  open,
  onOpenChange,
  date,
  items,
}: DayContentDialogProps) {
  if (!date) return null;

  const formattedDate = format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card dark:bg-neutral-800">
        <DialogHeader>
          <DialogTitle>{formattedDate}</DialogTitle>
          <DialogDescription>
            {items.length} conteúdo{items.length !== 1 ? "s" : ""} agendado{items.length !== 1 ? "s" : ""}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-96">
          <div className="space-y-2 pr-4">
            {items.map((item, idx) => {
              const stageConfig = getStageConfig(item.status);
              
              return (
                <div
                  key={`${item.id}-${idx}`}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-background dark:bg-neutral-900 border border-border"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-medium text-sm truncate">
                      {item.client || "Sem cliente"}
                    </span>
                    {stageConfig && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs shrink-0",
                          stageConfig.bgColor,
                          stageConfig.color
                        )}
                      >
                        {stageConfig.label}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    {item.format && (
                      <span className="text-xs text-muted-foreground">
                        {item.format}
                      </span>
                    )}
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
