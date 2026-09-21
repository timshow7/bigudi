import { useState } from 'react';
import { LayoutGrid, Map } from 'lucide-react';
import { ApartmentPlan } from '../components/apartment/ApartmentPlan';
import { RoomCard } from '../components/cards/RoomCard';
import { ItemCard } from '../components/cards/ItemCard';
import { TipOfTheDay } from '../components/blocks/TipOfTheDay';
import { TelegramBanner } from '../components/blocks/TelegramBanner';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { rooms, getItem } from '../data/rooms';
import { useMediaQuery } from '../hooks/useMediaQuery';
import type { RoomItem } from '../types';

type HomeView = 'plan' | 'list';

/** Предметы, с которыми чаще всего приходят. Пока — ручной список редакции. */
const popularItemIds = ['washing-machine', 'first-aid', 'budget', 'stove'];

export function HomePage() {
  const isMobile = useMediaQuery('(max-width: 767px)');

  // null = пользователь ещё не выбирал вид. Тогда решаем за него по ширине
  // экрана: на телефоне схема мелкая, список удобнее. Как только выбор сделан,
  // он уважается на любом экране.
  const [chosenView, setChosenView] = useState<HomeView | null>(null);
  const view: HomeView = chosenView ?? (isMobile ? 'list' : 'plan');

  // Явный type guard: без него TypeScript оставляет в типе undefined
  const popularItems = popularItemIds
    .map((id) => getItem(id))
    .filter((item): item is RoomItem => Boolean(item));

  return (
    <div className="container-page pb-4 pt-8 sm:pt-12">
      {/* ── Герой ────────────────────────────────────────────────────────── */}
      <section className="mb-6 flex flex-col gap-5 sm:mb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="max-w-[18ch] text-h1 text-ink md:text-h1-lg">Закрутим твою взрослую жизнь</h1>
          <p className="mt-3 max-w-[56ch] text-body text-muted-strong">
            Выберите комнату — внутри инструкции, рецепты и вопросы тех, кто уже через это прошёл.
          </p>
        </div>

        <SegmentedControl<HomeView>
          ariaLabel="Как показать разделы"
          value={view}
          onChange={setChosenView}
          options={[
            { value: 'plan', label: 'Схема', icon: Map },
            { value: 'list', label: 'Списком', icon: LayoutGrid },
          ]}
        />
      </section>

      {/* ── Схема квартиры или тот же выбор списком ──────────────────────── */}
      {view === 'plan' ? (
        <>
          <ApartmentPlan />
          <p className="mt-3 text-caption text-muted-strong">
            Нажмите на комнату, чтобы посмотреть, что внутри. Схему можно листать вбок.
          </p>
        </>
      ) : (
        <section aria-label="Комнаты списком">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room, index) => (
              <li key={room.id}>
                <RoomCard room={room} index={index} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Частые вопросы: прямые ссылки в подкатегории ─────────────────── */}
      <section aria-labelledby="popular-title" className="mt-14">
        <h2 id="popular-title" className="text-h2 text-ink">
          С чем приходят чаще всего
        </h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {popularItems.map((item, index) => (
            <li key={item.id}>
              <ItemCard item={item} index={index} />
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-14 space-y-4">
        <TipOfTheDay />
        <TelegramBanner />
      </div>
    </div>
  );
}
