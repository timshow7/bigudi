import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { BookOpen, MessageCircle, Plus, RotateCw } from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Tabs } from '../components/ui/Tabs';
import { Button, LinkButton } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { ArticleCardSkeleton } from '../components/ui/Skeleton';
import { ArticleCard } from '../components/cards/ArticleCard';
import { TopicCard } from '../components/cards/TopicCard';
import { AskOnForum } from '../components/blocks/AskOnForum';
import {
  FilterPanel,
  emptyFormatFilters,
  type FormatFilters,
} from '../components/blocks/FilterPanel';
import { getItem, getRoom } from '../data/rooms';
import { getArticlesByItem } from '../data/articles';
import { getTopicsByItem } from '../data/forum';
import { useSimulatedLoad } from '../hooks/useSimulatedLoad';
import { plural } from '../lib/format';

type ContentTab = 'articles' | 'topics';

/**
 * Страница подкатегории — здесь сходятся обе половины сервиса.
 *
 * Развилка «статьи или форум», которую мы долго обсуждали, решена табами:
 * пользователь уже выбрал тему (стиральная машина), и переключение между
 * проверенной инструкцией и живым обсуждением не уводит его со страницы.
 *
 * Состояния загрузки и ошибки настоящие: данные проходят через
 * useSimulatedLoad. Чтобы посмотреть экран ошибки, добавьте к адресу ?fail=1.
 */
export function SubcategoryPage() {
  const { roomId, itemId } = useParams<{ roomId: string; itemId: string }>();
  const [searchParams] = useSearchParams();

  const room = getRoom(roomId);
  const item = getItem(itemId);

  const [tab, setTab] = useState<ContentTab>('articles');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [formats, setFormats] = useState<FormatFilters>(emptyFormatFilters);

  // Переходим к другому предмету — сбрасываем фильтры и возвращаемся
  // на вкладку статей: старые фильтры к новой теме не относятся
  useEffect(() => {
    setSelectedTopics([]);
    setFormats(emptyFormatFilters);
    setTab('articles');
  }, [itemId]);

  const shouldFail = searchParams.get('fail') === '1';

  const {
    status,
    data: articles,
    retry,
  } = useSimulatedLoad(`articles-${itemId}`, () => getArticlesByItem(itemId ?? ''), {
    fail: shouldFail,
  });

  const topics = useMemo(() => getTopicsByItem(itemId ?? ''), [itemId]);

  const filteredArticles = useMemo(() => {
    if (!articles) return [];

    return articles.filter((article) => {
      const topicMatches =
        selectedTopics.length === 0 || article.topics.some((topic) => selectedTopics.includes(topic));
      if (!topicMatches) return false;
      if (formats.forNovice && !article.forNovice) return false;
      if (formats.hasSteps && !article.hasSteps) return false;
      if (formats.hasPhoto && !article.hasPhoto) return false;
      if (formats.short && article.minutes > 5) return false;
      return true;
    });
  }, [articles, selectedTopics, formats]);

  if (!room || !item) {
    return (
      <div className="container-page py-16">
        <EmptyState
          variant="error"
          title="Раздел не найден"
          description="Такой темы в квартире нет. Скорее всего, ссылка устарела — начните с плана квартиры."
          action={
            <LinkButton to="/">К плану квартиры</LinkButton>
          }
        />
      </div>
    );
  }

  const activeFilterCount = selectedTopics.length + Object.values(formats).filter(Boolean).length;

  function toggleTopic(topic: string) {
    setSelectedTopics((current) =>
      current.includes(topic) ? current.filter((value) => value !== topic) : [...current, topic],
    );
  }

  function resetFilters() {
    setSelectedTopics([]);
    setFormats(emptyFormatFilters);
  }

  return (
    <div className="container-page pb-4 pt-2">
      <Breadcrumbs
        items={[
          { label: 'Главная', to: '/' },
          { label: room.title, to: `/room/${room.id}` },
          { label: item.title },
        ]}
      />

      <header className="mb-6 mt-2">
        <h1 className="text-h1 text-ink md:text-h1-lg">{item.title}</h1>
        <p className="mt-2 max-w-[60ch] text-body text-muted-strong">{item.summary}</p>
      </header>

      <Tabs
        ariaLabel="Статьи или обсуждения"
        value={tab}
        onChange={(value) => setTab(value as ContentTab)}
        items={[
          { id: 'articles', label: 'Статьи', count: articles?.length ?? 0, icon: BookOpen },
          { id: 'topics', label: 'Обсуждения', count: topics.length, icon: MessageCircle },
        ]}
      />

      {tab === 'articles' ? (
        <div
          id="panel-articles"
          role="tabpanel"
          aria-labelledby="tab-articles"
          tabIndex={0}
          className="mt-6 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]"
        >
          <aside>
            <FilterPanel
              topics={item.topics}
              selectedTopics={selectedTopics}
              onToggleTopic={toggleTopic}
              formats={formats}
              onToggleFormat={(key, value) => setFormats((current) => ({ ...current, [key]: value }))}
              onReset={resetFilters}
              activeCount={activeFilterCount}
              resultCount={filteredArticles.length}
              disabled={status !== 'ready'}
            />
          </aside>

          <div>
            {/* 1. Загрузка */}
            {status === 'loading' && (
              <div className="grid gap-5 sm:grid-cols-2" aria-busy="true" aria-live="polite">
                <span className="sr-only">Загружаем статьи</span>
                {[0, 1, 2, 3].map((index) => (
                  <ArticleCardSkeleton key={index} />
                ))}
              </div>
            )}

            {/* 2. Ошибка запроса */}
            {status === 'error' && (
              <EmptyState
                variant="error"
                title="Не удалось загрузить статьи"
                description="Похоже, пропала связь с сервером. Проверьте интернет и попробуйте ещё раз — фильтры сохранятся."
                action={
                  <Button
                    onClick={retry}
                    iconLeft={<RotateCw className="h-4 w-4" aria-hidden="true" />}
                  >
                    Повторить
                  </Button>
                }
              />
            )}

            {/* 3. Статей нет вообще — раздел только создан */}
            {status === 'ready' && articles?.length === 0 && (
              <EmptyState
                title="Статей пока нет"
                description="Этот раздел мы ещё не наполнили. Спросите на форуме — так мы поймём, с чего начать."
                action={
                  <LinkButton to="/forum/new" variant="forum">Задать вопрос</LinkButton>
                }
              />
            )}

            {/* 4. Статьи есть, но фильтры ничего не нашли */}
            {status === 'ready' && (articles?.length ?? 0) > 0 && filteredArticles.length === 0 && (
              <EmptyState
                variant="search"
                title="Под фильтры ничего не подошло"
                description="Попробуйте снять часть условий — например, оставить только тему, без ограничения по формату."
                action={
                  <Button variant="secondary" onClick={resetFilters}>
                    Сбросить фильтры
                  </Button>
                }
              />
            )}

            {/* 5. Нормальный результат */}
            {status === 'ready' && filteredArticles.length > 0 && (
              <>
                <p className="mb-4 text-caption text-muted-strong" aria-live="polite">
                  {filteredArticles.length}{' '}
                  {plural(filteredArticles.length, ['статья', 'статьи', 'статей'])}
                  {activeFilterCount > 0 && ` из ${articles?.length ?? 0}`}
                </p>
                <ul className="grid gap-5 sm:grid-cols-2">
                  {filteredArticles.map((article, index) => (
                    <li key={article.id} className="flex">
                      <ArticleCard article={article} index={index} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      ) : (
        <div
          id="panel-topics"
          role="tabpanel"
          aria-labelledby="tab-topics"
          tabIndex={0}
          className="mt-6"
        >
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-caption text-muted-strong">
              {topics.length} {plural(topics.length, ['обсуждение', 'обсуждения', 'обсуждений'])} по теме
              «{item.title}»
            </p>
            <LinkButton to="/forum/new" variant="forum" iconLeft={<Plus className="h-4 w-4" aria-hidden="true" />}>
                Создать тему
              </LinkButton>
          </div>

          {topics.length === 0 ? (
            <EmptyState
              title="Обсуждений пока нет"
              description="Будьте первым: опишите ситуацию своими словами — на такие вопросы обычно отвечают в тот же день."
              action={
                <LinkButton to="/forum/new" variant="forum">Задать вопрос</LinkButton>
              }
            />
          ) : (
            <ul className="flex flex-col gap-4">
              {topics.map((topic, index) => (
                <li key={topic.id}>
                  <TopicCard topic={topic} index={index} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="mt-12">
        <AskOnForum itemTitle={item.title} />
      </div>
    </div>
  );
}
