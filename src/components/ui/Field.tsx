import type { ChangeEvent, ReactNode } from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';

/**
 * Поля формы. Все три собраны по одной схеме:
 *   label → поле → подсказка или ошибка.
 *
 * Ошибка и подсказка занимают одно и то же место и связаны с полем через
 * aria-describedby, а поле с ошибкой помечено aria-invalid. Без этого
 * скринридер прочитает «Заголовок, текстовое поле» и не скажет, что не так.
 */

interface FieldShellProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  /** Например, «12 / 80» — показываем справа от подписи */
  counter?: string;
  required?: boolean;
  children: ReactNode;
}

function FieldShell({ id, label, hint, error, counter, required, children }: FieldShellProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="font-display text-caption font-semibold text-ink">
          {label}
          {required && (
            <span className="ml-1 text-accent-strong" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {counter && <span className="shrink-0 text-[13px] text-muted">{counter}</span>}
      </div>

      {children}

      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 flex items-start gap-1.5 text-caption text-accent-strong">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-caption text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

const controlClasses =
  'w-full rounded-ctl border bg-surface px-4 text-body text-ink placeholder:text-muted transition-colors focus:outline-none disabled:cursor-not-allowed disabled:bg-paper disabled:text-muted';

function borderClasses(hasError: boolean) {
  return hasError
    ? 'border-accent-strong focus:border-accent-strong'
    : 'border-line hover:border-[#DCD3C6] focus:border-accent';
}

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  maxLength?: number;
  required?: boolean;
  autoFocus?: boolean;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
  error,
  maxLength,
  required,
  autoFocus,
}: TextFieldProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={required}
      counter={maxLength ? `${value.length} / ${maxLength}` : undefined}
    >
      <input
        id={id}
        type="text"
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        className={cn(controlClasses, borderClasses(Boolean(error)), 'h-12')}
      />
    </FieldShell>
  );
}

interface TextAreaFieldProps extends Omit<TextFieldProps, 'autoFocus'> {
  rows?: number;
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
  error,
  maxLength,
  required,
  rows = 6,
}: TextAreaFieldProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={required}
      counter={maxLength ? `${value.length} / ${maxLength}` : undefined}
    >
      <textarea
        id={id}
        rows={rows}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value)}
        className={cn(controlClasses, borderClasses(Boolean(error)), 'resize-y py-3')}
      />
    </FieldShell>
  );
}

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

/**
 * Выпадающий список — нативный <select>. На телефоне он открывается
 * системным колесом, которое пальцем удобнее любого самописного меню,
 * и бесплатно получает клавиатуру и скринридер.
 */
export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  hint,
  error,
  disabled,
  required,
}: SelectFieldProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      <div className="relative">
        <select
          id={id}
          value={value}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            controlClasses,
            borderClasses(Boolean(error)),
            'h-12 appearance-none pr-11',
            value === '' && 'text-muted',
          )}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-ink">
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
      </div>
    </FieldShell>
  );
}
