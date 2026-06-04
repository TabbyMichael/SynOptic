import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  label: string;
  variant: string;
  className?: string;
}

export function StatusBadge({ label, variant, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variant,
        className
      )}
    >
      {label}
    </span>
  );
}
