import Cookies from 'js-cookie';
import { useMemo } from 'react';

export const useAuthCheck = () => {
  const isLoggedIn = useMemo(() => {
    return !!Cookies.get('access_token');
  }, []);

  return { isLoggedIn };
};
