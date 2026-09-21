import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, MessageCircle, Pencil, Send, Settings as SettingsIcon } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { Button, LinkButton } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { EmptyState } from '../components/ui/EmptyState';
import { Switch } from '../components/ui/Switch';
import { Tabs } from '../components/ui/Tabs';
import { TextAreaField, TextField } from '../components/ui/Field';
import { ArticleCard } from '../components/cards/ArticleCard';
import { TopicCard } from '../components/cards/TopicCard';
import { articles } from '../data/articles';
import { getTopic } from '../data/forum';
import { rooms } from '../data/rooms';
import { formatDate, plural } from '../lib/format';
import { healthLimitOptions, useAppState } from '../store/AppState';

type ProfileTab = 'saved' | 'topics' | 'replies' | 'settings';

/**
 * Профиль.
 *
 * Всё, что здесь показано, собирается из общего состояния (store/AppState):
 * сохранённые статьи приходят с экрана статьи, темы — из формы создания,
 * ответы — из тредов. Поэтому профиль не хранит ничего своего, кроме
 * состояния формы редактирования.
 */
export function ProfilePage() {
  const { profile, savedArticleIds, ownTopics, ownReplies } = useAppState();

  const [tab, setTab] = useState<ProfileTab>('saved');
  const [isEditing, setEditing] = useState(false);

  const savedArticles = articles.filter((article) => savedArticleIds.includes(article.id));

  return (
    <div className="container-page pb-4 pt-2">
      {/* ── Шапка профиля ───────────────────────────────────────────────── */}
      <section className="mt-6 rounded-card border border-line bg-surface p-5 sm:p-6">
        {isEditing ? (
          <ProfileEditForm onClose={() => setEditing(false)} />
        ) : (
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <Avatar nickname={profile.name} size="lg" />

            <div className="min-w-0 flex-1">
              <h1 className="text-h1 text-ink md:text-h1-lg">{profile.name}</h1>
              <p className="mt-2 max-w-[58ch] text-body text-muted-strong">{profile.bio}</p>

              <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-caption">
                <div className="flex gap-1.5">
                  <dt className="text-muted">Сохранено:</dt>
                  <dd className="font-semibold text-ink">
                    {savedArticles.length} {plural(savedArticles.length, ['статья', 'статьи', 'статей'])}
                  </dd>
                </div>
                <div className="flex gap-1.5">
                  <dt className="text-muted">Вопросов:</dt>
                  <dd className="font-semibold text-ink">{ownTopics.length}</dd>
                </div>
                <div className="flex gap-1.5">
                  <dt className="text-muted">Ответов:</dt>
                  <dd className="font-semibold text-ink">{ownReplies.length}</dd>
                </div>
              </dl>
            </div>

            <Button
              variant="secondary"
              onClick={() => setEditing(true)}
              iconLeft={<Pencil className="h-4 w-4" aria-hidden="true" />}
            >
              Редактировать
            </Button>
          </div>
        )}
      </section>

      {/* ── Вкладки ─────────────────────────────────────────────────────── */}
      <div className="mt-8">
        <Tabs
          ariaLabel="Разделы профиля"
          value={tab}
          onChange={(value) => setTab(value as ProfileTab)}
          items={[
            { id: 'saved', label: 'Избранное', count: savedArticles.length, icon: Bookmark },
            { id: 'topics', label: 'Мои темы', count: ownTopics.length, icon: MessageCircle },
            { id: 'replies', label: 'Мои ответы', count: ownReplies.length, icon: MessageCircle },
            { id: 'settings', label: 'Настройки', icon: SettingsIcon },
          ]}
        />
      </div>

      <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} tabIndex={0} className="mt-6">
        {tab === 'saved' &&
          (savedArticles.length === 0 ? (
            <EmptyState
              title="Ты пока ничего не сохранил"
              description="Кнопка «Сохранить» есть внизу каждой статьи. Всё отложенное собирается здесь — удобно перед переездом или большой уборкой."
              action={<LinkButton to="/">Найти первую статью</LinkButton>}
            />
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {savedArticles.map((article, index) => (
                <li key={article.id} className="flex">
                  <ArticleCard article={article} index={index} />
                </li>
              ))}
            </ul>
          ))}

        {tab === 'topics' &&
          (ownTopics.length === 0 ? (
            <EmptyState
              title="Ты ещё не создал ни одной темы"
              description="Если ответа нет ни в статьях, ни в обсуждениях — спросите сами. На вопросы новичков отвечают охотнее всего."
              action={<LinkButton to="/forum/new" variant="forum">Задать вопрос</LinkButton>}
            />
          ) : (
            <ul className="flex flex-col gap-4">
              {ownTopics.map((topic, index) => (
                <li key={topic.id}>
                  <TopicCard topic={topic} index={index} />
                </li>
              ))}
            </ul>
          ))}

        {tab === 'replies' &&
          (ownReplies.length === 0 ? (
            <EmptyState
              title="Ты пока никому не ответил"
              description="Ответы появятся здесь. Даже короткий ответ из личного опыта поднимает рейтинг и помогает такому же первокурснику."
              action={<LinkButton to="/forum" variant="forum">Посмотреть вопросы</LinkButton>}
            />
          ) : (
            <ul className="flex flex-col gap-4">
              {ownReplies.map((reply) => {
                // Тема может быть как из данных, так и своя, созданная в форме
                const topic = getTopic(reply.topicId) ?? ownTopics.find((own) => own.id === reply.topicId);

                return (
                  <li key={reply.id}>
                    <article className="rounded-card border border-line bg-surface p-5">
                      <p className="text-caption text-muted">
                        Ответ в теме{' '}
                        <Link
                          to={`/forum/${reply.topicId}`}
                          className="font-semibold text-forum-strong transition-colors hover:text-forum"
                        >
                          {topic?.title ?? 'Тема удалена'}
                        </Link>
                      </p>
                      <p className="mt-2 whitespace-pre-line text-body text-ink">{reply.text}</p>
                      <p className="mt-3 text-caption text-muted">{formatDate(reply.createdAt)}</p>
                    </article>
                  </li>
                );
              })}
            </ul>
          ))}

        {tab === 'settings' && <ProfileSettings />}
      </div>
    </div>
  );
}

/** Инлайн-форма редактирования: открывается на месте шапки, без отдельной страницы */
function ProfileEditForm({ onClose }: { onClose: () => void }) {
  const { profile, updateProfile } = useAppState();
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [error, setError] = useState<string | undefined>();

  function save() {
    if (name.trim().length < 2) {
      setError('Имя нужно хотя бы из двух символов.');
      return;
    }
    updateProfile({ name: name.trim(), bio: bio.trim() });
    onClose();
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-h2 text-ink">Редактирование профиля</h1>

      <TextField
        id="profile-name"
        label="Имя"
        value={name}
        maxLength={40}
        error={error}
        autoFocus
        onChange={(value) => {
          setName(value);
          setError(undefined);
        }}
      />

      <TextAreaField
        id="profile-bio"
        label="О себе"
        rows={3}
        value={bio}
        maxLength={200}
        hint="Пара строк: где живёшь, что осваиваешь. Помогает на форуме."
        onChange={setBio}
      />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onClose}>
          Отмена
        </Button>
        <Button onClick={save}>Сохранить</Button>
      </div>
    </div>
  );
}

/** Настройки: уведомления, любимые комнаты, ограничения по здоровью */
function ProfileSettings() {
  const { profile, updateProfile } = useAppState();
  const [isLinking, setLinking] = useState(false);

  function toggleInList(key: 'favoriteRooms' | 'healthLimits', id: string) {
    const list = profile[key];
    updateProfile({
      [key]: list.includes(id) ? list.filter((value) => value !== id) : [...list, id],
    });
  }

  function linkTelegram() {
    setLinking(true);
    // Заглушка: настоящая привязка появится вместе с ботом
    setTimeout(() => {
      updateProfile({ telegramLinked: true });
      setLinking(false);
    }, 900);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-card border border-line bg-surface p-5">
        <h2 className="text-h3 text-ink">Уведомления</h2>
        <div className="mt-3 divide-y divide-line">
          <Switch
            label="Уведомления в Telegram"
            description="Ответы на твои вопросы и новые статьи в любимых комнатах"
            checked={profile.telegramNotifications}
            onChange={(checked) => updateProfile({ telegramNotifications: checked })}
            disabled={!profile.telegramLinked}
          />
        </div>

        <div className="mt-4 border-t border-line pt-4">
          {profile.telegramLinked ? (
            <p className="flex items-center gap-2 text-caption text-forum-strong">
              <Send className="h-4 w-4" aria-hidden="true" />
              Telegram привязан. Отвязать можно будет в боте.
            </p>
          ) : (
            <>
              <Button
                variant="secondary"
                loading={isLinking}
                onClick={linkTelegram}
                iconLeft={!isLinking ? <Send className="h-4 w-4" aria-hidden="true" /> : undefined}
              >
                {isLinking ? 'Привязываем' : 'Привязать Telegram'}
              </Button>
              <p className="mt-2 text-caption text-muted">
                Пока это заглушка: бота ещё нет, кнопка только показывает состояние.
              </p>
            </>
          )}
        </div>
      </section>

      <section className="rounded-card border border-line bg-surface p-5">
        <h2 className="text-h3 text-ink">Любимые комнаты</h2>
        <p className="mt-1 text-caption text-muted">Их материалы поднимаются выше в подборках.</p>
        <div className="mt-3 flex flex-col">
          {rooms.map((room) => (
            <Checkbox
              key={room.id}
              label={room.title}
              hint={room.tagline}
              checked={profile.favoriteRooms.includes(room.id)}
              onChange={() => toggleInList('favoriteRooms', room.id)}
            />
          ))}
        </div>
      </section>

      <section className="rounded-card border border-line bg-surface p-5 lg:col-span-2">
        <h2 className="text-h3 text-ink">Ограничения по здоровью</h2>
        <p className="mt-1 max-w-[62ch] text-caption text-muted">
          Влияют на подбор: советы с бытовой химией, ступеньками или продуктами-аллергенами будут
          помечены. Другим участникам эти отметки не видны.
        </p>
        <div className="mt-3 flex flex-col sm:grid sm:grid-cols-2">
          {healthLimitOptions.map((option) => (
            <Checkbox
              key={option.id}
              label={option.label}
              checked={profile.healthLimits.includes(option.id)}
              onChange={() => toggleInList('healthLimits', option.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
