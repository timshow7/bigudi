import { Link } from 'react-router-dom';
import { Lightbulb } from 'lucide-react';
import { tipOfTheDay } from '../../data/forum';

/**
 * «Совет дня». Единственный блок на главной с цветной заливкой —
 * поэтому он и читается как акцент. Если залить так же ещё пару блоков,
 * страница станет пёстрой и акцент пропадёт.
 */
export function TipOfTheDay() {
  return (
    <section
      aria-labelledby="tip-title"
      className="flex flex-col gap-5 rounded-card bg-accent-soft p-6 sm:flex-row sm:items-center sm:p-8"
    >
      <span
        aria-hidden="true"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-surface text-accent-strong"
      >
        <Lightbulb className="h-6 w-6" />
      </span>

      <div className="flex-1">
        <h2 id="tip-title" className="text-h3 text-accent-strong">
          {tipOfTheDay.title}
        </h2>
        {/* max-w держит строку короче 80 символов — так текст читается легче */}
        <p className="mt-1 max-w-[62ch] text-body text-ink">{tipOfTheDay.text}</p>
      </div>

      <Link
        to={`/article/${tipOfTheDay.articleId}`}
        className="inline-flex h-12 shrink-0 items-center justify-center rounded-ctl bg-surface px-5 font-display font-semibold text-accent-strong transition-colors hover:bg-white"
      >
        Читать подробнее
      </Link>
    </section>
  );
}
