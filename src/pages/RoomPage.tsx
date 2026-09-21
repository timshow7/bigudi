import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { RoomScene } from '../components/apartment/RoomScene';
import { ItemCard } from '../components/cards/ItemCard';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { EmptyState } from '../components/ui/EmptyState';
import { Button, LinkButton } from '../components/ui/Button';
import { getRoom, rooms } from '../data/rooms';

/**
 * Экран комнаты. Второй шаг маршрута: квартира → комната → предмет.
 *
 * Сцена и список показывают одно и то же. Это не дублирование ради дублирования:
 * сцена отвечает на вопрос «где это в квартире», список — «сколько там всего
 * и о чём». На телефоне остаётся только список.
 */
export function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const room = getRoom(roomId);

  if (!room) {
    return (
      <div className="container-page py-16">
        <EmptyState
          variant="error"
          title="Такой комнаты нет"
          description="Возможно, ссылка устарела или в адресе опечатка. Вернитесь к плану квартиры и выберите комнату заново."
          action={
            <LinkButton to="/">К плану квартиры</LinkButton>
          }
        />
      </div>
    );
  }

  const otherRooms = rooms.filter((item) => item.id !== room.id);

  return (
    <div className="container-page pb-4 pt-2">
      <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: room.title }]} />

      <header className="mb-6 mt-2 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-h1 text-ink md:text-h1-lg">{room.title}</h1>
          <p className="mt-2 max-w-[56ch] text-body text-muted-strong">{room.tagline}</p>
        </div>

        <Link
          to="/"
          className="inline-flex h-11 items-center gap-2 self-start rounded-ctl px-2 text-caption font-semibold text-muted-strong transition-colors hover:text-accent-strong sm:self-auto"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Ко всей квартире
        </Link>
      </header>

      <RoomScene room={room} />

      <section aria-labelledby="room-items" className="mt-8 md:mt-10">
        <h2 id="room-items" className="text-h2 text-ink">
          Что здесь есть
        </h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {room.items.map((item, index) => (
            <li key={item.id}>
              <ItemCard item={item} index={index} />
            </li>
          ))}
        </ul>
      </section>

      {/* Переход в соседние комнаты — чтобы не возвращаться на главную
          каждый раз, когда нужная тема оказалась в другой комнате */}
      <nav aria-label="Другие комнаты" className="mt-12 border-t border-line pt-6">
        <h2 className="text-h3 text-ink">Другие комнаты</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {otherRooms.map((item) => (
            <li key={item.id}>
              <Link
                to={`/room/${item.id}`}
                className="inline-flex h-11 items-center rounded-ctl border border-line bg-surface px-4 text-caption font-medium text-muted-strong transition-colors hover:border-accent hover:text-accent-strong"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
