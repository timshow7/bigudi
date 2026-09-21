import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { RoomPage } from './pages/RoomPage';
import { SubcategoryPage } from './pages/SubcategoryPage';
import { ArticlePage } from './pages/ArticlePage';
import { ForumFeedPage } from './pages/ForumFeedPage';
import { ForumTopicPage } from './pages/ForumTopicPage';
import { CreateTopicPage } from './pages/CreateTopicPage';
import { ProfilePage } from './pages/ProfilePage';
import { SearchPage } from './pages/SearchPage';
import { NotFoundPage, StubPage } from './pages/StubPage';

/**
 * Маршруты повторяют путь пользователя из ТЗ:
 *   /                          — квартира целиком
 *   /room/:roomId              — комната крупным планом
 *   /room/:roomId/:itemId      — подкатегория: статьи и обсуждения
 *   /article/:articleId        — статья
 *   /forum                     — лента форума
 *   /forum/:topicId            — тема с ответами
 *
 * Адрес читается как маршрут в квартире — это удобно и для отладки,
 * и для демонстрации: любую страницу можно открыть по прямой ссылке.
 */
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      {/* Ссылка для клавиатуры: первый Tab на странице перепрыгивает шапку */}
      <a href="#content" className="skip-link">
        Перейти к содержимому
      </a>

      <div className="flex min-h-screen flex-col">
        <Header />

        <main id="content" className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/room/:roomId" element={<RoomPage />} />
            <Route path="/room/:roomId/:itemId" element={<SubcategoryPage />} />

            <Route path="/article/:articleId" element={<ArticlePage />} />

            <Route path="/forum/new" element={<CreateTopicPage />} />
            <Route path="/forum/:topicId" element={<ForumTopicPage />} />
            <Route path="/forum" element={<ForumFeedPage />} />

            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* Настройки живут во вкладке профиля, отдельной страницы нет */}
            <Route
              path="/settings"
              element={<StubPage title="Настройки" description="Настройки переехали во вкладку «Настройки» в профиле." />}
            />
            <Route
              path="/about"
              element={<StubPage title="О проекте" description="Кто делает «Бигуди» и зачем." />}
            />
            <Route
              path="/rules"
              element={<StubPage title="Правила форума" description="Как задавать вопросы и что модераторы удаляют." />}
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
