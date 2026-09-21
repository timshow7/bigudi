import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { EmptyState } from '../components/ui/EmptyState';
import { Button, LinkButton } from '../components/ui/Button';

/**
 * Временная страница-заглушка для экранов, которых ещё нет
 * (статья, лента форума, тема форума, профиль, поиск).
 * Нужна, чтобы ни одна ссылка в прототипе не вела в пустоту:
 * неработающие ссылки на защите проекта выглядят хуже, чем честное «скоро».
 */
export function StubPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="container-page pb-4 pt-2">
      <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: title }]} />
      <div className="py-8">
        <EmptyState
          title={title}
          description={description}
          action={
            <LinkButton to="/" variant="secondary">Вернуться к плану квартиры</LinkButton>
          }
        />
      </div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div className="container-page py-20">
      <EmptyState
        variant="search"
        title="Страница не найдена"
        description="Проверьте адрес или начните с плана квартиры — оттуда можно попасть в любой раздел."
        action={
          <LinkButton to="/">К плану квартиры</LinkButton>
        }
      />
    </div>
  );
}
