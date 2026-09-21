import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Room } from '../../types';
import { accentStyles } from '../../lib/accents';

/**
 * Карточка комнаты для режима «Списком» — это тот самый дублирующий путь:
 * всё, что можно сделать на схеме, доступно обычными ссылками.
 * Здесь их даже больше: видны сразу и комната, и её предметы.
 *
 * Вложенных ссылок внутри ссылки быть не должно (это ломает клавиатуру),
 * поэтому заголовок — ссылка на комнату, а предметы — отдельные ссылки рядом.
 */
export function RoomCard({ room, index = 0 }: { room: Room; index?: number }) {
  const accent = accentStyles[room.accent];

  return (
    <article
      className="animate-fade-up rounded-card border border-line bg-surface p-5 shadow-soft transition-shadow duration-200 hover:shadow-lift"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-h3">
            <Link
              to={`/room/${room.id}`}
              className="text-ink transition-colors hover:text-accent-strong"
            >
              {room.title}
            </Link>
          </h3>
          <p className="mt-1 text-caption text-muted">{room.tagline}</p>
        </div>
        <span
          aria-hidden="true"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] ${accent.softBg} ${accent.text}`}
        >
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </div>

      <ul className="mt-4 flex flex-col gap-0.5">
        {room.items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.id}>
              <Link
                to={`/room/${room.id}/${item.id}`}
                className="flex min-h-[44px] items-center gap-2.5 rounded-ctl px-2 text-caption text-muted-strong transition-colors hover:bg-paper hover:text-ink"
              >
                <Icon className="h-[18px] w-[18px] shrink-0 text-muted" aria-hidden="true" />
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
