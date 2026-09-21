import type { ForumUser } from '../types';

/**
 * Участники форума. Рейтинг — та самая система из ТЗ: очки начисляются
 * за полезные ответы, уровень считается от очков.
 *
 * Пока это справочник в файле; когда появится бэкенд, поменяется только
 * функция getUser — компоненты её вызывают и ничего не знают про источник.
 */
const users: ForumUser[] = [
  { nickname: 'kirill_2005', rating: 34, level: 'новичок' },
  { nickname: 'ne_mamkay', rating: 612, level: 'знаток', verified: true },
  { nickname: 'anna.k', rating: 287, level: 'опытный' },
  { nickname: 'stud_life', rating: 96, level: 'новичок' },
  { nickname: 'max_b', rating: 158, level: 'опытный' },
  { nickname: 'dima_o', rating: 71, level: 'новичок' },
  { nickname: 'sasha_v', rating: 42, level: 'новичок' },
  { nickname: 'lena_first', rating: 203, level: 'опытный' },
  { nickname: 'master_byta', rating: 1480, level: 'мастер быта', verified: true },
  { nickname: 'olya_remont', rating: 524, level: 'знаток' },
  { nickname: 'pavel.t', rating: 119, level: 'новичок' },
];

/**
 * Если автора нет в справочнике, возвращаем «нулевого» пользователя,
 * а не undefined: карточке ответа всё равно нужно что-то показать,
 * и одна проверка здесь лучше десяти проверок в компонентах.
 */
export function getUser(nickname: string): ForumUser {
  return users.find((user) => user.nickname === nickname) ?? { nickname, rating: 0, level: 'новичок' };
}

/** Топ участников для боковой панели форума */
export const topUsers: ForumUser[] = [...users].sort((a, b) => b.rating - a.rating).slice(0, 5);
