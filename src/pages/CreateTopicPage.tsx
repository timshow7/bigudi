import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Send } from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button, LinkButton } from '../components/ui/Button';
import { SelectField, TextAreaField, TextField } from '../components/ui/Field';
import { TagPicker } from '../components/ui/TagPicker';
import { TopicCard } from '../components/cards/TopicCard';
import { rooms, getRoom } from '../data/rooms';
import { collectTags } from '../lib/search';
import { useAppState } from '../store/AppState';
import type { ForumTopic } from '../types';

const MIN_TITLE = 10;
const MAX_TITLE = 120;
const MIN_TEXT = 30;
const MAX_TEXT = 2000;

interface FormErrors {
  title?: string;
  roomId?: string;
  itemId?: string;
  text?: string;
}

/**
 * Создание темы.
 *
 * Два правила формы, из-за которых она устроена именно так:
 *
 * 1. Комната и подкатегория связаны: список предметов зависит от комнаты,
 *    поэтому поле предмета заблокировано, пока комната не выбрана,
 *    и сбрасывается при её смене. Иначе легко получить тему «стиралка»
 *    в разделе «Кухня».
 * 2. Ошибки показываются по отправке, а не по каждому нажатию клавиши.
 *    Пока человек печатает первое слово заголовка, ругаться не за что.
 *    После первой неудачной отправки ошибка поля гаснет сразу, как только
 *    его начали править.
 */
export function CreateTopicPage() {
  const navigate = useNavigate();
  const { profile, addTopic, ownTopics } = useAppState();

  const [title, setTitle] = useState('');
  const [roomId, setRoomId] = useState('');
  const [itemId, setItemId] = useState('');
  const [text, setText] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSending, setSending] = useState(false);

  const selectedRoom = getRoom(roomId);
  const tagSuggestions = useMemo(() => collectTags(ownTopics), [ownTopics]);

  function clearError(field: keyof FormErrors) {
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));
  }

  function validate(): FormErrors {
    const next: FormErrors = {};

    if (title.trim().length < MIN_TITLE) {
      next.title = `Заголовок слишком короткий: нужно хотя бы ${MIN_TITLE} символов, сейчас ${title.trim().length}.`;
    }
    if (!roomId) next.roomId = 'Выберите комнату — по ней тему найдут другие.';
    if (!itemId) next.itemId = 'Выберите подкатегорию.';
    if (text.trim().length < MIN_TEXT) {
      next.text = `Опишите ситуацию подробнее: нужно хотя бы ${MIN_TEXT} символов, сейчас ${text.trim().length}.`;
    }

    return next;
  }

  function handleSubmit() {
    const found = validate();
    setErrors(found);

    const firstInvalid = (['title', 'roomId', 'itemId', 'text'] as const).find((field) => found[field]);
    if (firstInvalid) {
      // Переводим фокус на первое поле с ошибкой: без этого на длинной форме
      // человек не понимает, что именно не так
      document.getElementById(firstInvalid === 'roomId' ? 'topic-room' : firstInvalid === 'itemId' ? 'topic-item' : `topic-${firstInvalid}`)?.focus();
      return;
    }

    setSending(true);

    // Имитация запроса. Появится backend — здесь будет fetch,
    // а всё остальное останется как есть
    setTimeout(() => {
      const now = new Date();
      const topic: ForumTopic = {
        id: `own-${now.getTime()}`,
        itemId,
        title: title.trim(),
        excerpt: text.trim(),
        author: profile.name,
        answers: 0,
        views: 1,
        lastActivity: 'только что',
        lastActivityAt: now.toISOString(),
        solved: false,
        tags,
      };

      addTopic(topic);
      setSending(false);
      navigate(`/forum/${topic.id}`);
    }, 800);
  }

  /** Черновик для превью справа — та же карточка, что в ленте форума */
  const previewTopic: ForumTopic = {
    id: 'preview',
    itemId: itemId || 'washing-machine',
    title: title.trim() || 'Заголовок вопроса появится здесь',
    excerpt: text.trim() || 'А здесь — то, что вы напишете в описании. Так тему увидят в ленте.',
    author: profile.name,
    answers: 0,
    views: 0,
    lastActivity: 'только что',
    lastActivityAt: new Date().toISOString(),
    solved: false,
    tags,
  };

  return (
    <div className="container-page pb-4 pt-2">
      <Breadcrumbs
        items={[{ label: 'Главная', to: '/' }, { label: 'Форум', to: '/forum' }, { label: 'Новый вопрос' }]}
      />

      <header className="mb-6 mt-2">
        <h1 className="text-h1 text-ink md:text-h1-lg">Новый вопрос</h1>
        <p className="mt-2 max-w-[58ch] text-body text-muted-strong">
          Опишите ситуацию своими словами. Чем конкретнее вопрос, тем быстрее на него ответят.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* Форма. Это <form>, а не набор полей: так работает отправка по Enter
            и браузер подсказывает «отправить» на мобильной клавиатуре */}
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
          className="rounded-card border border-line bg-surface p-5 sm:p-6"
        >
          <div className="flex flex-col gap-6">
            <TextField
              id="topic-title"
              label="Заголовок"
              required
              value={title}
              maxLength={MAX_TITLE}
              error={errors.title}
              hint="Лучше вопросом: «Почему стиралка гудит при отжиме?»"
              placeholder="Что случилось?"
              onChange={(value) => {
                setTitle(value);
                clearError('title');
              }}
            />

            <div className="grid gap-6 sm:grid-cols-2">
              <SelectField
                id="topic-room"
                label="Комната"
                required
                value={roomId}
                placeholder="Выберите комнату"
                error={errors.roomId}
                options={rooms.map((room) => ({ value: room.id, label: room.title }))}
                onChange={(value) => {
                  setRoomId(value);
                  setItemId(''); // предмет из прошлой комнаты больше не подходит
                  clearError('roomId');
                }}
              />

              <SelectField
                id="topic-item"
                label="Подкатегория"
                required
                value={itemId}
                disabled={!selectedRoom}
                placeholder={selectedRoom ? 'Выберите предмет' : 'Сначала выберите комнату'}
                error={errors.itemId}
                hint={selectedRoom ? undefined : 'Список зависит от комнаты'}
                options={(selectedRoom?.items ?? []).map((item) => ({ value: item.id, label: item.title }))}
                onChange={(value) => {
                  setItemId(value);
                  clearError('itemId');
                }}
              />
            </div>

            <TextAreaField
              id="topic-text"
              label="Описание"
              required
              value={text}
              maxLength={MAX_TEXT}
              error={errors.text}
              hint="Что уже пробовали, какая техника, сколько ей лет — это экономит десяток уточняющих ответов."
              placeholder="Расскажите, что происходит и что вы уже пытались сделать."
              onChange={(value) => {
                setText(value);
                clearError('text');
              }}
            />

            <TagPicker
              id="topic-tags"
              label="Теги"
              value={tags}
              onChange={setTags}
              suggestions={tagSuggestions}
            />
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-end">
            <LinkButton to="/forum" variant="secondary" fullWidth>
                Отмена
              </LinkButton>
            <Button
              type="submit"
              variant="forum"
              loading={isSending}
              iconLeft={!isSending ? <Send className="h-4 w-4" aria-hidden="true" /> : undefined}
            >
              {isSending ? 'Публикуем' : 'Опубликовать вопрос'}
            </Button>
          </div>
        </form>

        {/* Подсказки и живое превью */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-[88px] lg:self-start">
          <section className="rounded-card border border-line bg-forum-soft p-5">
            <h2 className="text-h3 text-forum-strong">Чтобы ответили быстрее</h2>
            <ul className="mt-3 space-y-2 text-caption text-ink">
              <li className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-forum-strong" aria-hidden="true" />
                Один вопрос — одна тема.
              </li>
              <li className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-forum-strong" aria-hidden="true" />
                Напишите, что уже пробовали.
              </li>
              <li className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-forum-strong" aria-hidden="true" />
                Добавьте цифры: температуру, режим, срок.
              </li>
            </ul>
          </section>

          <section aria-label="Как тема будет выглядеть в ленте">
            <h2 className="mb-3 font-display text-caption font-semibold text-muted-strong">Превью в ленте</h2>
            {/* Превью — та же карточка, что в ленте. Отдельной вёрстки нет,
                поэтому оно не разойдётся с настоящим списком */}
            <div className="pointer-events-none opacity-90">
              <TopicCard topic={previewTopic} />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
