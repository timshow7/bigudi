import type { LucideIcon } from 'lucide-react';

/**
 * Цветовой акцент раздела. Не HEX, а роль — чтобы палитру можно было
 * поменять в одном месте (tailwind.config.js), не трогая данные.
 */
export type AccentKey = 'action' | 'forum' | 'med' | 'neutral';

/** Прямоугольник комнаты на плане квартиры, в координатах viewBox SVG */
export interface PlanRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Предмет в комнате = подкатегория (стиралка, холодильник, аптечка…) */
export interface RoomItem {
  id: string;
  roomId: string;
  title: string;
  /** Одна строка: что человек здесь найдёт */
  summary: string;
  icon: LucideIcon;
  /** Позиция на общем плане квартиры, в % от прямоугольника комнаты */
  planSpot: { x: number; y: number };
  /** Позиция на крупном плане комнаты, в % от блока-сцены */
  sceneSpot: { x: number; y: number };
  /** Темы внутри предмета — то, что заказчик называл «подкатегориями»
      (тёмные вещи / самоочистка / режимы стирки). Работают как фильтры. */
  topics: string[];
}

/** Комната = категория верхнего уровня */
export interface Room {
  id: string;
  title: string;
  /** Подпись-пояснение: какие темы внутри */
  tagline: string;
  accent: AccentKey;
  plan: PlanRect;
  items: RoomItem[];
}

export interface Article {
  id: string;
  itemId: string;
  title: string;
  excerpt: string;
  topics: string[];
  /** Время чтения в минутах */
  minutes: number;
  likes: number;
  views: number;
  /** Флаги для фильтров слева */
  forNovice: boolean;
  hasSteps: boolean;
  hasPhoto: boolean;
  author: string;
  /** ISO-дата, форматируется при выводе */
  date: string;
}

export interface ForumTopic {
  id: string;
  itemId: string;
  title: string;
  excerpt: string;
  author: string;
  answers: number;
  views: number;
  /** Человекочитаемая давность для показа: «2 часа назад» */
  lastActivity: string;
  /** Машинная дата последней активности — по ней сортируем ленту */
  lastActivityAt: string;
  /** Есть ли отмеченный автором решающий ответ */
  solved: boolean;
  tags: string[];
}

/* ────────────────────────────────────────────────────────────────────────────
   Экраны 4–6: тело статьи, пользователи форума, ответы в теме
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * Блок текста статьи. Статья хранится не строкой HTML, а массивом блоков:
 * так вёрстка остаётся в компонентах, а не в контенте, и редактор в будущем
 * сможет собирать статью из тех же кирпичиков.
 */
export type ArticleBlock =
  | { type: 'paragraph'; text: string }
  /** id нужен для якоря и оглавления */
  | { type: 'heading'; id: string; text: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'steps'; items: Array<{ title: string; text: string }> }
  | { type: 'callout'; tone: 'tip' | 'warning'; title: string; text: string };

/** Участник форума. Рейтинг — из системы рейтинга в ТЗ. */
export interface ForumUser {
  nickname: string;
  /** Очки репутации за полезные ответы */
  rating: number;
  /** Подпись уровня: «новичок», «знаток» и т.д. */
  level: string;
  /** Отмечен редакцией как проверенный автор */
  verified?: boolean;
}

export interface Reply {
  id: string;
  topicId: string;
  author: string;
  text: string;
  /** Голоса других участников */
  votes: number;
  createdAt: string;
  /** Ответ, который автор вопроса отметил решением */
  accepted?: boolean;
}
