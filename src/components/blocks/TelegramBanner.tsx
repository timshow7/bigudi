import { Send } from 'lucide-react';
import { Button } from '../ui/Button';

/**
 * Блок телеграм-бота. Текст описывает, что бот делает,
 * а не «подпишись на нас» — пользователю важно первое.
 */
export function TelegramBanner() {
  return (
    <section
      aria-labelledby="tg-title"
      className="flex flex-col gap-5 rounded-card border border-line bg-surface p-6 sm:flex-row sm:items-center sm:p-8"
    >
      <span
        aria-hidden="true"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-med-soft text-med-strong"
      >
        <Send className="h-6 w-6" />
      </span>

      <div className="flex-1">
        <h2 id="tg-title" className="text-h3 text-ink">
          Сохранить совет в Телеграм
        </h2>
        <p className="mt-1 max-w-[62ch] text-caption text-muted">
          Бот присылает ответы на ваши вопросы с форума и хранит статьи, которые вы отложили.
          Работает с тем же аккаунтом.
        </p>
      </div>

      <Button
        variant="secondary"
        iconLeft={<Send className="h-4 w-4" aria-hidden="true" />}
        onClick={() => window.open('https://t.me', '_blank', 'noopener')}
      >
        Открыть бота
      </Button>
    </section>
  );
}
