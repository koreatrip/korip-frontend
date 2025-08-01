// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
// index.ts에서 resources를 한 번에 가져옵니다!
import { resources } from '../locales/index';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ko',
    fallbackLng: 'en',
    returnObjects: true,
    interpolation: {
      escapeValue: false,
    },
    keySeparator: '.', // 점으로 중첩 키 구분
    nsSeparator: false,
  });

export default i18n;
