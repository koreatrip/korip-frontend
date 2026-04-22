import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import ErrorBoundary from './components/common/ErrorBoundary';
import ErrorPage from './pages/statusPage/errorPage';
import { useAuthStore } from './stores/useAuthStore';
import { useEffect } from 'react';
import LoadingPage from './pages/statusPage/loadingPage';

function App() {
  const { initialize } = useAuthStore((state) => state.actions);
  const isInitialized = useAuthStore((state) => state.auth.isInitialized);

  useEffect(() => {
    initialize(); // 앱 켜질 때마다 서버에 검증 요청
  }, []);

  if (!isInitialized) return <LoadingPage />;
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;
