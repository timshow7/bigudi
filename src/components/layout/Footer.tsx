import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';
import { rooms } from '../../data/rooms';

/**
 * Подвал. Ссылки на комнаты берутся из data/rooms.ts — если добавится
 * шестая комната, подвал обновится сам.
 */
export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <h2 className="text-h3 text-ink">Бигуди</h2>
          <p className="mt-1 text-caption font-semibold text-accent-strong">
            Закрутим твою взрослую жизнь
          </p>
          <p className="mt-3 max-w-xs text-caption text-muted">
            Накрутил на ночь — утром красиво. Бытовые советы, рецепты и базовое здоровье для тех,
            кто только начал жить отдельно. Учебный проект.
          </p>
        </div>

        <nav aria-labelledby="footer-rooms">
          <h2 id="footer-rooms" className="text-h3 text-ink">
            Комнаты
          </h2>
          <ul className="mt-3 space-y-1">
            {rooms.map((room) => (
              <li key={room.id}>
                <Link
                  to={`/room/${room.id}`}
                  className="inline-flex min-h-[40px] items-center text-caption text-muted transition-colors hover:text-accent-strong"
                >
                  {room.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-h3 text-ink">Связь</h2>
          <ul className="mt-3 space-y-1">
            <li>
              <a
                href="https://t.me"
                className="inline-flex min-h-[40px] items-center gap-2 text-caption text-muted transition-colors hover:text-accent-strong"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                Телеграм-бот
              </a>
            </li>
            <li>
              <Link
                to="/search"
                className="inline-flex min-h-[40px] items-center text-caption text-muted transition-colors hover:text-accent-strong"
              >
                Поиск
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="inline-flex min-h-[40px] items-center text-caption text-muted transition-colors hover:text-accent-strong"
              >
                О проекте
              </Link>
            </li>
            <li>
              <Link
                to="/rules"
                className="inline-flex min-h-[40px] items-center text-caption text-muted transition-colors hover:text-accent-strong"
              >
                Правила форума
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page py-5 text-caption text-muted">
          Учебный проект, 2026. Советы не заменяют консультацию врача.
        </div>
      </div>
    </footer>
  );
}
