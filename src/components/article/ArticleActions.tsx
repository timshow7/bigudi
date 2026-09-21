import { useState } from 'react';
import { Bookmark, Check, Heart, Link2 } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useAppState } from '../../store/AppState';

/**
 * Лайк, сохранение и ссылка. Состояние пока локальное (useState) —
 * когда появится авторизация, сюда придут данные пользователя,
 * а разметка и состояния кнопок останутся теми же.
 *
 * Все три кнопки — переключатели, поэтому у них aria-pressed:
 * скринридер должен слышать не «кнопка лайк», а «лайк, нажато».
 */
export function ArticleActions({ articleId, initialLikes }: { articleId: string; initialLikes: number }) {
  // Лайк и сохранение больше не локальные: сохранённые статьи показывает
  // профиль, а лайк должен пережить переход на другую страницу
  const { likedArticleIds, toggleLikedArticle, isArticleSaved, toggleSavedArticle } = useAppState();
  const [isCopied, setCopied] = useState(false);

  const isLiked = likedArticleIds.includes(articleId);
  const isSaved = isArticleSaved(articleId);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API недоступен без https или разрешения — молча ничего
      // не делаем, ломать страницу из-за этого не стоит
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => toggleLikedArticle(articleId)}
        aria-pressed={isLiked}
        className={cn(
          'flex h-11 items-center gap-2 rounded-ctl border px-4 text-caption font-semibold transition-colors',
          isLiked
            ? 'border-accent-strong bg-accent-soft text-accent-strong'
            : 'border-line bg-surface text-muted-strong hover:border-accent hover:text-accent-strong',
        )}
      >
        <Heart className={cn('h-4 w-4', isLiked && 'fill-current')} aria-hidden="true" />
        {initialLikes + (isLiked ? 1 : 0)}
        <span className="sr-only">Полезная статья</span>
      </button>

      <button
        type="button"
        onClick={() => toggleSavedArticle(articleId)}
        aria-pressed={isSaved}
        className={cn(
          'flex h-11 items-center gap-2 rounded-ctl border px-4 text-caption font-semibold transition-colors',
          isSaved
            ? 'border-forum bg-forum-soft text-forum-strong'
            : 'border-line bg-surface text-muted-strong hover:border-forum hover:text-forum-strong',
        )}
      >
        <Bookmark className={cn('h-4 w-4', isSaved && 'fill-current')} aria-hidden="true" />
        {isSaved ? 'Сохранено' : 'Сохранить'}
      </button>

      <button
        type="button"
        onClick={copyLink}
        className="flex h-11 items-center gap-2 rounded-ctl border border-line bg-surface px-4 text-caption font-semibold text-muted-strong transition-colors hover:border-accent hover:text-accent-strong"
      >
        {isCopied ? (
          <Check className="h-4 w-4 text-forum-strong" aria-hidden="true" />
        ) : (
          <Link2 className="h-4 w-4" aria-hidden="true" />
        )}
        {isCopied ? 'Скопировано' : 'Ссылка'}
      </button>

      {/* Сообщение для скринридера: визуально его заменяет смена текста кнопки */}
      <span role="status" aria-live="polite" className="sr-only">
        {isCopied ? 'Ссылка скопирована' : ''}
      </span>
    </div>
  );
}
