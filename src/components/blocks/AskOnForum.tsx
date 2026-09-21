import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { Button } from '../ui/Button';

/**
 * Мост между статьями и форумом: стоит внизу страницы подкатегории и статьи.
 * Благодаря нему пользователю не нужно самому догадываться,
 * что у сервиса есть вторая половина.
 */
export function AskOnForum({ itemTitle }: { itemTitle: string }) {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col gap-5 rounded-card border border-line bg-forum-soft p-6 sm:flex-row sm:items-center sm:p-8">
      <span
        aria-hidden="true"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-surface text-forum-strong"
      >
        <MessageCircle className="h-6 w-6" />
      </span>

      <div className="flex-1">
        <h2 className="text-h3 text-forum-strong">Не нашли ответ?</h2>
        <p className="mt-1 max-w-[62ch] text-caption text-ink">
          Спросите на форуме — вопрос сразу попадёт в раздел «{itemTitle}», и его увидят те,
          кто с этим уже разбирался.
        </p>
      </div>

      <Button variant="forum" onClick={() => navigate('/forum/new')}>
        Задать вопрос
      </Button>
    </section>
  );
}
