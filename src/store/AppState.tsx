import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { ForumTopic, Reply } from '../types';

/**
 * ОБЩЕЕ СОСТОЯНИЕ ПРИЛОЖЕНИЯ
 *
 * Появилось, когда экраны начали делиться данными: статью сохраняют на одной
 * странице, а показывают в «Избранном» на другой; тему создают в форме,
 * а открывают в ленте. Держать это в useState каждой страницы уже нельзя.
 *
 * Redux здесь не нужен: данных мало, обновления редкие, вложенность небольшая.
 * Контекста и useState достаточно, а когда появится backend, этот файл
 * превратится в тонкую обёртку над запросами — страницы не изменятся.
 *
 * Состояние сохраняется в localStorage, чтобы созданная тема и сохранённые
 * статьи переживали перезагрузку страницы: без этого прототип невозможно
 * нормально показывать.
 */

export interface ProfileData {
  name: string;
  bio: string;
  telegramNotifications: boolean;
  telegramLinked: boolean;
  /** id комнат, помеченных как любимые */
  favoriteRooms: string[];
  /** id ограничений по здоровью из списка healthLimitOptions */
  healthLimits: string[];
}

/** Ограничения по здоровью из ТЗ. Влияют на подбор: пока только на профиль. */
export const healthLimitOptions = [
  { id: 'allergies', label: 'Аллергия (пыль, шерсть, бытовая химия)' },
  { id: 'no-stairs', label: 'Нужны места без ступенек' },
  { id: 'diet', label: 'Диетические ограничения' },
  { id: 'smells', label: 'Плохо переношу резкие запахи' },
] as const;

const defaultProfile: ProfileData = {
  name: 'Саша',
  bio: 'Первый год живу отдельно. Учусь, готовлю на двоих и разбираюсь со счётчиками.',
  telegramNotifications: true,
  telegramLinked: false,
  favoriteRooms: ['kitchen', 'bathroom'],
  healthLimits: [],
};

interface AppStateValue {
  profile: ProfileData;
  updateProfile: (patch: Partial<ProfileData>) => void;

  /** Статьи, отложенные кнопкой «Сохранить» — они же вкладка «Избранное» */
  savedArticleIds: string[];
  toggleSavedArticle: (articleId: string) => void;
  isArticleSaved: (articleId: string) => boolean;

  /** Отдельно от избранного: «статья помогла». Влияет на счётчик под статьёй */
  likedArticleIds: string[];
  toggleLikedArticle: (articleId: string) => void;

  ownTopics: ForumTopic[];
  addTopic: (topic: ForumTopic) => void;

  ownReplies: Reply[];
  addReply: (reply: Reply) => void;
}

interface StoredState {
  profile: ProfileData;
  savedArticleIds: string[];
  likedArticleIds: string[];
  ownTopics: ForumTopic[];
  ownReplies: Reply[];
}

const STORAGE_KEY = 'bigudi:state:v1';

const emptyState: StoredState = {
  profile: defaultProfile,
  savedArticleIds: [],
  likedArticleIds: [],
  ownTopics: [],
  ownReplies: [],
};

/**
 * Чтение из localStorage защищено со всех сторон: хранилище может быть
 * недоступно (приватный режим), а лежать там может что угодно — например,
 * состояние от прошлой версии приложения.
 */
function readStoredState(): StoredState {
  if (typeof window === 'undefined') return emptyState;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState;

    const parsed = JSON.parse(raw) as Partial<StoredState>;
    return {
      profile: { ...defaultProfile, ...parsed.profile },
      savedArticleIds: parsed.savedArticleIds ?? [],
      likedArticleIds: parsed.likedArticleIds ?? [],
      ownTopics: parsed.ownTopics ?? [],
      ownReplies: parsed.ownReplies ?? [],
    };
  } catch {
    return emptyState;
  }
}

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredState>(readStoredState);

  // Пишем всё состояние одной записью: оно маленькое, а отдельные ключи
  // пришлось бы синхронизировать между собой
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Хранилище недоступно — прототип продолжает работать без сохранения
    }
  }, [state]);

  const toggleInList = useCallback((key: 'savedArticleIds' | 'likedArticleIds', id: string) => {
    setState((current) => {
      const list = current[key];
      return {
        ...current,
        [key]: list.includes(id) ? list.filter((value) => value !== id) : [...list, id],
      };
    });
  }, []);

  const value = useMemo<AppStateValue>(
    () => ({
      profile: state.profile,
      updateProfile: (patch) =>
        setState((current) => ({ ...current, profile: { ...current.profile, ...patch } })),

      savedArticleIds: state.savedArticleIds,
      toggleSavedArticle: (articleId) => toggleInList('savedArticleIds', articleId),
      isArticleSaved: (articleId) => state.savedArticleIds.includes(articleId),

      likedArticleIds: state.likedArticleIds,
      toggleLikedArticle: (articleId) => toggleInList('likedArticleIds', articleId),

      ownTopics: state.ownTopics,
      addTopic: (topic) => setState((current) => ({ ...current, ownTopics: [topic, ...current.ownTopics] })),

      ownReplies: state.ownReplies,
      addReply: (reply) => setState((current) => ({ ...current, ownReplies: [...current.ownReplies, reply] })),
    }),
    [state, toggleInList],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const value = useContext(AppStateContext);
  if (!value) throw new Error('useAppState вызван вне <AppStateProvider>');
  return value;
}
