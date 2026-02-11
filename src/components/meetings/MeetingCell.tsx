import { Check, Minus, ExternalLink } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Meeting } from "@/hooks/useMeetings";

interface MeetingCellProps {
  meeting?: Meeting;
  onClick: () => void;
}

export function MeetingCell({ meeting, onClick }: MeetingCellProps) {
  if (!meeting || !meeting.title) {
    return (
      <button
        onClick={onClick}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 text-muted-foreground/40 transition-colors hover:border-primary/50 hover:text-primary/60"
      >
        <Minus className="h-4 w-4" />
      </button>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 transition-colors hover:bg-emerald-500/30"
        >
          <Check className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="flex items-center gap-1.5 text-xs">
        <ExternalLink className="h-3 w-3" />
        {meeting.title || "Ver reunião"}
      </TooltipContent>
    </Tooltip>
  );
}
