import { useCallback, useEffect, useRef, useState } from 'react';

export type LoadStatus = 'loading' | 'ready' | 'error';

interface Options {
  /** Задержка «ответа сервера», мс */
  delay?: number;
  /** Принудительная ошибка — чтобы показать состояние error без бэкенда */
  fail?: boolean;
}

/**
 * Имитация загрузки данных.
 *
 * Сейчас данные лежат в файлах и доступны мгновенно, но скелетоны и экран
 * ошибки нужно где-то увидеть — иначе они «есть в коде», но не проверены.
 * Когда появится настоящий API, этот хук заменяется на fetch, а компоненты
 * страниц не меняются вообще: у них тот же статус и та же кнопка «Повторить».
 *
 * Первый аргумент — строковый ключ (например, id предмета), а не сами данные:
 * массив пересоздаётся при каждом рендере, и зависимость по нему
 * уводила бы эффект в бесконечный цикл.
 */
export function useSimulatedLoad<T>(key: string, produce: () => T, options: Options = {}) {
  const { delay = 500, fail = false } = options;

  // Храним функцию в ref, чтобы её пересоздание не перезапускало загрузку
  const produceRef = useRef(produce);
  produceRef.current = produce;

  const [status, setStatus] = useState<LoadStatus>('loading');
  const [data, setData] = useState<T | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setStatus('loading');
    setData(null);

    const timer = setTimeout(() => {
      if (fail) {
        setStatus('error');
        return;
      }
      setData(produceRef.current());
      setStatus('ready');
    }, delay);

    return () => clearTimeout(timer);
  }, [key, delay, fail, attempt]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  return { status, data, retry };
}
