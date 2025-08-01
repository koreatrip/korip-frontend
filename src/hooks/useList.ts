import { useTranslation } from 'react-i18next';

const isStringArray = (value: unknown): value is string[] => {
  return (
    Array.isArray(value) && value.every((item) => typeof item === 'string')
  );
};

export const useList = (namespace: string = 'tips') => {
  const { t } = useTranslation();

  const getList = (key: string): string[] => {
    const fullKey =
      key.includes('.') && key.startsWith(namespace)
        ? key
        : `${namespace}.${key}`;

    const list = t(fullKey, { returnObjects: true });
    return isStringArray(list) ? list : [];
  };

  return getList;
};
