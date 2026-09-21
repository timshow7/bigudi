import { articles } from '../data/articles';
import { forumTopics } from '../data/forum';
import { getItem, getRoom } from '../data/rooms';
import type { ForumTopic } from '../types';

export type ResultKind = 'article' | 'topic';

export interface SearchResult {
  kind: ResultKind;
  id: string;
  href: string;
  title: string;
  excerpt: string;
  tags: string[];
  roomId: string;
  roomTitle: string;
  itemTitle: string;
  /** Короткая подпись справа: «5 мин чтения» или «14 ответов» */
  meta: string;
  /** Совпадение с запросом — для сортировки «Сначала подходящие» */
  score: number;
  /** Дата в миллисекундах — для сортировки «Сначала свежие» */
  freshness: number;
  /** Лайки у статьи, ответы у темы — для сортировки «Сначала популярные» */
  popularity: number;
}

export interface SearchFilters {
  kinds: ResultKind[];
  rooms: string[];
  tags: string[];
}

export type SearchSort = 'relevant' | 'fresh' | 'popular';

/**
 * Ранжирование намеренно простое: считаем, сколько слов запроса встретилось
 * и насколько «важное» место совпало. Совпадение в заголовке весит больше,
 * чем в тексте, — так работает почти любой поиск, и этого достаточно,
 * пока данные лежат в файлах.
 *
 * Когда появится backend, эта функция заменится запросом к БД,
 * а SearchResult останется тем же — страница поиска не изменится.
 */
const WEIGHT = { title: 5, tag: 3, item: 2, excerpt: 2 };

function tokenize(query: string): string[] {
  return query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 1);
}

function scoreFields(tokens: string[], fields: { title: string; excerpt: string; tags: string[]; item: string }) {
  let score = 0;

  for (const token of tokens) {
    if (fields.title.toLowerCase().includes(token)) score += WEIGHT.title;
    if (fields.tags.some((tag) => tag.toLowerCase().includes(token))) score += WEIGHT.tag;
    if (fields.item.toLowerCase().includes(token)) score += WEIGHT.item;
    if (fields.excerpt.toLowerCase().includes(token)) score += WEIGHT.excerpt;
  }

  return score;
}

function topicToResult(topic: ForumTopic, tokens: string[]): SearchResult | null {
  const item = getItem(topic.itemId);
  const room = item ? getRoom(item.roomId) : undefined;

  const fields = {
    title: topic.title,
    excerpt: topic.excerpt,
    tags: topic.tags,
    item: item?.title ?? '',
  };
  const score = tokens.length === 0 ? 1 : scoreFields(tokens, fields);
  if (score === 0) return null;

  return {
    kind: 'topic',
    id: topic.id,
    href: `/forum/${topic.id}`,
    title: topic.title,
    excerpt: topic.excerpt,
    tags: topic.tags,
    roomId: room?.id ?? '',
    roomTitle: room?.title ?? '',
    itemTitle: item?.title ?? '',
    meta: `${topic.answers} ${topic.answers === 1 ? 'ответ' : 'ответов'}`,
    score,
    freshness: new Date(topic.lastActivityAt).getTime(),
    popularity: topic.answers * 10 + topic.views / 100,
  };
}

/**
 * Ищем и по статьям, и по темам. Свои темы (созданные через форму)
 * передаются отдельным аргументом: они живут в состоянии, а не в файлах.
 */
export function searchEverything(query: string, ownTopics: ForumTopic[] = []): SearchResult[] {
  const tokens = tokenize(query);

  const articleResults = articles
    .map<SearchResult | null>((article) => {
      const item = getItem(article.itemId);
      const room = item ? getRoom(item.roomId) : undefined;

      const fields = {
        title: article.title,
        excerpt: article.excerpt,
        tags: article.topics,
        item: item?.title ?? '',
      };
      const score = tokens.length === 0 ? 1 : scoreFields(tokens, fields);
      if (score === 0) return null;

      return {
        kind: 'article',
        id: article.id,
        href: `/article/${article.id}`,
        title: article.title,
        excerpt: article.excerpt,
        tags: article.topics,
        roomId: room?.id ?? '',
        roomTitle: room?.title ?? '',
        itemTitle: item?.title ?? '',
        meta: `${article.minutes} мин чтения`,
        score,
        freshness: new Date(article.date).getTime(),
        popularity: article.likes,
      };
    })
    .filter((result): result is SearchResult => result !== null);

  const topicResults = [...ownTopics, ...forumTopics]
    .map((topic) => topicToResult(topic, tokens))
    .filter((result): result is SearchResult => result !== null);

  return [...articleResults, ...topicResults];
}

export function applyFilters(results: SearchResult[], filters: SearchFilters): SearchResult[] {
  return results.filter((result) => {
    if (filters.kinds.length > 0 && !filters.kinds.includes(result.kind)) return false;
    if (filters.rooms.length > 0 && !filters.rooms.includes(result.roomId)) return false;
    if (filters.tags.length > 0 && !result.tags.some((tag) => filters.tags.includes(tag))) return false;
    return true;
  });
}

export function sortResults(results: SearchResult[], sort: SearchSort): SearchResult[] {
  // Сортируем копию: исходный массив может быть переиспользован
  return [...results].sort((a, b) => {
    if (sort === 'fresh') return b.freshness - a.freshness;
    if (sort === 'popular') return b.popularity - a.popularity;
    // При равной релевантности свежее идёт выше — иначе порядок выглядит случайным
    return b.score - a.score || b.freshness - a.freshness;
  });
}

/** Все теги проекта: форумные плюс темы статей. Для фильтров и автодополнения. */
export function collectTags(ownTopics: ForumTopic[] = []): string[] {
  const fromTopics = [...ownTopics, ...forumTopics].flatMap((topic) => topic.tags);
  const fromArticles = articles.flatMap((article) => article.topics.map((topic) => topic.toLowerCase()));
  return Array.from(new Set([...fromTopics, ...fromArticles])).sort((a, b) => a.localeCompare(b, 'ru'));
}

/**
 * Частые запросы для пустого состояния поиска. Пока список ручной:
 * настоящая статистика появится вместе с аналитикой.
 */
export const popularQueries = [
  'как отстирать',
  'ужин за 20 минут',
  'температура 38',
  'счётчики',
  'плесень в ванной',
  'первая аптечка',
  'шумные соседи',
  'погладить рубашку',
];
