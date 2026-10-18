import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function ShimmerSkeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-surface-card border border-border/40',
        className
      )}
      aria-hidden="true"
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer motion-reduce:animate-none bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </div>
  );
}

export function NftCardSkeleton() {
  return (
    <div
      className="flex flex-col bg-surface-card border border-border rounded-lg p-3 w-full max-w-[280px] h-[360px]"
      aria-label="Carregando dados do NFT..."
      role="status"
    >
      <ShimmerSkeleton className="w-full h-[250px] rounded-md mb-3" />
      <ShimmerSkeleton className="w-3/4 h-5 rounded mb-2" />
      <div className="flex items-center justify-between mt-auto">
        <ShimmerSkeleton className="w-1/3 h-5 rounded" />
        <ShimmerSkeleton className="size-8 rounded-full" />
      </div>
    </div>
  );
}
