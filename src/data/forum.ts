import type { ForumTopic } from '../types';

/**
 * Темы форума. Привязаны к тем же предметам (itemId), что и статьи, —
 * поэтому на странице подкатегории вкладки «Статьи» и «Обсуждения»
 * показывают контент про одно и то же, просто из разных источников.
 */
export const forumTopics: ForumTopic[] = [
  {
    id: 'wm-no-drain',
    itemId: 'washing-machine',
    title: 'Стиралка не сливает воду — что делать?',
    excerpt:
      'Постирал, машинка встала на отжиме, внутри полный барабан воды. Фильтр не трогал ни разу за год. Как слить и куда смотреть?',
    author: 'kirill_2005',
    answers: 14,
    views: 892,
    lastActivity: '2 часа назад',
    lastActivityAt: '2026-09-19T18:00:00',
    solved: true,
    tags: ['поломка', 'слив'],
  },
  {
    id: 'wm-bedding-temp',
    itemId: 'washing-machine',
    title: 'Какую температуру выбрать для постельного белья?',
    excerpt:
      'Мама говорит 90, на бирке написано 40. Кому верить? Бельё обычное хлопковое, стираю раз в две недели.',
    author: 'ne_mamkay',
    answers: 23,
    views: 1340,
    lastActivity: '5 часов назад',
    lastActivityAt: '2026-09-19T15:00:00',
    solved: false,
    tags: ['режимы', 'бельё'],
  },
  {
    id: 'wm-sneakers',
    itemId: 'washing-machine',
    title: 'Можно ли стирать кроссовки в машинке?',
    excerpt:
      'Белые кожаные, после дождя выглядят грустно. Страшно, что развалятся или разобьют барабан. Кто-нибудь пробовал?',
    author: 'anna.k',
    answers: 31,
    views: 2105,
    lastActivity: 'вчера',
    lastActivityAt: '2026-09-18T20:00:00',
    solved: true,
    tags: ['обувь', 'режимы'],
  },
  {
    id: 'wm-spin',
    itemId: 'washing-machine',
    title: 'Отжим 1000 или 1400 — есть разница для вещей?',
    excerpt: 'Ставлю всегда максимум, чтобы быстрее сохло. Сосед сказал, что так вещи убиваются. Это правда?',
    author: 'stud_life',
    answers: 8,
    views: 470,
    lastActivity: '2 дня назад',
    lastActivityAt: '2026-09-17T12:00:00',
    solved: false,
    tags: ['режимы'],
  },
  {
    id: 'wm-ketchup',
    itemId: 'washing-machine',
    title: 'Чем отстирать кетчуп с белой футболки?',
    excerpt: 'Пятно уже засохло, прошло два дня. Обычный порошок не взял, пятновыводителя под рукой нет.',
    author: 'max_b',
    answers: 19,
    views: 1620,
    lastActivity: '3 дня назад',
    lastActivityAt: '2026-09-16T09:00:00',
    solved: true,
    tags: ['пятна', 'светлые вещи'],
  },
  {
    id: 'stove-burnt-pan',
    itemId: 'stove',
    title: 'Пригорела кастрюля — как отмыть, не убив покрытие?',
    excerpt: 'Забыл про гречку, теперь на дне чёрная корка. Металлической губкой боюсь, кастрюля с антипригарным дном.',
    author: 'dima_o',
    answers: 11,
    views: 780,
    lastActivity: 'вчера',
    lastActivityAt: '2026-09-18T11:00:00',
    solved: false,
    tags: ['посуда', 'уборка'],
  },
  {
    id: 'aid-fever',
    itemId: 'first-aid',
    title: 'Температура 38 третий день — идти в поликлинику или ждать?',
    excerpt: 'Горло не болит, кашля нет, просто слабость. Живу один, в поликлинику идти далеко. Что считается «пора к врачу»?',
    author: 'sasha_v',
    answers: 27,
    views: 1980,
    lastActivity: '6 часов назад',
    lastActivityAt: '2026-09-19T14:00:00',
    solved: false,
    tags: ['здоровье', 'когда к врачу'],
  },
  {
    id: 'budget-first-bill',
    itemId: 'budget',
    title: 'Пришла квитанция на 6 тысяч — это нормально?',
    excerpt: 'Первый месяц живу отдельно, однушка, отопление уже включили. Не понимаю, за что половина строк в квитанции.',
    author: 'lena_first',
    answers: 16,
    views: 1120,
    lastActivity: '4 дня назад',
    lastActivityAt: '2026-09-15T16:00:00',
    solved: true,
    tags: ['квартплата', 'счётчики'],
  },
];

export function getTopicsByItem(itemId: string): ForumTopic[] {
  return forumTopics.filter((topic) => topic.itemId === itemId);
}

export function getTopic(topicId: string | undefined): ForumTopic | undefined {
  return forumTopics.find((topic) => topic.id === topicId);
}

/** «Совет дня» на главной. Строка одна, но лежит рядом с контентом, а не в вёрстке. */
export const tipOfTheDay = {
  title: 'Совет дня',
  text: 'Резинку люка стиральной машины после стирки протирают насухо и оставляют дверцу приоткрытой — это дешевле любого средства от запаха.',
  itemId: 'washing-machine',
  articleId: 'wm-smell',
};
