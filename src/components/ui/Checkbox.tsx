import { Check } from 'lucide-react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  /** Например, количество статей, подходящих под фильтр */
  hint?: string;
  disabled?: boolean;
}

/**
 * Чекбокс с собственной отрисовкой. Настоящий <input> остаётся в разметке
 * (sr-only) — он даёт нативную клавиатуру, фокус и объявление состояния.
 * Вся строка-лейбл кликабельна и имеет высоту 44px.
 */
export function Checkbox({ checked, onChange, label, hint, disabled = false }: CheckboxProps) {
  return (
    <label
      className={`group flex min-h-[44px] cursor-pointer items-center gap-3 rounded-ctl px-2 transition-colors hover:bg-paper ${
        disabled ? 'cursor-not-allowed opacity-45 hover:bg-transparent' : ''
      }`}
    >
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span
        aria-hidden="true"
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border border-line bg-surface transition-all
          peer-checked:border-accent-strong peer-checked:bg-accent-strong
          peer-checked:[&_svg]:opacity-100
          peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent"
      >
        {/* Галочка лежит внутри span, поэтому обычный peer-checked: к ней не применится —
            нужен вариант с вложенным селектором (см. класс выше) */}
        <Check className="h-3.5 w-3.5 text-white opacity-0 transition-opacity" />
      </span>
      <span className="flex-1 text-caption text-ink">{label}</span>
      {hint && <span className="text-caption text-muted">{hint}</span>}
    </label>
  );
}
