import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Clock, Flame, Search, Sparkles, X } from 'lucide-react';
import { Button, LinkButton } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { Chip } from '../components/ui/Chip';
import { EmptyState } from '../components/ui/EmptyState';
import { FiltersSheet } from '../components/ui/FiltersSheet';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { TopicCardSkeleton } from '../components/ui/Skeleton';
import { SearchResultCard } from '../components/cards/SearchResultCard';
import { rooms } from '../data/rooms';
import {
  applyFilters,
  collectTags,
  popularQueries,
  searchEverything,
  sortResults,
  type ResultKind,
  type SearchSort,
} from '../lib/search';
import { useAppState } from '../store/AppState';
import { plural } from '../lib/format';

/**
 * Поиск.
 *
 * Запрос живёт в адресе (/search?q=стирка), а не только в состоянии:
 * так результат можно переслать ссылкой, вернуть кнопкой «назад»
 * и открыть заново. Поле ввода синхронизируется с адресом с задержкой,
 * чтобы каждая буква не создавала новую запись в истории браузера.
 */
export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { ownTopics } = useAppState();

  const queryFromUrl = searchParams.get('q') ?? '';
  const shouldFail = searchParams.get('fail') === '1';

  const [inputValue, setInputValue] = useState(queryFromUrl);
  const [debouncedQuery, setDebouncedQuery] = useState(queryFromUrl);
  const [isSearching, setSearching] = useState(false);

  const [kinds, setKinds] = useState<ResultKind[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sort, setSort] = useState<SearchSort>('relevant');
  const [isSheetOpen, setSheetOpen] = useState(false);

  const allTags = useMemo(() => collectTags(ownTopics), [ownTopics]);

  // Пользователь печатает → ждём 350 мс → обновляем адрес и показываем
  // скелетоны. Задержка заодно даёт увидеть состояние загрузки
  useEffect(() => {
    if (inputValue === debouncedQuery) return;

    setSearching(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue);
      setSearchParams(inputValue ? { q: inputValue } : {}, { replace: true });
      setSearching(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [inputValue, debouncedQuery, setSearchParams]);

  // Адрес изменился снаружи (переход по ссылке, кнопка «назад») — подхватываем
  useEffect(() => {
    setInputValue(queryFromUrl);
    setDebouncedQuery(queryFromUrl);
  }, [queryFromUrl]);

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const found = searchEverything(debouncedQuery, ownTopics);
    return sortResults(applyFilters(found, { kinds, rooms: selectedRooms, tags: selectedTags }), sort);
  }, [debouncedQuery, ownTopics, kinds, selectedRooms, selectedTags, sort]);

  const activeFilterCount = kinds.length + selectedRooms.length + selectedTags.length;

  function resetFilters() {
    setKinds([]);
    setSelectedRooms([]);
    setSelectedTags([]);
  }

  function toggle<T>(list: T[], value: T, setter: (next: T[]) => void) {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  }

  const hasQuery = debouncedQuery.trim().length > 0;

  return (
    <div className="container-page pb-4 pt-8">
      <h1 className="text-h1 text-ink md:text-h1-lg">Поиск</h1>

      {/* Крупная строка поиска */}
      <form
        role="search"
        onSubmit={(event) => event.preventDefault()}
        className="relative mt-5 flex items-center"
      >
        <Search className="pointer-events-none absolute left-5 h-5 w-5 text-muted" aria-hidden="true" />
        <input
          type="search"
          value={inputValue}
          autoFocus
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Что случилось? Например: не сливает воду"
          aria-label="Поиск по статьям и обсуждениям"
          className="h-14 w-full rounded-card border border-line bg-surface pl-14 pr-14 text-body text-ink placeholder:text-muted transition-colors hover:border-[#DCD3C6] focus:border-accent focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
        />
        {inputValue && (
          <button
            type="button"
            onClick={() => setInputValue('')}
            aria-label="Очистить запрос"
            className="absolute right-2 flex h-11 w-11 items-center justify-center rounded-ctl text-muted transition-colors hover:text-ink"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </form>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside>
          <FiltersSheet
            isOpen={isSheetOpen}
            onOpen={() => setSheetOpen(true)}
            onClose={() => setSheetOpen(false)}
            activeCount={activeFilterCount}
            onReset={resetFilters}
          >
            <fieldset className="border-0 p-0">
              <legend className="mb-1 font-display text-caption font-semibold text-muted-strong">
                Что искать
              </legend>
              <Checkbox
                label="Статьи"
                checked={kinds.includes('article')}
                onChange={() => toggle(kinds, 'article', setKinds)}
              />
              <Checkbox
                label="Обсуждения"
                checked={kinds.includes('topic')}
                onChange={() => toggle(kinds, 'topic', setKinds)}
              />
            </fieldset>

            <fieldset className="mt-5 border-0 p-0">
              <legend className="mb-1 font-display text-caption font-semibold text-muted-strong">
                Комната
              </legend>
              {rooms.map((room) => (
                <Checkbox
                  key={room.id}
                  label={room.title}
                  checked={selectedRooms.includes(room.id)}
                  onChange={() => toggle(selectedRooms, room.id, setSelectedRooms)}
                />
              ))}
            </fieldset>

            <fieldset className="mt-5 border-0 p-0">
              <legend className="mb-2 font-display text-caption font-semibold text-muted-strong">
                Теги
              </legend>
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 14).map((tag) => (
                  <Chip
                    key={tag}
                    selected={selectedTags.includes(tag)}
                    onToggle={() => toggle(selectedTags, tag, setSelectedTags)}
                  >
                    {tag}
                  </Chip>
                ))}
              </div>
            </fieldset>
          </FiltersSheet>
        </aside>

        <div>
          {/* Счётчик и сортировка появляются только когда есть что сортировать */}
          {hasQuery && !isSearching && results.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-caption text-muted-strong" aria-live="polite">
                {results.length} {plural(results.length, ['результат', 'результата', 'результатов'])} по
                запросу «{debouncedQuery}»
              </p>
              <SegmentedControl<SearchSort>
                ariaLabel="Порядок результатов"
                value={sort}
                onChange={setSort}
                options={[
                  { value: 'relevant', label: 'Подходящие', icon: Sparkles },
                  { value: 'fresh', label: 'Свежие', icon: Clock },
                  { value: 'popular', label: 'Популярные', icon: Flame },
                ]}
              />
            </div>
          )}

          {/* 1. Ошибка */}
          {shouldFail && hasQuery && (
            <EmptyState
              variant="error"
              title="Что-то пошло не так"
              description="Поиск не ответил. Это бывает при плохой связи — попробуйте ещё раз, запрос сохранится."
              action={
                <Button onClick={() => setSearchParams({ q: debouncedQuery }, { replace: true })}>
                  Повторить
                </Button>
              }
            />
          )}

          {/* 2. До ввода запроса */}
          {!hasQuery && !isSearching && (
            <section className="rounded-card border border-dashed border-line bg-surface/60 p-6 sm:p-8">
              <h2 className="text-h3 text-ink">Введите запрос, чтобы найти советы, рецепты или обсуждения</h2>
              <p className="mt-2 max-w-[58ch] text-caption text-muted-strong">
                Ищем и по статьям, и по вопросам на форуме. Можно писать как в жизни: «пахнет из
                стиралки», «что приготовить из пачки гречки».
              </p>

              <h3 className="mt-6 font-display text-caption font-semibold text-muted-strong">
                Ищут чаще всего
              </h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {popularQueries.map((query) => (
                  <li key={query}>
                    <Chip onToggle={() => setInputValue(query)}>{query}</Chip>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 3. Загрузка */}
          {isSearching && hasQuery && (
            <div className="flex flex-col gap-4" aria-busy="true" aria-live="polite">
              <span className="sr-only">Ищем</span>
              {[0, 1, 2].map((index) => (
                <TopicCardSkeleton key={index} />
              ))}
            </div>
          )}

          {/* 4. Ничего не нашлось */}
          {hasQuery && !isSearching && !shouldFail && results.length === 0 && (
            <EmptyState
              variant="search"
              title={`По запросу «${debouncedQuery}» ничего не нашлось`}
              description="Попробуйте изменить формулировку или снять фильтры. Можно спросить на форуме — так в базе появится ещё один ответ."
              action={
                <div className="flex flex-wrap justify-center gap-2">
                  {activeFilterCount > 0 && (
                    <Button variant="secondary" onClick={resetFilters}>
                      Сбросить фильтры
                    </Button>
                  )}
                  <LinkButton to="/forum/new" variant="forum">
                    Задать вопрос
                  </LinkButton>
                </div>
              }
            />
          )}

          {/* 5. Результаты */}
          {hasQuery && !isSearching && !shouldFail && results.length > 0 && (
            <ul className="flex flex-col gap-4">
              {results.map((result, index) => (
                <li key={`${result.kind}-${result.id}`}>
                  <SearchResultCard result={result} query={debouncedQuery} index={index} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
