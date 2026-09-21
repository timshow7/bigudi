import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'forum';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Показывает спиннер и блокирует кнопку */
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

/**
 * ВАЖНО про цвет. В ТЗ акцент действия — #E07856. На белом фоне белый текст
 * на этом цвете даёт контраст 3.0 : 1, то есть не проходит WCAG AA (нужно 4.5).
 * Поэтому у залитых кнопок фон — затемнённый вариант той же терракоты
 * (accent-strong, 5.3 : 1), а исходный #E07856 остаётся на декоре:
 * иконках, подчёркиваниях, подложках, кольце фокуса. Визуально палитра та же.
 */
const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-accent-strong text-white shadow-soft hover:bg-[#9C4726] active:bg-[#8A3F21]',
  secondary: 'border border-line bg-surface text-ink hover:border-accent hover:text-accent-strong active:bg-accent-soft',
  ghost: 'text-muted-strong hover:bg-accent-soft hover:text-accent-strong active:bg-[#F6E2D9]',
  forum: 'bg-forum text-white shadow-soft hover:bg-forum-strong active:bg-[#32573C]',
};

/** Все размеры не ниже 44px — минимальная зона нажатия для пальца (WCAG 2.5.5) */
const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-11 gap-1.5 px-3.5 text-caption',
  md: 'h-12 gap-2 px-5 text-body',
  lg: 'h-14 gap-2.5 px-6 text-body',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  iconLeft,
  iconRight,
  fullWidth = false,
  disabled,
  children,
  className,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex select-none items-center justify-center rounded-ctl font-display font-semibold',
        'transition-all duration-200 active:translate-y-px',
        'disabled:pointer-events-none disabled:opacity-45',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : iconLeft}
      {children}
      {!loading && iconRight}
    </button>
  );
}

/**
 * Ссылка, выглядящая как кнопка.
 *
 * Нужна там, где по нажатию происходит переход: <button> внутри <a> —
 * невалидная разметка, и скринридер объявляет такой элемент дважды.
 * Здесь один элемент <a> с теми же классами, что у кнопки.
 */
export function LinkButton({
  to,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  fullWidth = false,
  children,
  className,
}: {
  to: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={cn(
        'inline-flex select-none items-center justify-center rounded-ctl font-display font-semibold',
        'transition-all duration-200 active:translate-y-px',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
    >
      {iconLeft}
      {children}
      {iconRight}
    </Link>
  );
}
