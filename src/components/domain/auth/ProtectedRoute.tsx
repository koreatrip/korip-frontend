// components/auth/ProtectedRoute.tsx
import { useAuthStore } from '@/stores/useAuthStore';
import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router';

const ProtectedRoute = () => {
  const { auth, actions } = useAuthStore();

  useEffect(() => {
    if (!auth.isInitialized) {
      actions.initialize();
    }
  }, [auth.isInitialized, actions]);

  // 초기화되지 않았으면 로딩
  if (!auth.isInitialized) {
    return <div>로딩중...</div>;
  }

  if (!auth.isLogin) {
    return <Navigate to='/explore/regions' replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
