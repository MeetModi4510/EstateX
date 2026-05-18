import React from 'react';
import { cn } from '../../utils/cn';

export const PropertyCardSkeleton = ({ isListMode = false }: { isListMode?: boolean }) => (
  <div className={cn(
    "bg-white rounded-2xl overflow-hidden shadow-soft border border-neutral-border flex",
    isListMode ? "flex-col sm:flex-row h-auto sm:h-64" : "flex-col h-[460px]"
  )}>
    <div className={cn(
      "bg-neutral-bg-secondary animate-pulse",
      isListMode ? "w-full sm:w-2/5 h-64 sm:h-full" : "w-full h-64"
    )} />
    <div className="p-5 flex-1 flex flex-col justify-between">
      <div>
        <div className="flex justify-between mb-4">
          <div className="w-1/3 h-8 bg-neutral-bg-secondary rounded-lg animate-pulse" />
          <div className="w-20 h-6 bg-neutral-bg-secondary rounded-lg animate-pulse" />
        </div>
        <div className="w-3/4 h-6 bg-neutral-bg-secondary rounded-lg animate-pulse mb-3" />
        <div className="w-1/2 h-4 bg-neutral-bg-secondary rounded-lg animate-pulse mb-6" />
        <div className="flex gap-4 border-y border-neutral-divider py-4">
          <div className="w-16 h-4 bg-neutral-bg-secondary rounded animate-pulse" />
          <div className="w-16 h-4 bg-neutral-bg-secondary rounded animate-pulse" />
          <div className="w-20 h-4 bg-neutral-bg-secondary rounded animate-pulse" />
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <div className="flex-1 h-10 bg-neutral-bg-secondary rounded-xl animate-pulse" />
        <div className="flex-1 h-10 bg-neutral-bg-secondary rounded-xl animate-pulse" />
      </div>
    </div>
  </div>
);

export const LoadingSkeletons = ({ count = 6, isListMode = false }: { count?: number, isListMode?: boolean }) => (
  <div className={cn(
    "grid gap-6 w-full",
    isListMode ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
  )}>
    {Array.from({ length: count }).map((_, i) => (
      <PropertyCardSkeleton key={i} isListMode={isListMode} />
    ))}
  </div>
);
