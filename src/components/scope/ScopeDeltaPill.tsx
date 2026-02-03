import { cn } from "@/lib/utils";
import { formatDelta } from "@/lib/scopeCalculations";

interface ScopeDeltaPillProps {
  delta: number;
  className?: string;
}

export function ScopeDeltaPill({ delta, className }: ScopeDeltaPillProps) {
  const getColorClasses = () => {
    if (delta < 0) {
      // Negative delta = behind = red
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    }
    if (delta === 0) {
      // Zero = neutral
      return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
    // Positive delta = overdelivery = amber (NOT green!)
    return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full',
        getColorClasses(),
        className
      )}
    >
      {formatDelta(delta)}
    </span>
  );
}
