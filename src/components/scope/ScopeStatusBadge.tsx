import { cn } from "@/lib/utils";
import type { ScopeStatus } from "@/lib/scopeCalculations";

interface ScopeStatusBadgeProps {
  status: ScopeStatus;
  size?: 'sm' | 'md';
  className?: string;
}

const statusConfig: Record<ScopeStatus, { label: string; className: string }> = {
  OUT_OF_SCOPE: {
    label: 'Fora do escopo',
    className: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  },
  BEHIND: {
    label: 'Atrasado',
    className: 'bg-red-500 text-white',
  },
  ON_TRACK: {
    label: 'No prazo',
    className: 'bg-green-500 text-white',
  },
  OVERDELIVERY: {
    label: 'Excedido',
    className: 'bg-amber-500 text-white', // NEVER green for overdelivery
  },
};

export function ScopeStatusBadge({ status, size = 'md', className }: ScopeStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full whitespace-nowrap',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
