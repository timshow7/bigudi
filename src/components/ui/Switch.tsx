import { cn } from '../../lib/cn';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}

/**
 * Переключатель. Это <button role="switch"> с aria-checked, а не чекбокс:
 * переключатель применяется сразу, чекбокс — после сохранения формы.
 * Разница слышна в скринридере и понятна пользователю по поведению.
 */
export function Switch({ checked, onChange, label, description, disabled = false }: SwitchProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="min-w-0">
        <p className="font-display text-caption font-semibold text-ink">{label}</p>
        {description && <p className="mt-0.5 text-caption text-muted">{description}</p>}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative mt-0.5 h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-45',
          checked ? 'bg-forum' : 'bg-line',
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'absolute top-1 h-5 w-5 rounded-full bg-surface shadow-soft transition-transform duration-200',
            checked ? 'translate-x-6' : 'translate-x-1',
          )}
        />
      </button>
    </div>
  );
}
