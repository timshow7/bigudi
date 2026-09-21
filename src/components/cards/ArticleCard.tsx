import { Link } from 'react-router-dom';
import { Clock, Heart } from 'lucide-react';
import type { Article } from '../../types';
import { getItem } from '../../data/rooms';
import { Chip } from '../ui/Chip';

/**
 * Обложка статьи. Вместо стоковых фото — генеративная SVG-обложка:
 * мягкий градиент + крупная иконка предмета + повторяющийся узор.
 * Картинка детерминирована: одна и та же статья всегда выглядит одинаково.
 */
function ArticleCover({ article }: { article: Article }) {
  const item = getItem(article.itemId);
  const Icon = item?.icon;

  // Сумма кодов символов id → угол градиента. Просто чтобы обложки отличались.
  const seed = article.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const rotation = seed % 40;

  return (
    <div className="relative h-36 overflow-hidden bg-paper">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${120 + rotation}deg, #FBEDE7 0%, #FAF6F0 55%, #F1EAE0 100%)`,
        }}
      />
      {/* Диагональные полосы — лёгкая текстура, чтобы обложка не была пустой */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.35]" aria-hidden="true">
        <defs>
          <pattern id={`stripes-${article.id}`} width="14" height="14" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="14" stroke="#E8E2D9" strokeWidth="2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#stripes-${article.id})`} />
      </svg>
      {Icon && (
        <Icon
          className="absolute -bottom-3 right-3 h-24 w-24 text-accent opacity-30 transition-transform duration-300 group-hover:scale-105"
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export function ArticleCard({ article, index = 0 }: { article: Article; index?: number }) {
  const item = getItem(article.itemId);

  return (
    <article
      className="group flex w-full animate-fade-up"
      style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
    >
      <Link
        to={`/article/${article.id}`}
        className="flex h-full w-full flex-col overflow-hidden rounded-card border border-line bg-surface shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
      >
        <ArticleCover article={article} />

        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-h3 text-ink transition-colors group-hover:text-accent-strong">
            {article.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-caption text-muted">{article.excerpt}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {article.topics.slice(0, 2).map((topic) => (
              <Chip key={topic}>{topic}</Chip>
            ))}
          </div>

          {/* Мета внизу карточки: время чтения и лайки.
              Иконки вместо слов — строка короче и не переносится. */}
          <div className="mt-auto flex items-center gap-4 pt-4 text-caption text-muted">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {article.minutes} мин
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="h-4 w-4" aria-hidden="true" />
              {article.likes}
              <span className="sr-only">лайков</span>
            </span>
            {item && <span className="ml-auto truncate text-muted">{item.title}</span>}
          </div>
        </div>
      </Link>
    </article>
  );
}
