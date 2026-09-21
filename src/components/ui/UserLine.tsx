import { BadgeCheck } from 'lucide-react';
import { Avatar } from './Avatar';
import { getUser } from '../../data/users';
import { plural } from '../../lib/format';

/**
 * Строка «автор + рейтинг». Одинаково выглядит в вопросе, в ответе и в топе
 * участников — чтобы рейтинг читался как одна и та же сущность везде.
 */
export function UserLine({
  nickname,
  meta,
  size = 'md',
}: {
  nickname: string;
  /** Дополнительная подпись справа: дата, давность */
  meta?: string;
  size?: 'sm' | 'md';
}) {
  const user = getUser(nickname);

  return (
    <div className="flex items-center gap-3">
      <Avatar nickname={nickname} size={size === 'sm' ? 'sm' : 'md'} />
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 font-display text-caption font-bold text-ink">
          <span className="truncate">{user.nickname}</span>
          {user.verified && (
            <>
              <BadgeCheck className="h-4 w-4 shrink-0 text-forum" aria-hidden="true" />
              <span className="sr-only">проверенный автор</span>
            </>
          )}
        </p>
        <p className="text-[13px] text-muted">
          {user.level}, {user.rating} {plural(user.rating, ['балл', 'балла', 'баллов'])}
          {meta && `, ${meta}`}
        </p>
      </div>
    </div>
  );
}
