import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Menu, MessageCircle, Search, Settings, User, X } from 'lucide-react';
import { cn } from '../../lib/cn';

/**
 * Шапка. Здесь живёт второй (не «квартирный») путь навигации — тот самый,
 * который мы обсуждали: пользователь, который не хочет искать через схему,
 * переключается на «Статьи» / «Форум» или сразу идёт в поиск.
 */
export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Меню закрывается при переходе на другую страницу — иначе оно остаётся
  // открытым поверх нового экрана
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isForum = location.pathname.startsWith('/forum');

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
      <div className="container-page flex h-[72px] items-center gap-4">
        {/* Логотип: домик из линий, собранный прямо в разметке —
            отдельный файл ради четырёх фигур заводить не стоит */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5 rounded-ctl py-2 pr-2"
          aria-label="Бигуди — на главную"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-accent-soft">
            {/* Знак — бигуди: цилиндр с намотанной прядью.
                Рисуем прямо в разметке, отдельный файл ради шести фигур не нужен */}
            <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" aria-hidden="true">
              <rect
                x="3.5"
                y="6.5"
                width="17"
                height="11"
                rx="5.5"
                fill="none"
                stroke="#B4552F"
                strokeWidth="1.8"
              />
              <path
                d="M8 6.8 6 17.2M12.5 6.8l-2 10.4M17 6.8l-2 10.4"
                fill="none"
                stroke="#E07856"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="hidden sm:block">
            <span className="block font-display text-[18px] font-extrabold leading-tight text-ink">
              Бигуди
            </span>
            {/* Слоган виден только на широком экране — в шапке мало места */}
            <span className="hidden text-[12px] leading-tight text-muted lg:block">
              закрутим твою взрослую жизнь
            </span>
          </span>
        </Link>

        {/* Переключатель режима: Статьи / Форум */}
        <nav aria-label="Основные разделы" className="hidden md:block">
          <ul className="flex items-center gap-1">
            <ModeLink to="/" icon={BookOpen} label="Статьи" active={!isForum} />
            <ModeLink to="/forum" icon={MessageCircle} label="Форум" active={isForum} />
          </ul>
        </nav>

        {/* Это не поле ввода, а кнопка, ведущая на страницу поиска:
            там крупная строка, фильтры и адрес с запросом, которым можно
            поделиться. Два поля поиска на экране только путали бы */}
        <button
          type="button"
          onClick={() => navigate('/search')}
          className="ml-auto hidden h-11 max-w-sm flex-1 items-center gap-3 rounded-ctl border border-line bg-paper px-4 text-left text-caption text-muted transition-colors hover:border-[#DCD3C6] hover:text-muted-strong lg:flex"
        >
          <Search className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
          Найти совет, рецепт или обсуждение
        </button>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <IconButton label="Профиль" onClick={() => navigate('/profile')}>
            <User className="h-5 w-5" aria-hidden="true" />
          </IconButton>
          <IconButton label="Настройки" onClick={() => navigate('/profile')}>
            <Settings className="h-5 w-5" aria-hidden="true" />
          </IconButton>
          <IconButton
            label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="md:hidden"
            expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </IconButton>
        </div>
      </div>

      {/* Мобильное меню: поиск + те же два раздела */}
      {isMobileMenuOpen && (
        <div className="border-t border-line bg-surface px-4 pb-5 pt-4 md:hidden">
          <button
            type="button"
            onClick={() => navigate('/search')}
            className="mb-4 flex h-12 w-full items-center gap-3 rounded-ctl border border-line bg-paper px-4 text-left text-caption text-muted"
          >
            <Search className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
            Найти совет, рецепт или обсуждение
          </button>
          <nav aria-label="Основные разделы">
            <ul className="flex flex-col gap-1">
              <ModeLink to="/" icon={BookOpen} label="Статьи" active={!isForum} block />
              <ModeLink to="/forum" icon={MessageCircle} label="Форум" active={isForum} block />
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}

function ModeLink({
  to,
  icon: Icon,
  label,
  active,
  block = false,
}: {
  to: string;
  icon: typeof BookOpen;
  label: string;
  active: boolean;
  block?: boolean;
}) {
  return (
    <li className={block ? 'w-full' : undefined}>
      <Link
        to={to}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'relative flex h-11 items-center gap-2 rounded-ctl px-3 font-display text-body font-semibold transition-colors',
          block && 'w-full',
          active ? 'text-ink' : 'text-muted-strong hover:bg-paper hover:text-ink',
        )}
      >
        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
        {label}
        {active && !block && (
          <span aria-hidden="true" className="absolute inset-x-3 -bottom-0.5 h-[3px] rounded-full bg-accent" />
        )}
      </Link>
    </li>
  );
}

function IconButton({
  label,
  children,
  onClick,
  className,
  expanded,
}: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  expanded?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={expanded}
      title={label}
      // 44x44 — минимальный размер зоны нажатия
      className={cn(
        'flex h-11 w-11 items-center justify-center rounded-ctl text-muted-strong transition-colors hover:bg-paper hover:text-ink',
        className,
      )}
    >
      {children}
    </button>
  );
}
