/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // ── Палитра из ТЗ. Названия семантические (paper/ink/line), а не «beige-100»,
      // чтобы при смене цвета не пришлось переименовывать классы во всём проекте.
      colors: {
        paper: '#FAF6F0', // фон страницы
        surface: '#FFFFFF', // карточки и панели
        ink: '#2E2A26', // основной текст
        muted: {
          DEFAULT: '#7A7268', // второстепенный текст НА БЕЛОМ (контраст 4.74 — AA ок)
          strong: '#6B6359', // тот же текст НА КРЕМОВОМ фоне (#7A7268 там даёт 4.40 — чуть ниже AA)
        },
        accent: {
          DEFAULT: '#E07856', // терракота: заливки, иконки, подчёркивания, hover
          strong: '#B4552F', // та же терракота, затемнённая: фон кнопок и ссылки (белый текст = 5.3 — AA)
          soft: '#FBEDE7', // светлая подложка
        },
        forum: {
          DEFAULT: '#4A7C59', // зелёный форума (белый текст = 4.86 — AA ок)
          strong: '#3C6749',
          soft: '#EAF2EC',
        },
        med: {
          DEFAULT: '#5B8DB8', // синий «медицины» — только декор
          strong: '#3F6D96', // для текста и кнопок
          soft: '#EAF1F7',
        },
        line: '#E8E2D9', // границы и разделители
      },
      fontFamily: {
        display: ['Manrope', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Типографическая шкала из ТЗ: 14 / 16 / 18 / 24 / 36
      fontSize: {
        caption: ['14px', { lineHeight: '1.5' }],
        body: ['16px', { lineHeight: '1.65' }],
        h3: ['18px', { lineHeight: '1.35' }],
        h2: ['24px', { lineHeight: '1.25' }],
        h1: ['30px', { lineHeight: '1.2' }], // мобильный размер H1
        'h1-lg': ['36px', { lineHeight: '1.15' }], // десктопный (md:text-h1-lg)
      },
      borderRadius: {
        ctl: '12px', // контролы: кнопки, поля, чипсы
        card: '16px', // карточки и панели
      },
      boxShadow: {
        soft: '0 2px 8px rgba(46, 42, 38, 0.08)',
        lift: '0 10px 26px rgba(46, 42, 38, 0.12)',
      },
      maxWidth: { content: '1200px' },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.4s cubic-bezier(0.22, 0.61, 0.36, 1) both',
        shimmer: 'shimmer 1.4s infinite',
      },
    },
  },
  plugins: [],
};
