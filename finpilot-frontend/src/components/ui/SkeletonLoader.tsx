'use client';

import { cn } from '@/lib/utils';

type SkeletonVariant = 'card' | 'text' | 'chart' | 'avatar' | 'table';

interface SkeletonLoaderProps {
  variant?: SkeletonVariant;
  className?: string;
  count?: number;
}

function Pulse({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700/50',
        className
      )}
      style={style}
    />
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Pulse className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Pulse className="h-4 w-24" />
          <Pulse className="h-3 w-16" />
        </div>
      </div>
      <Pulse className="h-8 w-32" />
      <Pulse className="h-3 w-20" />
    </div>
  );
}

function TextSkeleton() {
  return (
    <div className="space-y-3">
      <Pulse className="h-4 w-full" />
      <Pulse className="h-4 w-4/5" />
      <Pulse className="h-4 w-3/5" />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 p-6 space-y-4">
      <Pulse className="h-5 w-40" />
      <div className="flex items-end gap-2 h-48">
        {Array.from({ length: 8 }).map((_, i) => (
          <Pulse
            key={i}
            className="flex-1 rounded-t-md"
            style={{ height: `${30 + Math.random() * 70}%` } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}

function AvatarSkeleton() {
  return <Pulse className="h-10 w-10 rounded-full" />;
}

function TableSkeleton() {
  return (
    <div className="rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 p-6 space-y-3">
      <div className="flex gap-4">
        <Pulse className="h-4 flex-1" />
        <Pulse className="h-4 flex-1" />
        <Pulse className="h-4 flex-1" />
        <Pulse className="h-4 flex-1" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          <Pulse className="h-8 w-8 rounded-full" />
          <Pulse className="h-4 flex-1" />
          <Pulse className="h-4 flex-1" />
          <Pulse className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

const variantMap: Record<SkeletonVariant, React.FC> = {
  card: CardSkeleton,
  text: TextSkeleton,
  chart: ChartSkeleton,
  avatar: AvatarSkeleton,
  table: TableSkeleton,
};

export default function SkeletonLoader({
  variant = 'card',
  className,
  count = 1,
}: SkeletonLoaderProps) {
  const Component = variantMap[variant];
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
    </div>
  );
}
