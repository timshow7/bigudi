import {
  BedDouble,
  CookingPot,
  FileText,
  Key,
  Microwave,
  Pill,
  Plug,
  Refrigerator,
  Shirt,
  ShowerHead,
  Sofa,
  SprayCan,
  Trash2,
  Tv,
  Utensils,
  Wallet,
  WashingMachine,
} from 'lucide-react';
import type { Room, RoomItem } from '../types';

/**
 * КАРТА КВАРТИРЫ
 *
 * Координаты `plan` заданы в системе viewBox SVG «0 0 900 560».
 * Вся геометрия живёт здесь, а не в компоненте: чтобы передвинуть комнату
 * или добавить шестую, достаточно поправить числа в этом файле.
 *
 * Раскладка (условная однушка с коридором посередине):
 *
 *   ┌──────────────┬─────────────────────┐
 *   │    Кухня     │      Гостиная       │
 *   ├──────────────┴─────────────────────┤
 *   │             Коридор                │
 *   ├──────────────┬─────────────────────┤
 *   │    Ванная    │      Спальня        │
 *   └──────────────┴─────────────────────┘
 *
 * Цвет комнаты (`accent`) сознательно ограничен тремя ролями:
 * терракота / синий / нейтральный. Зелёный в проекте значит «форум»,
 * поэтому комнатам он не достаётся — иначе пользователь перестанет
 * считывать зелёный как «обсуждения».
 */

const kitchenItems: RoomItem[] = [
  {
    id: 'stove',
    roomId: 'kitchen',
    title: 'Плита',
    summary: 'Что приготовить за 20 минут и как не спалить кастрюлю',
    icon: CookingPot,
    planSpot: { x: 22, y: 30 },
    sceneSpot: { x: 24, y: 58 },
    topics: ['Быстрые ужины', 'Крупы и макароны', 'Первый раз готовлю'],
  },
  {
    id: 'fridge',
    roomId: 'kitchen',
    title: 'Холодильник',
    summary: 'Сроки хранения, заморозка и что делать с остатками',
    icon: Refrigerator,
    planSpot: { x: 55, y: 28 },
    sceneSpot: { x: 52, y: 46 },
    topics: ['Сроки хранения', 'Заморозка', 'Закупка на неделю'],
  },
  {
    id: 'microwave',
    roomId: 'kitchen',
    title: 'Микроволновка',
    summary: 'Разогрев без резиновой курицы и что туда нельзя ставить',
    icon: Microwave,
    planSpot: { x: 80, y: 30 },
    sceneSpot: { x: 73, y: 40 },
    topics: ['Разогрев', 'Безопасность'],
  },
  {
    id: 'sink',
    roomId: 'kitchen',
    title: 'Раковина и посуда',
    summary: 'Засор, жир и как мыть посуду быстрее',
    icon: Utensils,
    planSpot: { x: 40, y: 70 },
    sceneSpot: { x: 38, y: 72 },
    topics: ['Засор', 'Мытьё посуды'],
  },
];

const livingItems: RoomItem[] = [
  {
    id: 'sofa',
    roomId: 'living',
    title: 'Диван и текстиль',
    summary: 'Пятна на обивке, пылесос и уборка за 15 минут',
    icon: Sofa,
    planSpot: { x: 24, y: 60 },
    sceneSpot: { x: 28, y: 62 },
    topics: ['Пятна', 'Быстрая уборка'],
  },
  {
    id: 'tv',
    roomId: 'living',
    title: 'Техника',
    summary: 'Подключение, интернет и что делать, когда ничего не работает',
    icon: Tv,
    planSpot: { x: 60, y: 28 },
    sceneSpot: { x: 58, y: 36 },
    topics: ['Интернет', 'Подключение'],
  },
  {
    id: 'sockets',
    roomId: 'living',
    title: 'Розетки и электрика',
    summary: 'Пробки, удлинители и признаки того, что пора звать электрика',
    icon: Plug,
    planSpot: { x: 84, y: 62 },
    sceneSpot: { x: 78, y: 66 },
    topics: ['Пробки', 'Удлинители'],
  },
];

const bathroomItems: RoomItem[] = [
  {
    id: 'washing-machine',
    roomId: 'bathroom',
    title: 'Стиральная машина',
    summary: 'Режимы, уход и типичные ошибки первой стирки',
    icon: WashingMachine,
    planSpot: { x: 26, y: 62 },
    sceneSpot: { x: 26, y: 60 },
    topics: ['Тёмные и светлые вещи', 'Самоочистка и уход', 'Режимы стирки', 'Средства для стирки'],
  },
  {
    id: 'shower',
    roomId: 'bathroom',
    title: 'Душ и сантехника',
    summary: 'Напор, налёт, плесень в углах и течь под раковиной',
    icon: ShowerHead,
    planSpot: { x: 70, y: 30 },
    sceneSpot: { x: 66, y: 34 },
    topics: ['Плесень и налёт', 'Течь'],
  },
  {
    id: 'chemicals',
    roomId: 'bathroom',
    title: 'Бытовая химия',
    summary: 'Что с чем нельзя смешивать и чем реально мыть',
    icon: SprayCan,
    planSpot: { x: 52, y: 72 },
    sceneSpot: { x: 48, y: 74 },
    topics: ['Безопасность', 'Минимальный набор'],
  },
];

const bedroomItems: RoomItem[] = [
  {
    id: 'bed',
    roomId: 'bedroom',
    title: 'Кровать и сон',
    summary: 'Режим сна в сессию, бельё и как высыпаться в общаге',
    icon: BedDouble,
    planSpot: { x: 28, y: 40 },
    sceneSpot: { x: 30, y: 54 },
    topics: ['Режим сна', 'Постельное бельё'],
  },
  {
    id: 'wardrobe',
    roomId: 'bedroom',
    title: 'Шкаф и одежда',
    summary: 'Глажка, хранение и что делать с вещами не по сезону',
    icon: Shirt,
    planSpot: { x: 62, y: 28 },
    sceneSpot: { x: 58, y: 40 },
    topics: ['Глажка', 'Хранение'],
  },
  {
    id: 'first-aid',
    roomId: 'bedroom',
    title: 'Аптечка',
    summary: 'Базовый набор, температура и когда идти к врачу',
    icon: Pill,
    planSpot: { x: 84, y: 62 },
    sceneSpot: { x: 78, y: 62 },
    topics: ['Простуда', 'Базовая аптечка', 'Когда к врачу'],
  },
];

const hallItems: RoomItem[] = [
  {
    id: 'documents',
    roomId: 'hall',
    title: 'Документы',
    summary: 'Полис, прописка, справки и госуслуги без очередей',
    icon: FileText,
    planSpot: { x: 20, y: 45 },
    sceneSpot: { x: 24, y: 50 },
    topics: ['Госуслуги', 'Полис и медкарта'],
  },
  {
    id: 'budget',
    roomId: 'hall',
    title: 'Деньги и счета',
    summary: 'Квартплата, счётчики и бюджет на месяц',
    icon: Wallet,
    planSpot: { x: 48, y: 45 },
    sceneSpot: { x: 48, y: 52 },
    topics: ['Счётчики', 'Бюджет', 'Квартплата'],
  },
  {
    id: 'door',
    roomId: 'hall',
    title: 'Дверь и ключи',
    summary: 'Захлопнул дверь, потерял ключ, шумные соседи',
    icon: Key,
    planSpot: { x: 70, y: 45 },
    sceneSpot: { x: 68, y: 50 },
    topics: ['Соседи', 'Замок и ключи'],
  },
  {
    id: 'trash',
    roomId: 'hall',
    title: 'Мусор',
    summary: 'Раздельный сбор, крупногабарит и запах в ведре',
    icon: Trash2,
    planSpot: { x: 88, y: 45 },
    sceneSpot: { x: 84, y: 60 },
    topics: ['Раздельный сбор'],
  },
];

export const rooms: Room[] = [
  {
    id: 'kitchen',
    title: 'Кухня',
    tagline: 'Готовка, продукты и посуда',
    accent: 'action',
    plan: { x: 20, y: 20, w: 320, h: 210 },
    items: kitchenItems,
  },
  {
    id: 'living',
    title: 'Гостиная',
    tagline: 'Техника, уборка и электрика',
    accent: 'neutral',
    plan: { x: 360, y: 20, w: 520, h: 210 },
    items: livingItems,
  },
  {
    id: 'hall',
    title: 'Коридор',
    tagline: 'Документы, деньги и соседи',
    accent: 'neutral',
    plan: { x: 20, y: 250, w: 860, h: 80 },
    items: hallItems,
  },
  {
    id: 'bathroom',
    title: 'Ванная',
    tagline: 'Стирка, уборка и сантехника',
    accent: 'med',
    plan: { x: 20, y: 350, w: 320, h: 190 },
    items: bathroomItems,
  },
  {
    id: 'bedroom',
    title: 'Спальня',
    tagline: 'Сон, одежда и здоровье',
    accent: 'med',
    plan: { x: 360, y: 350, w: 520, h: 190 },
    items: bedroomItems,
  },
];

/** Плоский список всех предметов — удобно для поиска и хлебных крошек */
export const allItems: RoomItem[] = rooms.flatMap((room) => room.items);

export function getRoom(roomId: string | undefined): Room | undefined {
  return rooms.find((room) => room.id === roomId);
}

export function getItem(itemId: string | undefined): RoomItem | undefined {
  return allItems.find((item) => item.id === itemId);
}
