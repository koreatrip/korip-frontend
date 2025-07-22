import { useTranslation } from 'react-i18next';

export const useList = (namespace = 'tips') => {
  const { t } = useTranslation();

  const getList = (key) => {
    // namespace가 이미 포함되어 있으면 그대로, 없으면 추가
    const fullKey =
      key.includes('.') && key.startsWith(namespace)
        ? key
        : `${namespace}.${key}`;

    const list = t(fullKey, { returnObjects: true });
    return Array.isArray(list) ? list : [];
  };

  return getList;
};
