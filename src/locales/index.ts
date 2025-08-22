// src/locales/index.ts
import en from './en/translation.json';
import ko from './ko/translation.json';
import jp from './ja/translation.json';
import cn from './zh/translation.json';

// 여기서 한 번에 모아서 내보냅니다.
export const resources = {
  en: { translation: en },
  ko: { translation: ko },
  jp: { translation: jp },
  cn: { translation: cn },
} as const;
