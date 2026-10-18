import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center font-mono text-[12px] font-bold transition-colors focus:outline-none focus:ring-1 focus:ring-primary',
  {
    variants: {
      variant: {
        default: 'bg-primary text-ink rounded-[4px] px-2 py-0.5',
        secondary: 'bg-surface-raised text-foreground border border-border rounded-[4px] px-2 py-0.5',
        outline: 'border border-border text-secondary rounded-[4px] px-2 py-0.5',
        accent: 'bg-[#38220F] border border-[#55321F] text-text-accent rounded-[6px] px-2 py-1',
        pill: 'rounded-full px-3 py-1 bg-surface-raised border border-border text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants };
