import { useSearchParams } from 'react-router';

export const useNumericSearchParam = (paramName: string): number | null => {
  const [searchParams] = useSearchParams();
  const value = searchParams.get(paramName);

  if (!value) return null;

  const num = Number(value);
  return isNaN(num) ? null : num;
};
