import { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import type { Reply } from '../../types';
import { UserLine } from '../ui/UserLine';
import { formatDate } from '../../lib/format';
import { cn } from '../../lib/cn';

/**
 * Ответ в треде.
 *
 * Голос хранится локально: повторное нажатие снимает голос, нажатие
 * противоположной стрелки переключает. Счётчик считается от исходного
 * значения, а не накапливается — иначе после трёх кликов появятся
 * «мои» три голоса.
 */
export function ReplyItem({ reply, index = 0 }: { reply: Reply; index?: number }) {
  const [vote, setVote] = useState<-1 | 0 | 1>(0);

  function toggleVote(value: 1 | -1) {
    setVote((current) => (current === value ? 0 : value));
  }

  return (
    <article
      className={cn(
        'animate-fade-up rounded-card border bg-surface p-5',
        reply.accepted ? 'border-forum bg-forum-soft/40' : 'border-line',
      )}
      style={{ animationDelay: `${Math.min(index, 6) * 50}ms` }}
    >
      {reply.accepted && (
        <p className="mb-3 flex items-center gap-2 text-caption font-semibold text-forum-strong">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          Автор отметил этот ответ решением
        </p>
      )}

      <div className="flex gap-4">
        {/* Колонка голосования */}
        <div className="flex w-11 shrink-0 flex-col items-center">
          <VoteButton
            direction="up"
            active={vote === 1}
            onClick={() => toggleVote(1)}
            label="Ответ помог"
          />
          <span
            className={cn(
              'py-1 font-display text-caption font-bold',
              vote === 1 && 'text-forum-strong',
              vote === -1 && 'text-accent-strong',
              vote === 0 && 'text-ink',
            )}
          >
            {reply.votes + vote}
          </span>
          <VoteButton
            direction="down"
            active={vote === -1}
            onClick={() => toggleVote(-1)}
            label="Ответ не помог"
          />
        </div>

        <div className="min-w-0 flex-1">
          <UserLine nickname={reply.author} meta={formatDate(reply.createdAt)} size="sm" />
          {/* whitespace-pre-line сохраняет переносы строк из формы ответа */}
          <p className="mt-3 max-w-[68ch] whitespace-pre-line text-body text-ink">{reply.text}</p>
        </div>
      </div>
    </article>
  );
}

function VoteButton({
  direction,
  active,
  onClick,
  label,
}: {
  direction: 'up' | 'down';
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  const Icon = direction === 'up' ? ChevronUp : ChevronDown;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={cn(
        'flex h-11 w-11 items-center justify-center rounded-ctl transition-colors',
        active
          ? direction === 'up'
            ? 'bg-forum-soft text-forum-strong'
            : 'bg-accent-soft text-accent-strong'
          : 'text-muted hover:bg-paper hover:text-ink',
      )}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
