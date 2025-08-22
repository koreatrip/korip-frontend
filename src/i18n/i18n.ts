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
    // lng: 'ko',
    fallbackLng: 'ko',
    returnObjects: true,
    interpolation: {
      escapeValue: false,
    },
    keySeparator: '.', // 점으로 중첩 키 구분
    nsSeparator: false,
    detection: {
      // 언어를 감지할 순서
      order: ['querystring', 'localStorage', 'navigator'],
      // URL 쿼리스트링에서 언어를 찾을 때 사용할 키
      lookupQuerystring: 'language',
      // 감지된 언어를 저장할 위치 (선택 사항)
      caches: ['localStorage'],
      // 캐시에서 사용할 키 (선택 사항)
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;
