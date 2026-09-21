import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AppStateProvider } from './store/AppState';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Не найден элемент #root в index.html');

createRoot(container).render(
  <StrictMode>
    {/* Общее состояние поднято выше маршрутизации: избранное, свои темы
        и настройки профиля нужны сразу нескольким экранам */}
    <AppStateProvider>
      <App />
    </AppStateProvider>
  </StrictMode>,
);
