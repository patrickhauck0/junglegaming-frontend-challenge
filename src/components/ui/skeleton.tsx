import * as React from 'react';
import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-surface-card border border-border/40',
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer motion-reduce:animate-none bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </div>
  );
}

export { Skeleton };
