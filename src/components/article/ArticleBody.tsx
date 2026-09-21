import { useEffect, useState } from 'react';
import { AlertTriangle, Lightbulb } from 'lucide-react';
import type { ArticleBlock } from '../../types';

/**
 * Отрисовка статьи из блоков.
 *
 * Почему не dangerouslySetInnerHTML с готовым HTML: статьи будут писать
 * пользователи и редакторы, и вставлять их разметку напрямую — это дыра
 * в безопасности. Блоки описывают смысл («заголовок», «шаги», «предупреждение»),
 * а как это выглядит, решает компонент.
 */
export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    // max-w-[68ch] — строка около 70 символов, дальше глаз теряет начало строки
    <div className="max-w-[68ch]">
      {blocks.map((block, index) => (
        <Block key={index} block={block} />
      ))}
    </div>
  );
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case 'heading':
      return (
        // scroll-mt-24 — поправка на липкую шапку при переходе по якорю
        <h2 id={block.id} className="mt-10 scroll-mt-24 text-h2 text-ink first:mt-0">
          {block.text}
        </h2>
      );

    case 'paragraph':
      return <p className="mt-4 text-body text-ink">{block.text}</p>;

    case 'list':
      return block.ordered ? (
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-body text-ink marker:text-muted">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      ) : (
        <ul className="mt-4 list-disc space-y-2 pl-5 text-body text-ink marker:text-accent">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );

    case 'steps':
      // Нумерация здесь оправдана: это реальная последовательность действий,
      // шаги нельзя поменять местами
      return (
        <ol className="mt-6 space-y-4">
          {block.items.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft font-display text-caption font-bold text-accent-strong"
              >
                {index + 1}
              </span>
              <div>
                <h3 className="text-h3 text-ink">{step.title}</h3>
                <p className="mt-1 text-body text-ink">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      );

    case 'callout': {
      const isWarning = block.tone === 'warning';
      const Icon = isWarning ? AlertTriangle : Lightbulb;
      return (
        <aside
          className={`mt-6 flex gap-4 rounded-card p-5 ${
            isWarning ? 'bg-[#FBE9E4]' : 'bg-med-soft'
          }`}
        >
          <Icon
            className={`h-5 w-5 shrink-0 ${isWarning ? 'text-accent-strong' : 'text-med-strong'}`}
            aria-hidden="true"
          />
          <div>
            <h3 className={`text-h3 ${isWarning ? 'text-accent-strong' : 'text-med-strong'}`}>
              {block.title}
            </h3>
            <p className="mt-1 text-body text-ink">{block.text}</p>
          </div>
        </aside>
      );
    }

    default:
      return null;
  }
}

/**
 * Оглавление статьи. Собирается из блоков-заголовков, активный пункт
 * подсвечивается по мере прокрутки (IntersectionObserver, без обработчика
 * scroll — он дешевле и не дёргается).
 */
export function ArticleToc({ blocks }: { blocks: ArticleBlock[] }) {
  const headings = blocks.filter(
    (block): block is Extract<ArticleBlock, { type: 'heading' }> => block.type === 'heading',
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      // Верхняя граница опущена под шапку, нижняя поднята: активным считается
      // заголовок в верхней трети экрана
      { rootMargin: '-88px 0px -65% 0px' },
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
    // Зависим от строки из id, а не от массива: он пересоздаётся при рендере
  }, [headings.map((heading) => heading.id).join(',')]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="Содержание статьи" className="lg:sticky lg:top-[88px]">
      <h2 className="font-display text-caption font-semibold text-muted-strong">В статье</h2>
      <ul className="mt-3 space-y-0.5 border-l border-line">
        {headings.map((heading) => {
          const isActive = heading.id === activeId;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`-ml-px flex min-h-[40px] items-center border-l-2 pl-3 text-caption transition-colors ${
                  isActive
                    ? 'border-accent font-semibold text-ink'
                    : 'border-transparent text-muted hover:text-accent-strong'
                }`}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
