import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { BookOpen, CheckCircle2, Clock, Eye, MessageCircle, ThumbsUp } from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button, LinkButton } from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import { EmptyState } from '../components/ui/EmptyState';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { UserLine } from '../components/ui/UserLine';
import { Skeleton } from '../components/ui/Skeleton';
import { ReplyItem } from '../components/forum/ReplyItem';
import { ReplyForm } from '../components/forum/ReplyForm';
import { getTopic, getTopicsByItem } from '../data/forum';
import { getReplies } from '../data/replies';
import { getArticlesByItem } from '../data/articles';
import { getItem, getRoom } from '../data/rooms';
import { useSimulatedLoad } from '../hooks/useSimulatedLoad';
import { useAppState } from '../store/AppState';
import { plural } from '../lib/format';

type ReplySort = 'useful' | 'new';

/**
 * Экран 6 — тема форума.
 *
 * Новый ответ добавляется в локальный список и сразу появляется в треде:
 * без этого форма выглядит сломанной. Когда появится бэкенд, ответ так же
 * добавится оптимистично, просто после успешного запроса.
 */
export function ForumTopicPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const [searchParams] = useSearchParams();
  const shouldFail = searchParams.get('fail') === '1';

  const { profile, ownTopics, ownReplies, addReply } = useAppState();

  // Тема может быть как из данных проекта, так и созданной через форму
  const topic = getTopic(topicId) ?? ownTopics.find((own) => own.id === topicId);

  const { status, data, retry } = useSimulatedLoad(
    `replies-${topicId}`,
    () => getReplies(topicId ?? ''),
    { fail: shouldFail, delay: 450 },
  );

  const [sort, setSort] = useState<ReplySort>('useful');

  const repliesForTopic = useMemo(
    () => ownReplies.filter((reply) => reply.topicId === topicId),
    [ownReplies, topicId],
  );

  const replies = useMemo(() => {
    const all = [...(data ?? []), ...repliesForTopic];

    return [...all].sort((a, b) => {
      // Решение всегда первое: за ним человек и пришёл
      if (a.accepted !== b.accepted) return a.accepted ? -1 : 1;
      return sort === 'useful'
        ? b.votes - a.votes
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [data, repliesForTopic, sort]);

  if (!topic) {
    return (
      <div className="container-page py-16">
        <EmptyState
          variant="search"
          title="Тема не найдена"
          description="Возможно, её удалил модератор или ссылка устарела. Посмотрите ленту форума — вопрос могли задать заново."
          action={
            <LinkButton to="/forum" variant="forum">К ленте форума</LinkButton>
          }
        />
      </div>
    );
  }

  const item = getItem(topic.itemId);
  const room = item ? getRoom(item.roomId) : undefined;
  const relatedArticles = getArticlesByItem(topic.itemId).slice(0, 3);
  const relatedTopics = getTopicsByItem(topic.itemId).filter((other) => other.id !== topic.id).slice(0, 3);

  function handleReply(text: string) {
    addReply({
      id: `reply-${Date.now()}`,
      topicId: topic!.id,
      author: profile.name,
      text,
      votes: 0,
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <div className="container-page pb-4 pt-2">
      <Breadcrumbs
        items={[
          { label: 'Главная', to: '/' },
          { label: 'Форум', to: '/forum' },
          ...(item && room ? [{ label: item.title, to: `/room/${room.id}/${item.id}` }] : []),
          { label: topic.title },
        ]}
      />

      <div className="mt-2 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          {/* ── Вопрос ──────────────────────────────────────────────────── */}
          <article className="rounded-card border border-line bg-surface p-5 sm:p-6">
            <h1 className="max-w-[28ch] text-h1 text-ink md:text-h1-lg">{topic.title}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-caption text-muted">
              <span className="flex items-center gap-1.5">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                {replies.length} {plural(replies.length, ['ответ', 'ответа', 'ответов'])}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" aria-hidden="true" />
                {topic.views}
                <span className="sr-only">просмотров</span>
              </span>
              <span>{topic.lastActivity}</span>
              {topic.solved && (
                <span className="flex items-center gap-1.5 text-forum-strong">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  есть решение
                </span>
              )}
            </div>

            <p className="mt-5 max-w-[68ch] whitespace-pre-line text-body text-ink">{topic.excerpt}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {topic.tags.map((tag) => (
                <Chip key={tag} tone="forum">
                  {tag}
                </Chip>
              ))}
            </div>

            <div className="mt-5 border-t border-line pt-5">
              <UserLine nickname={topic.author} meta="автор вопроса" size="sm" />
            </div>
          </article>

          {/* ── Ответы ──────────────────────────────────────────────────── */}
          <section aria-labelledby="replies-title" className="mt-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 id="replies-title" className="text-h2 text-ink">
                {replies.length} {plural(replies.length, ['ответ', 'ответа', 'ответов'])}
              </h2>

              {replies.length > 1 && (
                <SegmentedControl<ReplySort>
                  ariaLabel="Порядок ответов"
                  value={sort}
                  onChange={setSort}
                  options={[
                    { value: 'useful', label: 'Полезные', icon: ThumbsUp },
                    { value: 'new', label: 'Новые', icon: Clock },
                  ]}
                />
              )}
            </div>

            {status === 'loading' && (
              <div className="flex flex-col gap-4" aria-busy="true" aria-live="polite">
                <span className="sr-only">Загружаем ответы</span>
                {[0, 1].map((index) => (
                  <div key={index} className="rounded-card border border-line bg-surface p-5">
                    <div className="flex gap-4">
                      <Skeleton className="h-24 w-11 shrink-0" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {status === 'error' && (
              <EmptyState
                variant="error"
                title="Ответы не загрузились"
                description="Сам вопрос на месте, а ответы не пришли — скорее всего, пропала связь. Попробуйте ещё раз."
                action={<Button onClick={retry}>Повторить</Button>}
              />
            )}

            {status === 'ready' && replies.length === 0 && (
              <EmptyState
                title="Ответов пока нет"
                description="Вы можете ответить первым. Даже короткий ответ из личного опыта обычно помогает больше, чем поиск в интернете."
              />
            )}

            {status === 'ready' && replies.length > 0 && (
              <ul className="flex flex-col gap-4">
                {replies.map((reply, index) => (
                  <li key={reply.id}>
                    <ReplyItem reply={reply} index={index} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="mt-8">
            <ReplyForm onSubmit={handleReply} />
          </div>
        </div>

        {/* ── Боковая панель: мост обратно к статьям ─────────────────────── */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-[88px] lg:self-start">
          {item && relatedArticles.length > 0 && (
            <section className="rounded-card border border-line bg-surface p-5">
              <h2 className="text-h3 text-ink">Статьи по теме</h2>
              <ul className="mt-3 space-y-1">
                {relatedArticles.map((article) => (
                  <li key={article.id}>
                    <Link
                      to={`/article/${article.id}`}
                      className="flex min-h-[44px] items-start gap-2.5 rounded-ctl px-2 py-2 text-caption text-muted-strong transition-colors hover:bg-paper hover:text-ink"
                    >
                      <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                      {article.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {relatedTopics.length > 0 && (
            <section className="rounded-card border border-line bg-surface p-5">
              <h2 className="text-h3 text-ink">Похожие вопросы</h2>
              <ul className="mt-3 space-y-1">
                {relatedTopics.map((other) => (
                  <li key={other.id}>
                    <Link
                      to={`/forum/${other.id}`}
                      className="flex min-h-[44px] items-center rounded-ctl px-2 py-2 text-caption text-muted-strong transition-colors hover:bg-paper hover:text-ink"
                    >
                      {other.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
