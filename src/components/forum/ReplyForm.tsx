import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { useAppState } from '../../store/AppState';

const MIN_LENGTH = 15;
const MAX_LENGTH = 1000;

/**
 * Форма ответа.
 *
 * Валидация срабатывает по отправке, а не по каждому нажатию клавиши:
 * ошибка, которая загорается, пока человек ещё печатает первое слово,
 * раздражает и ничему не помогает.
 *
 * Отправка имитируется таймером — так виден и статус «отправляем»,
 * и появление ответа в треде. При подключении бэкенда меняется
 * только тело submit.
 */
export function ReplyForm({ onSubmit }: { onSubmit: (text: string) => void }) {
  const { profile } = useAppState();
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSending, setSending] = useState(false);

  const remaining = MAX_LENGTH - text.length;

  function handleSubmit() {
    const trimmed = text.trim();

    if (trimmed.length < MIN_LENGTH) {
      setError(`Ответ слишком короткий: нужно хотя бы ${MIN_LENGTH} символов, сейчас ${trimmed.length}.`);
      return;
    }

    setError(null);
    setSending(true);

    setTimeout(() => {
      onSubmit(trimmed);
      setText('');
      setSending(false);
    }, 700);
  }

  return (
    <section aria-labelledby="reply-form-title" className="rounded-card border border-line bg-surface p-5">
      <h2 id="reply-form-title" className="text-h3 text-ink">
        Ваш ответ
      </h2>

      <div className="mt-4 flex gap-3">
        <Avatar nickname={profile.name} size="md" />

        <div className="min-w-0 flex-1">
          <label htmlFor="reply-text" className="sr-only">
            Текст ответа
          </label>
          <textarea
            id="reply-text"
            value={text}
            maxLength={MAX_LENGTH}
            onChange={(event) => {
              setText(event.target.value);
              if (error) setError(null); // ошибка гаснет, как только человек начал править
            }}
            rows={4}
            placeholder="Расскажите, как решали эту задачу у себя. Конкретика помогает больше, чем общие советы."
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'reply-error' : 'reply-counter'}
            className="w-full resize-y rounded-ctl border border-line bg-paper p-4 text-body text-ink placeholder:text-muted focus:border-accent focus:outline-none"
          />

          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <p
              id={error ? 'reply-error' : 'reply-counter'}
              role={error ? 'alert' : undefined}
              className={`text-caption ${error ? 'text-accent-strong' : 'text-muted'}`}
            >
              {error ?? `Осталось ${remaining} символов`}
            </p>

            <Button
              variant="forum"
              loading={isSending}
              disabled={text.trim().length === 0}
              onClick={handleSubmit}
              iconLeft={!isSending ? <Send className="h-4 w-4" aria-hidden="true" /> : undefined}
            >
              {isSending ? 'Отправляем' : 'Ответить'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
