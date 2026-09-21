import { useNavigate } from 'react-router-dom';
import type { KeyboardEvent } from 'react';
import { rooms } from '../../data/rooms';
import type { Room } from '../../types';
import { plural } from '../../lib/format';

/**
 * ПЛАН КВАРТИРЫ — главный экран проекта.
 *
 * Почему план сверху, а не изометрия или 3D:
 *  • изометрию нужно пересчитывать при каждом изменении раскладки
 *    (каждая комната — это пол + две стены + порядок наложения);
 *  • план сверху — это пять прямоугольников, координаты которых лежат
 *    в data/rooms.ts. Добавить комнату = дописать объект в массив.
 * Подробное сравнение вариантов — в README.
 *
 * Доступность: комната — это <g role="button"> с tabIndex и обработкой
 * Enter/Space. SVG-схема в принципе плохо читается скринридером, поэтому
 * под ней всегда есть список комнат обычными ссылками (RoomList) —
 * это не запасной вариант, а равноправный второй путь.
 */
export function ApartmentPlan() {
  const navigate = useNavigate();

  function open(roomId: string) {
    navigate(`/room/${roomId}`);
  }

  function handleKeyDown(event: KeyboardEvent<SVGGElement>, roomId: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open(roomId);
    }
  }

  return (
    <div className="overflow-x-auto rounded-card border border-line bg-surface p-3 shadow-soft sm:p-6">
      {/* min-width не даёт плану схлопнуться на узком экране: вместо
          нечитаемых 6-пиксельных подписей появляется горизонтальная прокрутка */}
      <svg
        viewBox="0 0 900 560"
        className="apartment-plan h-auto w-full min-w-[680px]"
        role="group"
        aria-label="План квартиры: выберите комнату"
      >
        {/* Внешние стены */}
        <rect
          x="6"
          y="6"
          width="888"
          height="548"
          rx="22"
          className="fill-paper stroke-line"
          strokeWidth="3"
        />

        {rooms.map((room) => (
          <RoomShape
            key={room.id}
            room={room}
            onOpen={() => open(room.id)}
            onKeyDown={(event) => handleKeyDown(event, room.id)}
          />
        ))}
      </svg>
    </div>
  );
}

function RoomShape({
  room,
  onOpen,
  onKeyDown,
}: {
  room: Room;
  onOpen: () => void;
  onKeyDown: (event: KeyboardEvent<SVGGElement>) => void;
}) {
  const { x, y, w, h } = room.plan;
  const isNarrow = h < 120; // коридор — в нём не помещается вторая строка подписи

  return (
    <g
      className="room-hit group"
      role="button"
      tabIndex={0}
      aria-label={`${room.title}. ${room.tagline}. ${room.items.length} ${plural(room.items.length, [
        'тема',
        'темы',
        'тем',
      ])}`}
      onClick={onOpen}
      onKeyDown={onKeyDown}
    >
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="14"
        strokeWidth="2"
        className="room-hit__body fill-surface stroke-line group-hover:fill-accent-soft group-hover:stroke-accent group-focus-visible:fill-accent-soft group-focus-visible:stroke-accent"
      />

      <text x={x + 20} y={y + 32} className="fill-ink font-display text-[19px] font-bold">
        {room.title}
      </text>

      {!isNarrow && (
        <text x={x + 20} y={y + 54} className="fill-muted font-body text-[13px]">
          {room.tagline}
        </text>
      )}

      <text
        x={x + w - 20}
        y={y + 32}
        textAnchor="end"
        className="fill-muted font-body text-[13px] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {room.items.length} {plural(room.items.length, ['тема', 'темы', 'тем'])}
      </text>

      {/* Предметы: маленькие иконки на своих местах внутри комнаты.
          Кликать по ним прямо со схемы нельзя — сначала комната.
          Так у пользователя один выбор на экран, а не двадцать. */}
      {room.items.map((item) => {
        const cx = x + (w * item.planSpot.x) / 100;
        const cy = y + (h * item.planSpot.y) / 100;
        const Icon = item.icon;

        return (
          <g key={item.id}>
            <rect
              x={cx - 19}
              y={cy - 19}
              width="38"
              height="38"
              rx="11"
              className="fill-paper stroke-line transition-colors group-hover:fill-white"
              strokeWidth="1.5"
            />
            <Icon
              x={cx - 11}
              y={cy - 11}
              width="22"
              height="22"
              className="text-muted transition-colors group-hover:text-accent-strong"
              aria-hidden="true"
            />
          </g>
        );
      })}
    </g>
  );
}
