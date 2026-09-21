import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Clock, Eye } from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button, LinkButton } from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import { EmptyState } from '../components/ui/EmptyState';
import { ArticlePageSkeleton } from '../components/ui/Skeleton';
import { ArticleBody, ArticleToc } from '../components/article/ArticleBody';
import { ArticleActions } from '../components/article/ArticleActions';
import { ArticleCard } from '../components/cards/ArticleCard';
import { TopicCard } from '../components/cards/TopicCard';
import { AskOnForum } from '../components/blocks/AskOnForum';
import { getArticle, getArticlesByItem } from '../data/articles';
import { getArticleBody } from '../data/articleBodies';
import { getTopicsByItem } from '../data/forum';
import { getItem, getRoom } from '../data/rooms';
import { useSimulatedLoad } from '../hooks/useSimulatedLoad';
import { formatDate } from '../lib/format';

/**
 * Экран 4 — статья.
 *
 * Колонка с текстом узкая (около 68 символов в строке) и прижата влево,
 * а не растянута на всю ширину: длинные строки читаются заметно хуже.
 * Справа — оглавление, которое подсвечивает текущий раздел.
 */
export function ArticlePage() {
  const { articleId } = useParams<{ articleId: string }>();
  const [searchParams] = useSearchParams();

  const article = getArticle(articleId);
  const shouldFail = searchParams.get('fail') === '1';

  const { status, retry } = useSimulatedLoad(`article-${articleId}`, () => article, {
    fail: shouldFail,
    delay: 450,
  });

  if (!article) {
    return (
      <div className="container-page py-16">
        <EmptyState
          variant="search"
          title="Статья не найдена"
          description="Возможно, её переименовали или ссылка устарела. Посмотрите другие материалы раздела."
          action={
            <LinkButton to="/">К плану квартиры</LinkButton>
          }
        />
      </div>
    );
  }

  const item = getItem(article.itemId);
  const room = item ? getRoom(item.roomId) : undefined;
  const body = getArticleBody(article.id);

  // Соседние материалы: та же подкатегория, кроме текущей статьи
  const relatedArticles = getArticlesByItem(article.itemId)
    .filter((related) => related.id !== article.id)
    .slice(0, 2);
  const relatedTopics = getTopicsByItem(article.itemId).slice(0, 2);

  return (
    <div className="container-page pb-4 pt-2">
      <Breadcrumbs
        items={[
          { label: 'Главная', to: '/' },
          ...(room ? [{ label: room.title, to: `/room/${room.id}` }] : []),
          ...(item && room ? [{ label: item.title, to: `/room/${room.id}/${item.id}` }] : []),
          { label: article.title },
        ]}
      />

      {status === 'error' ? (
        <div className="py-8">
          <EmptyState
            variant="error"
            title="Статья не загрузилась"
            description="Связь с сервером пропала на середине. Текст никуда не делся — попробуйте ещё раз."
            action={<Button onClick={retry}>Повторить</Button>}
          />
        </div>
      ) : (
        <div className="mt-2 grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px]">
          <article>
            <header>
              <h1 className="max-w-[24ch] text-h1 text-ink md:text-h1-lg">{article.title}</h1>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-caption text-muted">
                <span>{article.author}</span>
                <span>{formatDate(article.date)}</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  {article.minutes} мин
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  {article.views}
                  <span className="sr-only">просмотров</span>
                </span>
              </div>

              <p className="mt-5 max-w-[62ch] border-l-2 border-accent pl-4 text-body text-muted-strong">
                {article.excerpt}
              </p>
            </header>

            <div className="mt-8">
              {status === 'loading' ? (
                <ArticlePageSkeleton />
              ) : body ? (
                <ArticleBody blocks={body} />
              ) : (
                // Честное состояние: карточка статьи есть, текст ещё не написан.
                // В прототипе полностью наполнен раздел «Стиральная машина».
                <EmptyState
                  title="Текст ещё готовится"
                  description="В прототипе целиком написан раздел «Стиральная машина» — откройте любую статью оттуда, чтобы увидеть экран с полным текстом."
                  action={
                    <LinkButton to="/room/bathroom/washing-machine" variant="secondary">Открыть раздел «Стиральная машина»</LinkButton>
                  }
                />
              )}
            </div>

            {status === 'ready' && (
              <>
                <div className="mt-10 flex flex-wrap gap-2">
                  {article.topics.map((topic) => (
                    <Chip key={topic}>{topic}</Chip>
                  ))}
                </div>

                <div className="mt-6 border-t border-line pt-6">
                  <ArticleActions articleId={article.id} initialLikes={article.likes} />
                </div>
              </>
            )}
          </article>

          {/* Оглавление: на мобильном скрыто — там оно занимало бы целый экран
              перед началом текста */}
          <aside className="hidden lg:block">{body && <ArticleToc blocks={body} />}</aside>
        </div>
      )}

      {/* ── Связанные материалы ──────────────────────────────────────────── */}
      {relatedTopics.length > 0 && (
        <section aria-labelledby="related-topics" className="mt-16">
          <h2 id="related-topics" className="text-h2 text-ink">
            Обсуждают по этой теме
          </h2>
          <ul className="mt-5 flex flex-col gap-4">
            {relatedTopics.map((topic, index) => (
              <li key={topic.id}>
                <TopicCard topic={topic} index={index} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {relatedArticles.length > 0 && (
        <section aria-labelledby="related-articles" className="mt-14">
          <h2 id="related-articles" className="text-h2 text-ink">
            Читать дальше
          </h2>
          <ul className="mt-5 grid gap-5 sm:grid-cols-2">
            {relatedArticles.map((related, index) => (
              <li key={related.id} className="flex">
                <ArticleCard article={related} index={index} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {item && (
        <div className="mt-14">
          <AskOnForum itemTitle={item.title} />
        </div>
      )}
    </div>
  );
}
