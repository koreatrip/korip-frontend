// src/locales/index.ts
import en from './en/translation.json';
import ko from './ko/translation.json';
import ja from './ja/translation.json';
import zh from './zh/translation.json';

// 여기서 한 번에 모아서 내보냅니다.
export const resources = {
  en: { translation: en },
  ko: { translation: ko },
  ja: { translation: ja },
  zh: { translation: zh },
} as const;
