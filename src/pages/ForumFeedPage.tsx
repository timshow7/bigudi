import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Clock, Flame, Plus } from 'lucide-react';
import { Button, LinkButton } from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import { SearchInput } from '../components/ui/SearchInput';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { EmptyState } from '../components/ui/EmptyState';
import { TopicCardSkeleton } from '../components/ui/Skeleton';
import { Avatar } from '../components/ui/Avatar';
import { TopicCard } from '../components/cards/TopicCard';
import { forumTopics } from '../data/forum';
import { getItem, rooms } from '../data/rooms';
import { topUsers } from '../data/users';
import { useSimulatedLoad } from '../hooks/useSimulatedLoad';
import { useAppState } from '../store/AppState';
import { plural } from '../lib/format';

type SortMode = 'fresh' | 'hot';
type StatusFilter = 'all' | 'solved' | 'unanswered';

/**
 * Экран 5 — общая лента форума.
 *
 * Фильтр по комнатам, а не по произвольным тегам: форум и статьи живут
 * в одной системе координат квартиры, поэтому «Ванная» здесь значит
 * ровно то же, что на главной.
 */
export function ForumFeedPage() {
  const [searchParams] = useSearchParams();
  const shouldFail = searchParams.get('fail') === '1';

  const [query, setQuery] = useState('');
  const [roomFilter, setRoomFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sort, setSort] = useState<SortMode>('fresh');

  // Свои темы идут первыми: человек только что их создал и ищет глазами
  const { ownTopics } = useAppState();
  const { status, data, retry } = useSimulatedLoad(
    // Ключ включает число своих тем — иначе после создания темы
    // лента не перезагрузится и новая тема в ней не появится
    `forum-feed-${ownTopics.length}`,
    () => [...ownTopics, ...forumTopics],
    { fail: shouldFail },
  );

  const visibleTopics = useMemo(() => {
    if (!data) return [];

    const normalizedQuery = query.trim().toLowerCase();

    const filtered = data.filter((topic) => {
      if (normalizedQuery) {
        const haystack = `${topic.title} ${topic.excerpt} ${topic.tags.join(' ')}`.toLowerCase();
        if (!haystack.includes(normalizedQuery)) return false;
      }

      if (roomFilter) {
        const item = getItem(topic.itemId);
        if (item?.roomId !== roomFilter) return false;
      }

      if (statusFilter === 'solved' && !topic.solved) return false;
      if (statusFilter === 'unanswered' && topic.answers > 0) return false;

      return true;
    });

    // Сортируем копию: сортировка на месте перемешала бы исходные данные
    return [...filtered].sort((a, b) =>
      sort === 'hot'
        ? b.answers - a.answers
        : new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime(),
    );
  }, [data, query, roomFilter, statusFilter, sort]);

  const hasActiveFilters = Boolean(query) || roomFilter !== null || statusFilter !== 'all';

  function resetFilters() {
    setQuery('');
    setRoomFilter(null);
    setStatusFilter('all');
  }

  return (
    <div className="container-page pb-4 pt-8">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-h1 text-ink md:text-h1-lg">Форум</h1>
          <p className="mt-2 max-w-[56ch] text-body text-muted-strong">
            Вопросы, на которые нет готовой статьи. Отвечают такие же студенты и те, кто уже
            разобрался.
          </p>
        </div>

        <LinkButton to="/forum/new" variant="forum" iconLeft={<Plus className="h-4 w-4" aria-hidden="true" />}>
            Создать тему
          </LinkButton>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          {/* ── Панель фильтров ─────────────────────────────────────────── */}
          <div className="rounded-card border border-line bg-surface p-4 sm:p-5">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Искать по вопросам"
            />

            <div className="mt-4 flex flex-wrap gap-2">
              <Chip selected={roomFilter === null} onToggle={() => setRoomFilter(null)}>
                Все комнаты
              </Chip>
              {rooms.map((room) => (
                <Chip
                  key={room.id}
                  selected={roomFilter === room.id}
                  onToggle={() => setRoomFilter(roomFilter === room.id ? null : room.id)}
                >
                  {room.title}
                </Chip>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              <div className="flex flex-wrap gap-2">
                <Chip
                  selected={statusFilter === 'solved'}
                  onToggle={() => setStatusFilter(statusFilter === 'solved' ? 'all' : 'solved')}
                >
                  С решением
                </Chip>
                <Chip
                  selected={statusFilter === 'unanswered'}
                  onToggle={() =>
                    setStatusFilter(statusFilter === 'unanswered' ? 'all' : 'unanswered')
                  }
                >
                  Без ответов
                </Chip>
              </div>

              <SegmentedControl<SortMode>
                ariaLabel="Порядок тем"
                value={sort}
                onChange={setSort}
                options={[
                  { value: 'fresh', label: 'Свежие', icon: Clock },
                  { value: 'hot', label: 'Обсуждаемые', icon: Flame },
                ]}
              />
            </div>
          </div>

          {/* ── Лента ───────────────────────────────────────────────────── */}
          <div className="mt-6">
            {status === 'loading' && (
              <div className="flex flex-col gap-4" aria-busy="true" aria-live="polite">
                <span className="sr-only">Загружаем темы</span>
                {[0, 1, 2, 3].map((index) => (
                  <TopicCardSkeleton key={index} />
                ))}
              </div>
            )}

            {status === 'error' && (
              <EmptyState
                variant="error"
                title="Лента не загрузилась"
                description="Сервер не ответил. Проверьте соединение и обновите ленту — фильтры останутся на месте."
                action={<Button onClick={retry}>Обновить</Button>}
              />
            )}

            {status === 'ready' && visibleTopics.length === 0 && (
              <EmptyState
                variant="search"
                title="Таких вопросов пока нет"
                description="Попробуйте снять фильтры или задайте вопрос сами — обычно на новые темы отвечают в тот же день."
                action={
                  <div className="flex flex-wrap justify-center gap-2">
                    {hasActiveFilters && (
                      <Button variant="secondary" onClick={resetFilters}>
                        Сбросить фильтры
                      </Button>
                    )}
                    <LinkButton to="/forum/new" variant="forum">Задать вопрос</LinkButton>
                  </div>
                }
              />
            )}

            {status === 'ready' && visibleTopics.length > 0 && (
              <>
                <p className="mb-4 text-caption text-muted-strong" aria-live="polite">
                  {visibleTopics.length}{' '}
                  {plural(visibleTopics.length, ['тема', 'темы', 'тем'])}
                  {hasActiveFilters && ` из ${data?.length ?? 0}`}
                </p>
                <ul className="flex flex-col gap-4">
                  {visibleTopics.map((topic, index) => (
                    <li key={topic.id}>
                      <TopicCard topic={topic} index={index} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {/* ── Боковая панель ─────────────────────────────────────────────── */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-[88px] lg:self-start">
          <section className="rounded-card border border-line bg-surface p-5">
            <h2 className="text-h3 text-ink">Как спросить, чтобы ответили</h2>
            <ul className="mt-3 space-y-2 text-caption text-muted-strong">
              <li>Опишите, что уже пробовали сделать.</li>
              <li>Назовите технику и условия: модель, сколько лет, как часто.</li>
              <li>Один вопрос — одна тема, так проще искать другим.</li>
            </ul>
            <Link
              to="/rules"
              className="mt-4 inline-flex h-11 items-center text-caption font-semibold text-forum-strong transition-colors hover:text-forum"
            >
              Правила форума
            </Link>
          </section>

          {/* Топ участников — видимая часть системы рейтинга из ТЗ */}
          <section className="rounded-card border border-line bg-surface p-5">
            <h2 className="text-h3 text-ink">Кто больше всех помогает</h2>
            <ol className="mt-3 space-y-1">
              {topUsers.map((user, index) => (
                <li key={user.nickname} className="flex items-center gap-3 py-1.5">
                  <span className="w-4 shrink-0 text-caption text-muted">{index + 1}</span>
                  <Avatar nickname={user.nickname} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-caption font-semibold text-ink">
                      {user.nickname}
                    </span>
                    <span className="block text-[13px] text-muted">{user.level}</span>
                  </span>
                  <span className="shrink-0 text-caption font-semibold text-forum-strong">
                    {user.rating}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </div>
  );
}
