import { useEffect, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';

const LanguageRedirect = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    if (!searchParams.has('lang')) {
      searchParams.set('lang', i18n.language || 'ko');
      navigate(
        {
          pathname: location.pathname,
          search: searchParams.toString(),
        },
        { replace: true }
      );
    }
  }, [location, navigate, i18n.language]);

  return children;
};

export default LanguageRedirect;
