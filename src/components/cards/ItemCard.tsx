import { Link } from 'react-router-dom';
import type { RoomItem } from '../../types';
import { getArticlesByItem } from '../../data/articles';
import { getTopicsByItem } from '../../data/forum';
import { plural } from '../../lib/format';

/**
 * Карточка предмета (подкатегории). Используется на странице комнаты
 * в списочном режиме и в блоке «Частые вопросы» на главной.
 * Показывает, сколько внутри статей и обсуждений — пользователь понимает,
 * стоит ли туда заходить, ещё до клика.
 */
export function ItemCard({ item, index = 0 }: { item: RoomItem; index?: number }) {
  const articlesCount = getArticlesByItem(item.id).length;
  const topicsCount = getTopicsByItem(item.id).length;
  const Icon = item.icon;

  return (
    <Link
      to={`/room/${item.roomId}/${item.id}`}
      className="group flex animate-fade-up items-start gap-4 rounded-card border border-line bg-surface p-4 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:shadow-lift"
      style={{ animationDelay: `${Math.min(index, 6) * 50}ms` }}
    >
      <span
        aria-hidden="true"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-paper text-muted-strong transition-colors group-hover:bg-accent-soft group-hover:text-accent-strong"
      >
        <Icon className="h-5 w-5" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block font-display text-h3 font-bold text-ink transition-colors group-hover:text-accent-strong">
          {item.title}
        </span>
        <span className="mt-1 block text-caption text-muted">{item.summary}</span>
        <span className="mt-2 block text-caption text-muted">
          {articlesCount > 0
            ? `${articlesCount} ${plural(articlesCount, ['статья', 'статьи', 'статей'])}`
            : 'статей пока нет'}
          {topicsCount > 0 &&
            `, ${topicsCount} ${plural(topicsCount, ['обсуждение', 'обсуждения', 'обсуждений'])}`}
        </span>
      </span>
    </Link>
  );
}
