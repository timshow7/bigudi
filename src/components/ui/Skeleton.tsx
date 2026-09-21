import { cn } from '../../lib/cn';

/**
 * Серый прямоугольник-заглушка на время загрузки.
 * Блик реализован псевдоэлементом через overflow-hidden + animate-shimmer,
 * чтобы не тянуть отдельную библиотеку скелетонов.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('relative overflow-hidden rounded-ctl bg-line/60', className)}
    >
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent" />
    </div>
  );
}

/** Скелетон одной карточки статьи — повторяет её реальные пропорции */
export function ArticleCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface">
      <Skeleton className="h-36 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );
}

/** Скелетон карточки темы форума */
export function TopicCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-card border border-line bg-surface p-5">
      <Skeleton className="hidden h-16 w-16 shrink-0 sm:block" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-5 w-3/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}

/** Скелетон страницы статьи: заголовок, обложка и несколько абзацев */
export function ArticlePageSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-9 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-56 w-full rounded-card" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-11/12" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );
}
