import { Link } from 'react-router-dom';
import type { Room } from '../../types';
import { getArticlesByItem } from '../../data/articles';
import { plural } from '../../lib/format';

/**
 * Крупный план комнаты.
 *
 * Фон — один SVG (стена, пол, окно, ковёр), а предметы поверх него —
 * обычные HTML-ссылки с абсолютным позиционированием в процентах.
 * Почему не рисовать предметы внутри SVG: HTML-ссылка получает фокус,
 * подсказку, перенос текста и hover бесплатно, а координаты в процентах
 * сами подстраиваются под ширину экрана.
 *
 * На мобильном сцена скрыта (md:block): подписи в ней становятся
 * нечитаемыми, а список предметов под ней и так есть.
 */
export function RoomScene({ room }: { room: Room }) {
  return (
    <div className="relative hidden aspect-[16/9] w-full overflow-hidden rounded-card border border-line bg-surface shadow-soft md:block">
      <svg
        viewBox="0 0 800 450"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {/* Стена */}
        <rect x="0" y="0" width="800" height="300" fill="#FFFDFA" />
        {/* Пол в лёгкой перспективе */}
        <polygon points="70,300 730,300 800,450 0,450" fill="#F4EEE4" />
        <line x1="0" y1="300" x2="800" y2="300" stroke="#E8E2D9" strokeWidth="2" />

        {/* Окно слева — единственная декоративная деталь, чтобы сцена
            не была пустым прямоугольником */}
        <rect x="44" y="58" width="132" height="116" rx="8" fill="#F7FAFC" stroke="#E8E2D9" strokeWidth="2" />
        <line x1="110" y1="58" x2="110" y2="174" stroke="#E8E2D9" strokeWidth="2" />
        <line x1="44" y1="116" x2="176" y2="116" stroke="#E8E2D9" strokeWidth="2" />

        {/* Ковёр */}
        <ellipse cx="400" cy="392" rx="250" ry="42" fill="#EFE7DB" />
      </svg>

      {room.items.map((item) => {
        const Icon = item.icon;
        const count = getArticlesByItem(item.id).length;

        return (
          <Link
            key={item.id}
            to={`/room/${room.id}/${item.id}`}
            style={{ left: `${item.sceneSpot.x}%`, top: `${item.sceneSpot.y}%` }}
            aria-label={`${item.title}: ${
              count > 0 ? `${count} ${plural(count, ['статья', 'статьи', 'статей'])}` : 'статей пока нет'
            }`}
            className="group absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-card border border-line bg-surface/95 px-4 py-3 shadow-soft backdrop-blur-sm
              transition-all duration-200 hover:z-10 hover:-translate-y-[calc(50%+4px)] hover:border-accent hover:shadow-lift"
          >
            <span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-paper text-muted-strong transition-colors group-hover:bg-accent-soft group-hover:text-accent-strong"
            >
              <Icon className="h-5 w-5" />
            </span>
            <span className="text-left">
              <span className="block font-display text-caption font-bold text-ink">{item.title}</span>
              <span className="block text-[13px] text-muted">
                {count > 0
                  ? `${count} ${plural(count, ['статья', 'статьи', 'статей'])}`
                  : 'пока пусто'}
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
